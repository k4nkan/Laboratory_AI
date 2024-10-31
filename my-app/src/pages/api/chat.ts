import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "メッセージが必要です。" });
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });

      const botMessage =
        response.choices[0].message?.content || "エラーが発生しました。";
      return res.status(200).json({ message: botMessage });
    } catch (error) {
      console.error("APIエラー:", error);
      return res.status(500).json({ message: "エラーが発生しました。" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`メソッド ${req.method} は許可されていません`);
  }
}
