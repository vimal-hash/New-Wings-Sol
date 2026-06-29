import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

// The SDK needs the Node.js runtime (not Edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are a helpful assistant for New Wings Solutions, a cinema equipment company in Chennai, India.
We sell: Galalite Screens, Christie Projectors, Leonis 3D Systems, USHIO Lamps, Premium Audio (Dolby Atmos), Luxury Seating.
We offer theatre renovation, installation, and AMC services.
Contact: +91 9444546390, wingsent07@gmail.com
Keep answers short, friendly, and relevant to cinema equipment.
If asked about pricing, say 'Please contact us for a custom quote based on your theatre size.'
Always respond in the same language the user writes in.`;

const FALLBACK_MESSAGE =
  "Hi! I'm the NW Solutions assistant. For immediate help, call +91 9444546390";

// Encode a single chunk of text as a Server-Sent Event.
function sseChunk(text: string): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`);
}

function sseDone(): Uint8Array {
  return new TextEncoder().encode('data: [DONE]\n\n');
}

// Build a one-shot stream that emits the given text then closes.
// Used for the no-API-key fallback and for error recovery.
function staticStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(sseChunk(text));
      controller.enqueue(sseDone());
      controller.close();
    },
  });
}

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
} as const;

export async function POST(req: NextRequest) {
  let message = '';
  try {
    const body = await req.json();
    message = typeof body?.message === 'string' ? body.message.trim() : '';
  } catch {
    message = '';
  }

  if (!message) {
    return new Response(
      staticStream('Please type a message and I’ll be happy to help!'),
      { headers: SSE_HEADERS },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Graceful fallback — the chatbot stays useful even without a key.
  if (!apiKey) {
    return new Response(staticStream(FALLBACK_MESSAGE), { headers: SSE_HEADERS });
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const llmStream = client.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: message }],
        });

        // Forward each text delta to the client as it arrives.
        llmStream.on('text', (delta: string) => {
          controller.enqueue(sseChunk(delta));
        });

        await llmStream.finalMessage();
        controller.enqueue(sseDone());
        controller.close();
      } catch (err) {
        // Never crash the response — degrade to the fallback message.
        console.error('[api/chat] streaming error:', err);
        controller.enqueue(sseChunk(FALLBACK_MESSAGE));
        controller.enqueue(sseDone());
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
