import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { Send, X } from 'lucide-react';
import chatbotAvatar from '@/assets/chatbot-avatar.png';
import './chatbot.css';

/* ── Types ──────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/* ── Constants ──────────────────────────────────────── */
const MAX_INPUT_LEN = 500;

const QUICK_REPLIES = [
  'Sản phẩm bán chạy nhất?',
  'Giá sỉ cho doanh nghiệp?',
  'Hướng dẫn đặt hàng',
  'Khắc logo doanh nghiệp',
  'Sản phẩm B-ECO Art',
];

const WELCOME_MSG: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Xin chào! 🌿 Tôi là trợ lý tư vấn AI của B-ECO. Tôi có thể giúp bạn tìm hiểu về sản phẩm sinh thái từ lá bàng biển, tư vấn giá cả, hoặc hướng dẫn đặt hàng. Bạn cần tôi giúp gì?',
};

/* ── Helpers ─────────────────────────────────────────── */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ── Component ───────────────────────────────────────── */
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* Auto-scroll to bottom */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* Focus input when opening */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  /* Auto-resize textarea */
  const handleInputChange = (value: string) => {
    if (value.length <= MAX_INPUT_LEN) {
      setInput(value);
    }
  };

  const autoResizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  /* Open / Close handlers */
  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  /* Send message */
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed };
    const botMsgId = uid();

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    // Build history for API (exclude welcome, only include user/assistant messages)
    const historyForApi = [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Add empty bot message for streaming
    setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: '' }]);

    try {
      abortRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForApi }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Lỗi ${response.status}`);
      }

      // Process SSE stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Không thể đọc response');

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          const data = trimmedLine.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulated += parsed.content;
              const snapshot = accumulated;
              setMessages(prev =>
                prev.map(m => (m.id === botMsgId ? { ...m, content: snapshot } : m)),
              );
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // If no content received, show fallback
      if (!accumulated) {
        setMessages(prev =>
          prev.map(m =>
            m.id === botMsgId
              ? { ...m, content: 'Xin lỗi, tôi chưa thể trả lời lúc này. Vui lòng thử lại! 🍃' }
              : m,
          ),
        );
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled
        setMessages(prev => prev.filter(m => m.id !== botMsgId));
      } else {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
        setError(errorMessage);
        setMessages(prev => prev.filter(m => m.id !== botMsgId));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  /* Show quick replies only when there are few messages and not streaming */
  const showQuickReplies = messages.length <= 2 && !isStreaming;

  const charCountClass = [
    'chatbot-char-count',
    input.length > 0 ? 'chatbot-char-count--visible' : '',
    input.length >= MAX_INPUT_LEN ? 'chatbot-char-count--limit' : input.length >= MAX_INPUT_LEN * 0.8 ? 'chatbot-char-count--warn' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      {!isOpen && (
        <button
          type="button"
          className="chatbot-trigger"
          onClick={handleOpen}
          aria-label="Mở chatbot B-ECO"
        >
          <span className="chatbot-trigger-label">Hỏi B-ECO AI</span>
          <span className="chatbot-trigger-icon">
            <img src={chatbotAvatar} alt="" className="h-7 w-7 rounded-md object-cover" />
            {hasUnread && <span className="chatbot-unread" />}
          </span>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className={`chatbot-window ${isClosing ? 'chatbot-window-exit' : ''}`}
          role="dialog"
          aria-label="Chatbot B-ECO"
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <img src={chatbotAvatar} alt="B-ECO AI" className="h-6 w-6 rounded-md object-cover" />
            </div>
            <div className="chatbot-header-info">
              <div className="chatbot-header-title">B-ECO AI</div>
              <div className="chatbot-header-status">
                <span className="chatbot-status-dot" />
                Sẵn sàng tư vấn
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={handleClose}
              aria-label="Đóng chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {/* Welcome Section */}
            {messages.length <= 1 && (
              <div className="chatbot-welcome">
                <img src={chatbotAvatar} alt="" className="h-16 w-16 rounded-2xl object-cover shadow-md" />
                <h3 className="chatbot-welcome-title">Chào mừng đến B-ECO!</h3>
                <p className="chatbot-welcome-text">
                  Tôi có thể giúp bạn tìm sản phẩm sinh thái từ lá bàng biển, báo giá sỉ & lẻ, hoặc
                  hướng dẫn đặt hàng.
                </p>
              </div>
            )}

            {/* Message Bubbles */}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`chatbot-msg chatbot-msg--${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="chatbot-msg-avatar">
                    <img src={chatbotAvatar} alt="" className="h-full w-full rounded-[inherit] object-cover" />
                  </div>
                )}
                <div className="chatbot-msg-bubble">
                  {msg.content}
                  {/* Streaming cursor */}
                  {isStreaming &&
                    msg.id !== 'welcome' &&
                    msg.role === 'assistant' &&
                    msg === messages[messages.length - 1] && (
                      <span className="inline-block w-[5px] h-[14px] ml-[2px] align-text-bottom bg-current opacity-60 animate-pulse" />
                    )}
                </div>
              </div>
            ))}

            {/* Typing indicator (before first content arrives) */}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className="chatbot-msg chatbot-msg--bot">
                <div className="chatbot-msg-avatar">
                  <img src={chatbotAvatar} alt="" className="h-full w-full rounded-[inherit] object-cover" />
                </div>
                <div className="chatbot-msg-bubble">
                  <div className="chatbot-typing">
                    <span className="chatbot-typing-dot" />
                    <span className="chatbot-typing-dot" />
                    <span className="chatbot-typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && <div className="chatbot-error">{error}</div>}

          {/* Quick Replies */}
          {showQuickReplies && (
            <div className="chatbot-quick-replies">
              {QUICK_REPLIES.map(text => (
                <button
                  key={text}
                  type="button"
                  className="chatbot-quick-reply"
                  onClick={() => handleQuickReply(text)}
                  disabled={isStreaming}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Character Counter */}
          <div className={charCountClass}>
            {input.length}/{MAX_INPUT_LEN}
          </div>

          {/* Input Area */}
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                handleInputChange(e.target.value);
                autoResizeTextarea(e.target);
              }}
              onKeyDown={handleKeyDown}
              className="chatbot-input"
              placeholder="Nhập tin nhắn..."
              rows={1}
              disabled={isStreaming}
              aria-label="Nhập tin nhắn cho chatbot"
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!input.trim() || isStreaming}
              aria-label="Gửi tin nhắn"
            >
              <Send className="h-[17px] w-[17px] stroke-[1.8]" />
            </button>
          </form>

          <div className="chatbot-footer-tag">Powered by B-ECO AI · Groq</div>
        </div>
      )}
    </>
  );
};
