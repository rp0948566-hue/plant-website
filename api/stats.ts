import type { VercelRequest, VercelResponse } from "@vercel/node";
import { botanicalSpecimens } from "./specimens";
import { defaultWorks } from "./works";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json({
    service: "Aethera Botanical Core",
    engine: "Vercel Edge / Serverless TypeScript Handler",
    version: "1.0.0",
    total_specimens: botanicalSpecimens.length,
    total_works: defaultWorks.length,
    compression: "Vercel Global Edge Brotli / Gzip",
    cache_policy: "public, max-age=31536000, immutable",
    timestamp: new Date().toISOString(),
  });
}
