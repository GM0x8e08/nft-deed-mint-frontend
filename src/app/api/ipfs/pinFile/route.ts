import { NextRequest } from 'next/server';
import { pinBufferToIPFS } from '@/lib/ipfs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'Missing file' }), { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const res = await pinBufferToIPFS(buffer, file.name || 'upload');
    return new Response(JSON.stringify({
      ipfsHash: res.IpfsHash,
      pinSize: res.PinSize,
      timestamp: res.Timestamp,
      uri: `ipfs://${res.IpfsHash}`,
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error('pinFile error:', err);
    return new Response(JSON.stringify({ error: message, stack }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}


