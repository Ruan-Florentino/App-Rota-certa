import { describe, it, expect, vi, beforeEach } from 'vitest';
import { claimReferral } from '../routes/referral.js';
import * as firebaseAdmin from '../lib/firebaseAdmin.js';
import { Request, Response } from 'express';

vi.mock('../lib/firebaseAdmin.js', () => ({
  getAdminFirestore: vi.fn(),
}));

describe('Referral Route - claimReferral', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      body: { code: 'ABC123' },
      user: { uid: 'claimer-123', email: 'test@example.com' } as any,
    };
    
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('aplica código válido', async () => {
    const mockBatch = {
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(true)
    };
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            get: vi.fn().mockResolvedValue({
              empty: false,
              docs: [{ id: 'referrer-123', data: () => ({ referralCount: 0, points: 0 }) }]
            })
          })
        }),
        doc: vi.fn().mockReturnValue({
          get: vi.fn().mockResolvedValue({
            exists: true,
            data: () => ({ claimedReferral: null, points: 0, limit: 3 })
          })
        })
      }),
      batch: vi.fn().mockReturnValue(mockBatch)
    };
    
    vi.mocked(firebaseAdmin.getAdminFirestore).mockReturnValue(mockDb as any);

    await claimReferral(req as Request, res as Response);
    
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Código aplicado com sucesso.',
    }));
  });

  it('rejeita auto-referral (mesmo user)', async () => {
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            get: vi.fn().mockResolvedValue({
              empty: false,
              // O referrer é o proprio claimer
              docs: [{ id: 'claimer-123', data: () => ({ referralCount: 0, points: 0 }) }]
            })
          })
        })
      })
    };
    
    vi.mocked(firebaseAdmin.getAdminFirestore).mockReturnValue(mockDb as any);

    await claimReferral(req as Request, res as Response);
    
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Você não pode usar seu próprio código.' });
  });

  it('rejeita código inválido (não encontrado)', async () => {
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            get: vi.fn().mockResolvedValue({
              empty: true,
            })
          })
        })
      })
    };
    
    vi.mocked(firebaseAdmin.getAdminFirestore).mockReturnValue(mockDb as any);

    await claimReferral(req as Request, res as Response);
    
    expect(statusMock).toHaveBeenCalledWith(404);
  });

  it('rejeita código já usado', async () => {
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            get: vi.fn().mockResolvedValue({
              empty: false,
              docs: [{ id: 'referrer-123', data: () => ({ referralCount: 0, points: 0 }) }]
            })
          })
        }),
        doc: vi.fn().mockReturnValue({
          get: vi.fn().mockResolvedValue({
            exists: true,
            // claimer ja tem referralClaimed
            data: () => ({ claimedReferral: 'SOME_DB', points: 0, limit: 3 })
          })
        })
      })
    };
    
    vi.mocked(firebaseAdmin.getAdminFirestore).mockReturnValue(mockDb as any);

    await claimReferral(req as Request, res as Response);
    
    expect(statusMock).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Você já utilizou um código de indicação.' });
  });

  it('retorna 503 se db não disponível', async () => {
    vi.mocked(firebaseAdmin.getAdminFirestore).mockReturnValue(null as any);

    await claimReferral(req as Request, res as Response);
    
    expect(statusMock).toHaveBeenCalledWith(503);
  });
});
