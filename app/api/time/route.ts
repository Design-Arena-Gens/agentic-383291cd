import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const now = new Date();
  const iso = now.toISOString();
  const epochMs = now.getTime();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return new Response(
    JSON.stringify({ iso, epochMs, timezone }),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      }
    }
  );
}
