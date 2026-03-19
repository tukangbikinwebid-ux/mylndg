"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "cs";
  timestamp: Date;
}

const suggestedQuestions = [
  "Bagaimana cara memohon pinjaman?",
  "Berapa kadar faedah pinjaman?",
  "Bagaimana status permohonan saya?",
  "Bagaimana cara membuat bayaran balik?",
  "Saya perlu bantuan dengan akaun saya",
];

const autoReplies: Record<string, string> = {
  "Bagaimana cara memohon pinjaman?":
    "Untuk memohon pinjaman, sila pergi ke halaman utama dan klik butang 'Mohon Pinjaman'. Anda perlu mengisi maklumat peribadi, jumlah pinjaman yang dikehendaki, dan tempoh bayaran balik. Pastikan semua dokumen telah dimuat naik sebelum menghantar permohonan.",
  "Berapa kadar faedah pinjaman?":
    "Kadar faedah pinjaman kami bermula dari 5% setahun bergantung kepada jumlah pinjaman dan tempoh bayaran balik. Untuk maklumat lanjut, sila rujuk halaman pinjaman atau hubungi kami untuk penjelasan terperinci.",
  "Bagaimana status permohonan saya?":
    "Anda boleh menyemak status permohonan anda di halaman 'Sejarah Transaksi' dalam akaun anda. Status permohonan akan dikemas kini secara automatik. Jika ada sebarang pertanyaan lanjut, kami sedia membantu.",
  "Bagaimana cara membuat bayaran balik?":
    "Untuk membuat bayaran balik, sila pergi ke halaman 'Bayaran Balik' dalam akaun anda. Anda boleh membuat bayaran melalui pemindahan bank atau kaedah pembayaran lain yang tersedia. Pastikan nombor rujukan bayaran disimpan.",
  "Saya perlu bantuan dengan akaun saya":
    "Sudah tentu! Sila beritahu kami masalah yang anda hadapi dengan akaun anda. Adakah berkaitan dengan log masuk, kemaskini profil, atau perkara lain? Kami sedia membantu anda menyelesaikan masalah tersebut.",
};

const defaultReply =
  "Terima kasih atas mesej anda. Pegawai kami akan membalas dalam masa terdekat. Sila tunggu sebentar atau cuba soalan yang dicadangkan di atas.";

const welcomeMessage: Message = {
  id: "welcome",
  text: "Selamat datang! Saya adalah pembantu khidmat pelanggan. Bagaimana saya boleh membantu anda hari ini? Sila pilih soalan di bawah atau taip mesej anda.",
  sender: "cs",
  timestamp: new Date(),
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate CS typing and reply
    setIsTyping(true);
    const replyText = autoReplies[text.trim()] || defaultReply;
    const delay = 1000 + Math.random() * 1500;

    setTimeout(() => {
      setIsTyping(false);
      const csMessage: Message = {
        id: `cs-${Date.now()}`,
        text: replyText,
        sender: "cs",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, csMessage]);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] max-w-md mx-auto">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto invisible-scroll px-4 pt-4 pb-4 space-y-4">
        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="animate-enter">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">
              Soalan Popular
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-enter`}
          >
            {msg.sender === "cs" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 00-6-6v1a1 1 0 01-2 0V4a6 6 0 00-6 6h1a1 1 0 110 2H2a6.002 6.002 0 005 5.917V17a1 1 0 102 0v-.083A6.002 6.002 0 0016 12h-1a1 1 0 110-2h1zm-6-3a3 3 0 00-3 3v2a1 1 0 001 1h1v-3a1 1 0 012 0v3h1a1 1 0 001-1v-2a3 3 0 00-3-3z" />
                </svg>
              </div>
            )}
            <div className={`max-w-[75%] ${msg.sender === "user" ? "" : ""}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white/5 border border-white/10 text-gray-800 dark:text-gray-200 rounded-bl-md backdrop-blur-sm"
                }`}
              >
                {msg.text}
              </div>
              <p
                className={`text-[10px] text-gray-400 mt-1 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-enter">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 00-6-6v1a1 1 0 01-2 0V4a6 6 0 00-6 6h1a1 1 0 110 2H2a6.002 6.002 0 005 5.917V17a1 1 0 102 0v-.083A6.002 6.002 0 0016 12h-1a1 1 0 110-2h1zm-6-3a3 3 0 00-3 3v2a1 1 0 001 1h1v-3a1 1 0 012 0v3h1a1 1 0 001-1v-2a3 3 0 00-3-3z" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions - compact strip when messages exist */}
      {messages.length > 1 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-white/5">
          <div className="flex gap-2 overflow-x-auto invisible-scroll">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Bar */}
      <div className="px-4 py-3 pb-20 border-t border-gray-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Taip mesej anda..."
            className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2.5 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              inputText.trim()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
