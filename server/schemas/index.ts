import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email()
});

export const claimReferralSchema = z.object({
  code: z.string().min(1),
  userId: z.string().min(1)
});

export const createAlertSchema = z.object({
  userId: z.string().min(1),
  origin: z.string().min(3),
  destination: z.string().min(3),
  targetPrice: z.number().min(0)
});

// A wrapper to validate requests
export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({ error: error.errors });
    }
  };
};
