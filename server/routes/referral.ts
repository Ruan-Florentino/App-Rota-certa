import { Request, Response } from 'express';
import { getAdminFirestore } from '../lib/firebaseAdmin.js';

export const claimReferral = async (req: Request, res: Response) => {
  const { code } = req.body;
  const claimerUid = req.user!.uid;

  const db = getAdminFirestore();
  if (!db) {
    return res.status(503).json({ error: 'Serviço temporariamente indisponível' });
  }

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('referralCode', '==', code.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Código inválido ou não encontrado.' });
    }

    const referrerDoc = snapshot.docs[0];
    if (referrerDoc.id === claimerUid) {
      return res.status(400).json({ error: 'Você não pode usar seu próprio código.' });
    }

    const claimerRef = db.collection('users').doc(claimerUid);
    const claimerDoc = await claimerRef.get();
    if (claimerDoc.exists && claimerDoc.data()?.claimedReferral) {
      return res.status(409).json({ error: 'Você já utilizou um código de indicação.' });
    }

    const batch = db.batch();
    batch.update(db.collection('users').doc(referrerDoc.id), {
      referralCount: (referrerDoc.data()?.referralCount || 0) + 1,
      points: (referrerDoc.data()?.points || 0) + 500,
    });
    batch.update(claimerRef, {
      claimedReferral: code.toUpperCase(),
      points: (claimerDoc.data()?.points || 0) + 500,
      limit: (claimerDoc.data()?.limit || 3) + 3,
    });
    await batch.commit();

    return res.json({
      success: true,
      message: 'Código aplicado com sucesso.',
      reward: { points: 500, generations: 3 }
    });
  } catch (error) {
    console.error('Error claiming referral:', error);
    return res.status(500).json({ error: 'Erro interno ao processar o código.' });
  }
};
