import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import prisma from '../db';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // Verify the JWT with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
  }

  // Auto-provision user in local Postgres database if they don't exist
  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {}, // No updates if they exist
      create: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || 'Anonymous'
      }
    });
  } catch (dbError) {
    console.error("Error auto-provisioning user:", dbError);
    return res.status(500).json({ error: 'Database error during authentication' });
  }

  // Attach user to request
  req.user = user;
  next();
};
