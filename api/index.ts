// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';

// Import the Express app
let app: any;

try {
  // Dynamic import to handle potential issues
  app = require('../Backend_Portal50/src/index').default;
} catch (error) {
  console.error('Error importing app:', error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!app) {
      return res.status(500).json({ error: 'App not available' });
    }
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}