import { useState } from "react";
import './App.css';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Todo: Remove hard coding
   */
  const REACT_APP_API_URL = 'http://localhost:8080/create-recipe'

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { type: "user", text: inputMessage }]);
      setInputMessage("");
      setLoading(true);

      try {
        const res = await fetch(REACT_APP_API_URL as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputMessage
          })
        });

        const data = await res.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", text: data.message }
        ]);

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: any) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="chat-container">

      <div className="chatbox">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.type === "user" ? "user" : "bot"}`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
          />
          <button
            disabled={loading}
            style={{
              backgroundColor: loading ? "gray" : "#007bff"
            }}
            onClick={handleSendMessage}>
            {
              loading ? "..." : "Send"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
