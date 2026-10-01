import 'server-only';

let cached: string | undefined;

/** Shop logo as a PNG data URL for PDFs. Public files aren't bundled into serverless functions, so fetch it from this site. */
export async function logoDataUrl(requestUrl: string): Promise<string | undefined> {
  if (cached) return cached;
  try {
    const res = await fetch(new URL('/icon-192.png', requestUrl), { signal: AbortSignal.timeout(4000) });
    if (res.ok) cached = `data:image/png;base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  } catch {
    // The invoice still renders without the logo.
  }
  return cached;
}
