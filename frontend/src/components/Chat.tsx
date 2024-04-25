import React, { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket';

interface ChatProps {
    username: string;
    sendJsonMessage: (message: object) => void;
}

interface Message {
    type: string;
    text: string;
}

const Chat: React.FC<ChatProps> = ({username, sendJsonMessage}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]); // Состояние для хранения сообщений
  
    const sendMessage = () => {
        if (message.trim() !== '') {
          const newMessage = { type: 'message', text: message, sender: username }; // Добавляем информацию о отправителе
          sendJsonMessage(newMessage); // Отправляем сообщение на сервер
          setMessage('');
        }
      };
  
    // Обработчик новых сообщений от сервера
    const { lastJsonMessage } = useWebSocket('ws://localhost:8000', {
      queryParams: { username }
    });
  
    useEffect(() => {
        if (lastJsonMessage && (lastJsonMessage as Message).type === 'message') {
          setMessages(prevMessages => [...prevMessages, (lastJsonMessage as Message).text]);
        }
      }, [lastJsonMessage]);
  
    return (
      <div className="chat">
        <h3>Chat</h3>
        <div className="chat-messages">
          {/* Отображаем все сообщения */}
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
  )
}

export default Chat
