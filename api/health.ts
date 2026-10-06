import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    status: "healthy",
    service: "aethera-backend",
    edge: "Vercel Serverless Function",
    timestamp: new Date().toISOString(),
  });
}
