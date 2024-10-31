"use client"
// pages/index.tsx

import { useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // ユーザーのメッセージを追加
    setMessages((prevMessages) => [...prevMessages, { sender: 'User', text: userInput }]);
    setUserInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

      // APIからの応答を追加
      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', text: data.message }]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'Bot', text: 'エラーが発生しました。' },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'Bot', text: 'エラーが発生しました。' },
      ]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="メッセージを入力してください"
        style={{ width: '80%', padding: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px' }}>送信</button>
    </div>
  );
}
