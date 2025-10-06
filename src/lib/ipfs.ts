import PinataClient from '@pinata/sdk';
import { Readable } from 'node:stream';

// Server-only Pinata client factory. Do not import this in client components.
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getPinataClient() {
  // Prefer JWT if provided; otherwise fall back to key/secret pair
  const jwt = process.env.PINATA_JWT || process.env.JWT;
  if (jwt && jwt.trim().length > 0) {
    // Pass raw JWT; the SDK expects the token value, not a Bearer header
    return new PinataClient({ pinataJWTKey: jwt.trim() });
  }
  const apiKey = getRequiredEnv('NEXT_PUBLIC_PINATA_API_KEY');
  const secretKey = getRequiredEnv('PINATA_SECRET_API_KEY');
  const pinata = new PinataClient(apiKey, secretKey);
  return pinata;
}

export type PinataPinResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

export async function pinJsonToIPFS(json: unknown, name?: string): Promise<PinataPinResponse> {
  const pinata = getPinataClient();
  const options = name ? { pinataMetadata: { name } } : undefined;
  const res = await (pinata as unknown as { pinJSONToIPFS: (body: unknown, opts?: unknown) => Promise<unknown> }).pinJSONToIPFS(
    json,
    options
  );
  return res as PinataPinResponse;
}

export async function pinBufferToIPFS(buffer: Buffer, fileName: string): Promise<PinataPinResponse> {
  const pinata = getPinataClient();
  const stream = Readable.from(buffer);
  const res = await (pinata as unknown as { pinFileToIPFS: (file: unknown, opts?: unknown) => Promise<unknown> }).pinFileToIPFS(
    stream,
    { pinataMetadata: { name: fileName } }
  );
  return res as PinataPinResponse;
}


