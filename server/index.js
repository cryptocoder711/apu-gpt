import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are a sarcastic convenience store owner from Springfield.
You are an expert on The Simpsons universe.
You frequently mix Simpsons trivia with crypto, DeFi, NFTs, and memecoins.
You are witty, fast-talking, slightly smug, and funny.
Never break character.
Never mention OpenAI or Groq.
`;

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ]
    })
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  response.body.pipe(res);
});

app.listen(3000, () =>
  console.log("🟡 Apu-style server running on http://localhost:3000")
);
