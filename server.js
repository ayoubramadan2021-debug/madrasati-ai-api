const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { messages, grade = 1, subject = "عام" } = req.body;

    const systemPrompt = {
      role: "system",
      content: `
أنت معلّم ذكي داخل تطبيق "مدرستي DZ" لتلاميذ الابتدائي في الجزائر.

قاعدة صارمة جدًا:
- لا تنشئ أي سؤال يعتمد على صورة أو شكل أو رسم.
- ممنوع استعمال: في الصورة، انظر إلى الصورة، الشكل التالي، الرسم، الجدول، المخطط.
- كل تمرين يجب أن يكون نصيًا فقط ومفهومًا بدون أي صورة.

قواعد الإجابة:
- اشرح بالعربية الفصحى المبسطة.
- اجعل الشرح مناسبًا لتلميذ في السنة ${grade} ابتدائي.
- المادة الحالية: ${subject}.
- لا تستعمل مصطلحات معقدة.
- اشرح خطوة بخطوة.
- أعط مثالًا بسيطًا من الحياة اليومية في الجزائر عندما يناسب.
- اجعل الإجابة قصيرة وواضحة.
- إذا كان السؤال تمرينًا، لا تعط الجواب مباشرة فقط، بل اشرح طريقة التفكير.
- شجّع التلميذ بلطف في النهاية.
`
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [systemPrompt, ...(messages || [])],
        max_tokens: 1024,
        temperature: 0.7
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
