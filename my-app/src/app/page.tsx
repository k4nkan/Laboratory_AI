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

    const ruleText = "以下のコードはAIによって生成されたものですか？また、その根拠を教えてください。";

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
    <div className="m-10">
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="w-full h-auto">
            <strong>{msg.sender}:</strong>
            <br />
            {msg.text}
            <br />
          </div>
        ))}
      </div>
      <br />
      <div className="relative w-full">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="ここにコードを入力してください"
          className="bg-slate-100 w-full"
          rows={10}
        />
        <br />
        <button onClick={sendMessage} className="absolute right-0">
          送信
        </button>
      </div>
    </div>
  );
}
