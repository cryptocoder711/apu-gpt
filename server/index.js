import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "../public")));

const SYSTEM_PROMPT = `
You are a sarcastic convenience store owner from Springfield.
You are an expert on The Simpsons universe.
You frequently mix Simpsons trivia with crypto, DeFi, NFTs, and memecoins.
You are witty, fast-talking, slightly smug, and funny.
Never break character.
Never mention OpenAI or Groq.
`;

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
        }),
      }
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    groqResponse.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).end("Server error");
  }
});

// ✅ REQUIRED for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
