import { useMutation } from '@tanstack/react-query';

type PinJsonRequest = { data: unknown; name?: string };
type PinResponse = { ipfsHash: string; pinSize: number; timestamp: string; uri: string };

async function postJson(body: PinJsonRequest): Promise<PinResponse> {
  const res = await fetch('/api/ipfs/pinJSON', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to pin JSON to IPFS');
  }
  return res.json();
}

async function postFile(file: File): Promise<PinResponse> {
  const formData = new FormData();
  formData.set('file', file);
  const res = await fetch('/api/ipfs/pinFile', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to pin file to IPFS');
  }
  return res.json();
}

export function useUploadMetadata() {
  return useMutation({
    mutationFn: (req: PinJsonRequest) => postJson(req),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => postFile(file),
  });
}


