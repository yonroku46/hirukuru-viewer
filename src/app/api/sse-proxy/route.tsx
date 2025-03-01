export async function GET(req: Request) {
  const backendSSEUrl = `${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_API_PORT}${process.env.NEXT_PUBLIC_API_ROOT}/SSE/stream`;
  const backendResponse = await fetch(backendSSEUrl, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });

  if (!backendResponse.ok) {
    console.error("Failed to connect to backend SSE:", backendResponse.status, backendResponse.statusText);
    return new Response("Failed to connect to backend SSE", { status: 500 });
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      const reader = backendResponse.body!.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch (error) {
        console.error("SSE Proxy Error:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Transfer-Encoding": "chunked",
    },
  });
}