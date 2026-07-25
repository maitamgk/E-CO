import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { Send, X, ChevronDown } from 'lucide-react';
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
  '🍃 Sản phẩm bán chạy?',
  '💰 Báo giá sỉ',
  '🛒 Cách đặt hàng',
  '🏢 Khắc logo DN',
  '🎨 B-ECO Art',
];

const WELCOME_MSG: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Xin chào! 🌿 Tôi là trợ lý tư vấn AI của B-ECO.\n\nTôi có thể giúp bạn:\n• Tìm hiểu sản phẩm sinh thái từ lá bàng biển\n• Tư vấn giá lẻ, giá sỉ & doanh nghiệp\n• Hướng dẫn đặt hàng\n\nBạn cần tôi giúp gì? 🍃',
};

/* ── Helpers ─────────────────────────────────────────── */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Renders message text with clickable links for:
 * - Phone numbers (0xxx xxx xxx)
 * - Email addresses
 * - URLs (http/https/zalo.me)
 * - Bold text (**text**)
 */
const formatMessageContent = (text: string) => {
  // Combined regex: URLs | emails | VN phone numbers | **bold**
  const pattern =
    /(https?:\/\/[^\s)]+|zalo\.me\/[^\s)]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|((?:0|\+84)\d[\d\s.-]{7,12}\d)|(\*\*(.+?)\*\*)/g;

  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [fullMatch, url, email, phone, , boldText] = match;
    const key = `lnk-${match.index}`;

    if (url) {
      const href = url.startsWith('http') ? url : `https://${url}`;
      const label = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      parts.push(
        <a key={key} href={href} target="_blank" rel="noreferrer" className="chatbot-link">
          {label}
        </a>,
      );
    } else if (email) {
      parts.push(
        <a key={key} href={`mailto:${email}`} className="chatbot-link">
          {email}
        </a>,
      );
    } else if (phone) {
      const cleanPhone = phone.replace(/[\s.-]/g, '');
      parts.push(
        <a key={key} href={`tel:${cleanPhone}`} className="chatbot-link chatbot-link--phone">
          📞 {phone.trim()}
        </a>,
      );
    } else if (boldText) {
      parts.push(<strong key={key}>{boldText}</strong>);
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

/* ── Component ───────────────────────────────────────── */
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
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

  /* Detect scroll position for "scroll to bottom" button */
  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  /* Focus input when opening */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
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

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed };
    const botMsgId = uid();

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const historyForApi = [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

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

  const showQuickReplies = messages.length <= 2 && !isStreaming;

  const charCountClass = [
    'chatbot-char-count',
    input.length > 0 ? 'chatbot-char-count--visible' : '',
    input.length >= MAX_INPUT_LEN
      ? 'chatbot-char-count--limit'
      : input.length >= MAX_INPUT_LEN * 0.8
        ? 'chatbot-char-count--warn'
        : '',
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
          <span className="chatbot-trigger-label">Hỏi B-ECO AI ✨</span>
          <span className="chatbot-trigger-icon">
            <img
              src={chatbotAvatar}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
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
              <img
                src={chatbotAvatar}
                alt="B-ECO AI"
                className="h-full w-full rounded-[inherit] object-cover"
              />
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
              <X className="h-[18px] w-[18px] stroke-[2]" />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" ref={messagesRef}>
            {/* Welcome Section */}
            {messages.length <= 1 && (
              <div className="chatbot-welcome">
                <img
                  src={chatbotAvatar}
                  alt=""
                  className="chatbot-welcome-avatar"
                />
                <h3 className="chatbot-welcome-title">Chào mừng đến B-ECO! 🌿</h3>
                <p className="chatbot-welcome-text">
                  Trợ lý AI sẵn sàng tư vấn sản phẩm sinh thái từ lá bàng biển, báo giá & hỗ trợ đặt hàng.
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
                    <img
                      src={chatbotAvatar}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="chatbot-msg-bubble">
                  {formatMessageContent(msg.content)}
                  {isStreaming &&
                    msg.id !== 'welcome' &&
                    msg.role === 'assistant' &&
                    msg === messages[messages.length - 1] &&
                    msg.content !== '' && <span className="chatbot-cursor" />}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className="chatbot-msg chatbot-msg--bot">
                <div className="chatbot-msg-avatar">
                  <img
                    src={chatbotAvatar}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
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

          {/* Scroll to bottom button */}
          {showScrollBtn && (
            <button
              type="button"
              onClick={scrollToBottom}
              className="absolute left-1/2 -translate-x-1/2 bottom-[8.5rem] z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card shadow-md transition-all hover:shadow-lg hover:scale-110"
              aria-label="Cuộn xuống"
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

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
                  onClick={() => sendMessage(text)}
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
              placeholder="Nhập câu hỏi về sản phẩm B-ECO..."
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
              <Send className="h-[16px] w-[16px] stroke-[2]" />
            </button>
          </form>

          <div className="chatbot-footer-tag">Powered by B-ECO AI · Groq</div>
        </div>
      )}
    </>
  );
};
