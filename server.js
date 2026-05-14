const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "AI server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Madrasati AI API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("AI API running on port " + PORT);
});
