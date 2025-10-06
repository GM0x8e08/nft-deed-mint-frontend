export const runtime = 'nodejs';

export async function GET() {
  const vars = {
    NEXT_PUBLIC_PINATA_API_KEY: !!process.env.NEXT_PUBLIC_PINATA_API_KEY,
    PINATA_SECRET_API_KEY: !!process.env.PINATA_SECRET_API_KEY,
    PINATA_JWT: !!process.env.PINATA_JWT,
    JWT: !!process.env.JWT,
  };
  return new Response(JSON.stringify(vars), { status: 200, headers: { 'content-type': 'application/json' } });
}


