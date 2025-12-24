import { MessageSquare, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! AI assistance. Ask me anything about!",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetch(
        "https://ai-model-back-end.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: currentInput, mode: "text" }),
        }
      );

      const data = await response.json();

      // Add AI response to the chat
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.result, type: data.type },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I'm having trouble connecting to the server.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm"> AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-800 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-black text-white self-end rounded-tr-none"
                    : "bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about anything..."
              className="flex-1 outline-none text-sm py-2 px-3 bg-gray-100 rounded-full focus:ring-1 focus:ring-black transition-all"
            />
            <button
              onClick={handleSend}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-white text-black rotate-90 border border-gray-200"
            : "bg-black text-white hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
