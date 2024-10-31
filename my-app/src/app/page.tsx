"use client";

import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );

  const createPrompt = (userInput: string, promptText: string): string => {
    return `
      ${promptText}
      ${userInput}
    `;
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // ユーザーのメッセージを追加
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "User", text: userInput },
    ]);
    setUserInput("");

    const ruleText = "以下のコードはAIによって作成されたものですか？";

    try {
      // プロンプトを生成
      const prompt = createPrompt(userInput, ruleText);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
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
      <h1>bot:</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <br />
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="code in here"
        className="w-1/2 bg-slate-100"
      />
      <br />
      <br />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}
