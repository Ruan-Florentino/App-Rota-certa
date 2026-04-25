import { Request, Response, NextFunction } from 'express';
import { getAdminAuth } from '../lib/firebaseAdmin.js';

/**
 * Middleware OBRIGATÓRIO — bloqueia se não tiver token válido
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const auth = getAdminAuth();
    
    if (!auth) {
      console.error("Firebase Auth Admin não disponível");
      return res.status(500).json({ error: 'Serviço de autenticação temporariamente indisponível' });
    }

    const decoded = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    };
    
    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      error: 'Token inválido ou expirado',
      code: 'INVALID_TOKEN'
    });
  }
}

/**
 * Middleware OPCIONAL — anexa user se tiver token, mas não bloqueia
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();
    
    const token = authHeader.split('Bearer ')[1];
    const auth = getAdminAuth();
    
    if (!auth) return next();

    const decoded = await auth.verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch {
    next(); // Ignora erros, segue anônimo
  }
}
