// Vercel serverless function entry point
import type { IncomingMessage, ServerResponse } from 'http';

// Import the Express app
let app: any;

try {
  // Dynamic import to handle potential issues
  app = require('../Backend_Portal50/src/index').default;
} catch (error) {
  console.error('Error importing app:', error);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!app) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'App not available' }));
      return;
    }
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}