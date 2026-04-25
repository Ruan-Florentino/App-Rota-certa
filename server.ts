import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

import { requireAuth, optionalAuth } from './server/middleware/auth.js';
import { generateMockup } from './server/routes/mockup.js';
import { getAffiliateFlights, getAffiliateHotels } from './server/routes/affiliates.js';
import { getCities, getSuggestions, getDestinationById } from './server/routes/destinations.js';
import { getPlaceImage, getLocationImages } from './server/routes/images.js';
import { createSubscription, handleMercadoPagoWebhook } from './server/routes/mercadopago.js';
import { createAlert, deleteAlert, getUserAlerts, checkAlerts } from './server/routes/alerts.js';
import { generateContent, getTipOfTheDay } from './server/routes/gemini.js';
import { claimReferral } from './server/routes/referral.js';

import { 
  validateRequest, 
  createSubscriptionSchema, 
  claimReferralSchema, 
  createAlertSchema 
} from './server/schemas/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);

  const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rightway.app',
    'https://www.rightway.app',
    'https://rightway-staging.vercel.app',
    'https://ais-dev-s2vdj7wmk2ti2m2z726htm-325277446074.us-west2.run.app',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Permite requests sem origin (mobile apps, curl, Postman em dev)
      if (!origin) return callback(null, true);
      
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      
      // Em dev, loga origem rejeitada pra debug
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`CORS rejeitou origem: ${origin}`);
      }
      
      return callback(new Error('Não permitido pelo CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // Cache preflight por 24h
  }));

  app.use(helmet({
    // Mantém desligado — necessário para mapas e iframes externos
    crossOriginEmbedderPolicy: false,
    
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",      // Vite HMR em dev + alguns inline necessários
          "'unsafe-eval'",        // Necessário para o HMR do Vite no Preview
          "https://api.maptiler.com",
          "https://unpkg.com",
          "blob:",
        ],
        
        styleSrc: [
          "'self'",
          "'unsafe-inline'",      // Tailwind injeta estilos inline
          "https://fonts.googleapis.com",
          "https://api.maptiler.com",
        ],
        
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:",
        ],
        
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",               // CDNs de destinos de viagem
          "https://unpkg.com",
        ],
        
        connectSrc: [
          "'self'",
          "https://*.firebaseio.com",
          "https://*.googleapis.com",
          "https://*.firebaseapp.com",
          "https://firebase.googleapis.com",
          "https://firestore.googleapis.com",
          "https://identitytoolkit.googleapis.com",
          "https://securetoken.googleapis.com",
          "https://api.maptiler.com",
          "https://generativelanguage.googleapis.com",  // Gemini AI
          "https://unpkg.com",
          "wss://*.firebaseio.com",                     // Firestore realtime
          "ws:",                                        // Vite HMR
          "wss:",                                       // Vite HMR wss
        ],
        
        workerSrc: ["'self'", "blob:"],  // OBRIGATÓRIO — MapLibre usa Web Workers
        
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        
        reportUri: "/api/csp-report",
        reportTo: "csp-endpoint",
        
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
  }));

  app.use(express.json());

  // STRUCTURED LOGGING
  // Removemos pino-pretty do target pois pode falhar em ambientes de container sem a dependência instalada.
  // Em produção (Cloud Run), logs JSON são preferíveis para integração com Cloud Logging.
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // Omitimos transport para usar stdout puro (JSON) que é o padrão do pino e funciona em qualquer lugar.
  });
  
  app.use(pinoHttp({ logger }));

  // RATE LIMITERS
  const generalLimiter = rateLimit({ 
    windowMs: 60 * 1000, 
    max: 100, 
    keyGenerator: (req) => {
      // @ts-ignore
      return req.user?.uid || ipKeyGenerator(req);
    },
    message: "Muitas requisições, tente novamente mais tarde.",
    validate: { xForwardedForHeader: false }
  });

  const geminiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30, // Max 30 prompts per UID per minute
    keyGenerator: (req) => {
      // @ts-ignore
      return req.user?.uid || ipKeyGenerator(req);
    },
    message: 'Muitas requisições à IA. Aguarde um momento.',
    validate: { xForwardedForHeader: false }
  });

  app.use('/api/', generalLimiter);

  // 1. MOCKUP
  app.get('/api/generate-mockup', requireAuth, generateMockup);

  // 2. CITIES AND DESTINATIONS (Removed duplicated search)
  app.get('/api/cities', optionalAuth, getCities);
  app.get('/api/suggestions', optionalAuth, getSuggestions);
  app.get('/api/destination/:id', optionalAuth, getDestinationById);

  // 3. FLIGHTS AND HOTELS
  app.get('/api/flights', optionalAuth, getAffiliateFlights);
  app.get('/api/hotels', optionalAuth, getAffiliateHotels);

  // 4. PLACES (Proxy)
  // Removed proxy as it was mock code

  // 5. WEATHER & CURRENCY (Proxies)

  // 6. IMAGES
  app.get('/api/place-image', getPlaceImage);
  app.get('/api/location-images', getLocationImages);

  // 7. GROWTH
  app.post('/api/referral/claim', requireAuth, validateRequest(claimReferralSchema), claimReferral);

  // 10. MERCADO PAGO
  app.post('/api/create-subscription', requireAuth, validateRequest(createSubscriptionSchema), createSubscription);
  app.post('/api/webhook/mercadopago', handleMercadoPagoWebhook);

  // 11. PRICE ALERTS
  app.post('/api/alerts', requireAuth, validateRequest(createAlertSchema), createAlert);
  app.delete('/api/alerts/:id', requireAuth, deleteAlert);
  app.get('/api/alerts/:userId', requireAuth, getUserAlerts);
  app.post('/api/alerts/check', checkAlerts);

  app.post('/api/csp-report', (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('CSP Violation:', req.body);
    }
    res.status(204).end();
  });

  // 12. GEMINI PROXY
  app.post('/api/gemini/generate', requireAuth, geminiRateLimiter, generateContent);
  app.get('/api/gemini/tip-of-the-day', geminiRateLimiter, getTipOfTheDay);

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // GLOBAL ERROR MIDDLEWARE (2.3)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || 'Erro Interno no Servidor', 
      code: err.code 
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RotaCerta Server running on http://localhost:${PORT}`);
  });
}

startServer();
