import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBox({ onClose }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat", { message });
      const botMsg = { sender: "bot", text: res.data.reply || "Xin lỗi, tôi chưa hiểu câu hỏi này." };
      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
      const errorMsg =
        err.response?.status === 429
          ? "⏳ Shop đang quá tải, vui lòng thử lại sau 1 phút nhé 🍦"
          : "⚠️ Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.";
      setChat((prev) => [...prev, { sender: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox">
        <div className="chat-header">
          💬 Hỏi về kem của chúng tôi
          <button className="close-btn" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="messages">
          {chat.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              <div className="bubble">{msg.text}</div>
            </div>
          ))}
          {loading && <div className="loading">Đang trả lời...</div>}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="input-area">
          <input
            type="text"
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nhập câu hỏi về kem..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading} className="chat-send">
            {loading ? "..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}
