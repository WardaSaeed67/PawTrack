/**
 * Server-side Gemini API proxy.
 * The API key lives in .env.local (GEMINI_API_KEY) and is never sent to the browser.
 * The client calls /api/gemini and this route forwards to Google, streaming the response back.
 */
export async function POST(request) {
  const key = process.env.GEMINI_API_KEY;

  if (!key || key === 'paste_your_gemini_api_key_here') {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not configured in .env.local' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${key}`;

  try {
    const upstream = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return new Response(errText, {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Pipe the streaming response directly back to the client
    // This preserves the word-by-word streaming effect in the UI
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
