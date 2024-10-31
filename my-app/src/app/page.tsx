// src/app/page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // ユーザーのメッセージを追加
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "User", text: userInput },
    ]);
    setUserInput("");

    try {
      const response = await fetch(`http://localhost:3000/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

      // APIからの応答を追加
      if (response.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Bot", text: data.message },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Bot", text: "エラーが発生しました。" },
        ]);
      }
    } catch (error) {
      console.error("メッセージ送信中のエラー:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: "エラーが発生しました。" },
      ]);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="メッセージを入力してください"
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}
