import { NextRequest } from 'next/server';
import { pinJsonToIPFS } from '@/lib/ipfs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, name } = body ?? {};
    if (!data) {
      return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }
    const res = await pinJsonToIPFS(data, name);
    return new Response(JSON.stringify({
      ipfsHash: res.IpfsHash,
      pinSize: res.PinSize,
      timestamp: res.Timestamp,
      uri: `ipfs://${res.IpfsHash}`,
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    const raw = (() => { try { return JSON.stringify(err); } catch { return undefined; } })();
    console.error('pinJSON error:', err);
    return new Response(JSON.stringify({ error: message, stack, raw }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}


