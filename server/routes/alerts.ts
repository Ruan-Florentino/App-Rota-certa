import { Request, Response } from 'express';
import { getAdminFirestore } from '../lib/firebaseAdmin.js';

const getAdminDb = () => {
    return getAdminFirestore();
}

export const createAlert = async (req: Request, res: Response) => {
    try {
        const { userId, destination, origin, targetPrice } = req.body;
        const db = getAdminDb();
        if (!db) {
             console.warn("No Admin DB, mocking alert creation");
             return res.json({ id: 'mock-id-' + Date.now(), success: true });
        }
        
        const docRef = await db.collection('priceAlerts').add({
            userId,
            destination,
            origin,
            targetPrice: Number(targetPrice),
            active: true,
            createdAt: new Date(),
            lastChecked: new Date(),
            lastPrice: null
        });
        
        res.json({ id: docRef.id, success: true });
    } catch (error: any) {
        console.error("Error creating alert:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const db = getAdminDb();
        if (db) {
            await db.collection('priceAlerts').doc(id).delete();
        }
        res.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting alert:", error);
        res.status(500).json({ error: error.message });
    }
}

export const getUserAlerts = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const db = getAdminDb();
        if (!db) {
             return res.json([]);
        }
        
        const snapshot = await db.collection('priceAlerts').where('userId', '==', userId).get();
        const alerts = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                // Ensure dates are parsed correctly to client
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                lastChecked: data.lastChecked?.toDate ? data.lastChecked.toDate().toISOString() : data.lastChecked
            };
        });
        res.json(alerts);
    } catch (error: any) {
        console.error("Error getting alerts:", error);
        res.status(500).json({ error: error.message });
    }
}

export const checkAlerts = async (req: Request, res: Response) => {
    try {
        const db = getAdminDb();
        if (!db) return res.json({ success: true, message: "No DB connection for cron" });
        
        const snapshot = await db.collection('priceAlerts').where('active', '==', true).get();
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            // Simulate checking real price (mocking a fluctuation around the target price)
            const simulatedCurrentPrice = data.targetPrice + (Math.random() * 400 - 250); 
            
            if (simulatedCurrentPrice <= data.targetPrice) {
                // Trigger notification via createNotification equivalent logic
                await db.collection('notifications').add({
                    userId: data.userId,
                    title: 'Voo barato encontrado!',
                    body: `Sua passagem de ${data.origin} para ${data.destination} atingiu R$ ${Math.floor(simulatedCurrentPrice)}`,
                    type: 'price_alert',
                    read: false,
                    createdAt: new Date(),
                    link: `/alerts`
                });
                
                await doc.ref.update({
                    lastPrice: simulatedCurrentPrice,
                    lastChecked: new Date(),
                    // Optionally disable it after firing to not spam
                    // active: false 
                });
            } else {
                await doc.ref.update({
                     lastPrice: simulatedCurrentPrice,
                     lastChecked: new Date()
                });
            }
        }
        
        res.json({ success: true, checked: snapshot.docs.length });
    } catch (error: any) {
        console.error("Error checking alerts:", error);
        res.status(500).json({ error: error.message });
    }
}
