'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  content:
    "Hi! 👋 I'm the NW Solutions assistant. Ask me about our cinema equipment, renovation services, or get a quick quote estimate!",
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

export default function ChatBot() {
  const isChatOpen = useUIStore((s) => s.isChatOpen);
  const toggleChat = useUIStore((s) => s.toggleChat);

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Clear the unread dot once the panel is opened.
  useEffect(() => {
    if (isChatOpen) setHasUnread(false);
  }, [isChatOpen]);

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isStreaming]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const assistantId = `a-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ]);
    setInput('');
    setIsStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Read the SSE stream and append deltas to the active assistant message.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') continue;

          try {
            const { text: delta } = JSON.parse(payload) as { text?: string };
            if (delta) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + delta } : m,
                ),
              );
            }
          } catch {
            // Ignore malformed chunks.
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I couldn't connect right now. Please call us at +91 9444546390.",
              }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        onClick={toggleChat}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat assistant'}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-cobalt-500 to-lavender-500 text-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isChatOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isChatOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </motion.span>
        </AnimatePresence>

        {/* Unread dot */}
        {!isChatOpen && hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden bg-elev border border-strong shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-cobalt-500 to-lavender-500 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-sm">NW Assistant</div>
                  <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded-full mt-0.5">
                    AI-powered
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleChat}
                aria-label="Close chat"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface"
            >
              {messages.map((m) => {
                const isUser = m.role === 'user';
                const isPending = !isUser && m.content === '' && isStreaming;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        isUser
                          ? 'bg-cobalt-500 text-white rounded-br-sm'
                          : 'bg-elev text-fg border border-soft rounded-bl-sm'
                      }`}
                    >
                      {isPending ? <TypingDots /> : m.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-soft bg-elev">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about our equipment..."
                  aria-label="Chat message"
                  className="flex-1 rounded-full bg-surface border border-soft px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-cobalt-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={isStreaming || !input.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-cobalt-500 to-lavender-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
