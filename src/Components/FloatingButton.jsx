import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "Who is Arnold?",
  "What's Arnold's tech stack?",
  "How can I hire Arnold?",
  "Tell me how I can contact Arnold.",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hey! I'm Arnold AI 👋 Ask me anything about Arnold's work, skills, or how to get in touch.",
};

// ── Inline formatter: **bold**, *italic*, `code`, [text](url), bare URLs ──
function inlineFormat(text) {
  const parts = [];
  const regex =
    /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s,]+))/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    if (match[2]) {
      parts.push(
        <strong key={match.index} style={{ fontWeight: 700, color: "#e2e8f0" }}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <em key={match.index} style={{ fontStyle: "italic", color: "#94a3b8" }}>
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      parts.push(
        <code
          key={match.index}
          style={{
            fontFamily: "monospace",
            fontSize: "11.5px",
            background: "rgba(37,99,235,0.18)",
            color: "#93c5fd",
            padding: "1px 5px",
            borderRadius: "4px",
            border: "1px solid rgba(37,99,235,0.2)",
          }}
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      // [label](url)
      parts.push(
        <a
          key={match.index}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#60a5fa",
            textDecoration: "none",
            borderBottom: "1px solid rgba(96,165,250,0.35)",
            wordBreak: "break-all",
          }}
        >
          {match[5]}
        </a>
      );
    } else if (match[7]) {
      // bare URL
      parts.push(
        <a
          key={match.index}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#60a5fa",
            textDecoration: "none",
            borderBottom: "1px solid rgba(96,165,250,0.35)",
            wordBreak: "break-all",
          }}
        >
          {match[7]}
        </a>
      );
    }

    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

// ── Block-level markdown → React elements ──
function renderMarkdown(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // ## Heading 2
    if (line.startsWith("## ")) {
      out.push(
        <p
          key={i}
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#93c5fd",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "1px solid rgba(37,99,235,0.2)",
            paddingBottom: "3px",
            margin: "10px 0 5px",
          }}
        >
          {inlineFormat(line.slice(3))}
        </p>
      );
      i++;
      continue;
    }

    // ### Heading 3
    if (line.startsWith("### ")) {
      out.push(
        <p
          key={i}
          style={{ fontSize: "13px", fontWeight: 700, color: "#bfdbfe", margin: "7px 0 3px" }}
        >
          {inlineFormat(line.slice(4))}
        </p>
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(
          <li key={i} style={{ marginBottom: "2px" }}>
            {inlineFormat(lines[i].slice(2))}
          </li>
        );
        i++;
      }
      out.push(
        <ul
          key={`ul-${i}`}
          style={{
            paddingLeft: "16px",
            margin: "4px 0",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            listStyleType: "disc",
          }}
        >
          {items}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(
          <li key={i} style={{ marginBottom: "2px" }}>
            {inlineFormat(lines[i].replace(/^\d+\. /, ""))}
          </li>
        );
        i++;
      }
      out.push(
        <ol
          key={`ol-${i}`}
          style={{
            paddingLeft: "16px",
            margin: "4px 0",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            listStyleType: "decimal",
          }}
        >
          {items}
        </ol>
      );
      continue;
    }

    // Normal paragraph
    out.push(
      <p key={i} style={{ margin: "3px 0", lineHeight: 1.6 }}>
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return out;
}

export default function FloatingButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API;
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply ?? "Sorry, I couldn't get a response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage(input);
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      <div
        className={`
          fixed bottom-30 left-10 z-50 w-[360px] max-h-[560px] flex flex-col
          rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20
          bg-[#0d1117] text-white
          transition-all duration-300 ease-in-out origin-bottom-left
          ${open ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"}
        `}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
         
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/30">
              A
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">Arnold AI</p>
              <p className="text-xs text-cyan-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                Online · Portfolio Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

       
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-[#161b22] border border-blue-500/10 text-gray-200 rounded-bl-sm"
                  }
                `}
              >
                 
                {msg.role === "assistant" ? renderMarkdown(msg.text) : msg.text}
              </div>
            </div>
          ))}

         
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="cursor-pointer text-xs px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-150"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

           
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#161b22] border border-blue-500/10 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

     
        <div className="px-3 py-3 border-t border-blue-500/10 bg-[#0d1117]">
          <div className="flex items-center gap-2 bg-[#161b22] border border-blue-500/20 rounded-xl px-3 py-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Arnold's work..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="cursor-pointer w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-2">Powered by Arnold AI v1.0</p>
        </div>
      </div>

       
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`
          fixed cursor-pointer bottom-20 left-4 z-50 w-12 h-12 rounded-full
          bg-gradient-to-br from-blue-600 to-cyan-500
          shadow-lg shadow-blue-500/40
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          hover:scale-110 hover:shadow-blue-500/60
          ${open ? "rotate-90" : "rotate-0"}
        `}
        aria-label="Toggle Arnold AI chat"
      >
        {open ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && (
          <span className="absolute w-full h-full rounded-full border-2 border-blue-400/50 animate-ping" />
        )}
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>
    </>
  );
}

