import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const headersList = headers();
  const authorization = headersList.get('authorization');
  const refreshToken = headersList.get('refreshtoken');

  if (!authorization || !refreshToken) {
    return new Response('Unauthorized access', { status: 401 });
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_SSE_URL}:${process.env.NEXT_PUBLIC_API_PORT}${process.env.NEXT_PUBLIC_API_ROOT}/SSE/stream`;

    const upstream = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'RefreshToken': refreshToken,
        'Accept': 'text/event-stream',
      }
    });

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error('SSE Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}