import admin from 'firebase-admin';

let isInitialized = false;

export function getFirebaseAdmin() {
  if (!isInitialized && admin.apps.length === 0) {
    try {
      // Tentar carregar service account de diferentes locais prováveis
      const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
      
      if (serviceAccountVar) {
        try {
          const serviceAccount = JSON.parse(serviceAccountVar);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          isInitialized = true;
          console.log("Firebase Admin inicializado via FIREBASE_SERVICE_ACCOUNT");
        } catch (parseError) {
          console.error("Erro ao fazer parse de FIREBASE_SERVICE_ACCOUNT:", parseError);
        }
      } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        });
        isInitialized = true;
        console.log("Firebase Admin inicializado via variáveis individuais");
      } else {
        console.warn("Firebase Admin: Nenhuma credencial encontrada (FIREBASE_SERVICE_ACCOUNT ou variáveis individuais). Algumas funções do servidor podem não funcionar.");
      }
    } catch (error) {
      console.error("Erro crítico ao inicializar Firebase Admin:", error);
    }
  }
  return admin;
}

export const adminDb = isInitialized || admin.apps.length > 0 ? admin.firestore() : null;
export const adminAuth = isInitialized || admin.apps.length > 0 ? admin.auth() : null;

// Re-avaliar adminDb/adminAuth dinamicamente se necessário
export function getAdminFirestore() {
  getFirebaseAdmin();
  return admin.apps.length > 0 ? admin.firestore() : null;
}

export function getAdminAuth() {
  getFirebaseAdmin();
  return admin.apps.length > 0 ? admin.auth() : null;
}
