import axios from "axios";

export const evaluateAnswers = async (questions, answers) => {
  try {
    const prompt = `
You are a strict technical interviewer.

Evaluate each answer out of 10.
Use full range from 0 to 10.

Return ONLY valid JSON.
No explanation.
No markdown.

Format:
{
  "scores": [number, number, number],
  "feedback": "Detailed improvement feedback"
}

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are an API that ONLY returns valid JSON. Never include markdown or explanation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Interview Platform",
        },
      }
    );

    let aiText = response.data.choices[0].message.content;

    console.log("RAW AI RESPONSE:", aiText);

    // ✅ Remove markdown if present
    aiText = aiText.replace(/```json|```/g, "").trim();

    // ✅ Extract JSON object safely using regex
    const match = aiText.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON object found in AI response");
    }

    let jsonString = match[0];

    // ✅ Fix unescaped newlines inside JSON
    jsonString = jsonString.replace(/\r?\n|\r/g, " ");

    const parsed = JSON.parse(jsonString);

    const scores = Array.isArray(parsed.scores)
      ? parsed.scores
      : answers.map(() => 0);

    const overall =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      scores,
      overallScore: Number(overall.toFixed(2)),
      feedback: parsed.feedback || "No feedback provided.",
    };

  } catch (error) {
    console.error("Evaluation Error:", error.message);

    return {
      scores: answers.map(() => 0),
      overallScore: 0,
      feedback: "Evaluation failed due to AI response formatting issue.",
    };
  }
};
