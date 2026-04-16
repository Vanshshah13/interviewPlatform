import axios from "axios";

export const generateQuestions = async (role, difficulty, count) => {
  try {
    const prompt = `
Generate exactly ${count} ${difficulty} level interview questions 
for a ${role} developer.

Respond ONLY in valid JSON array format like , with no text or explainations:
[
  "Question 1",
  "Question 2",
  "Question 3"
]
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct", // free model
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const aiText = response.data.choices[0].message.content;

    try {
      const parsed = JSON.parse(aiText);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      throw new Error("Not an array");

    } catch (err) {
      console.log("Raw AI Response:", aiText);

      // Remove brackets safely
      const cleaned = aiText
        .replace(/^\s*\[\s*/, "")   // remove starting [
        .replace(/\s*\]\s*$/, "")   // remove ending ]
        .split("\n")
        .map(q => q.replace(/^[",\s]+|[",\s]+$/g, ""))
        .filter(q => q.length > 0);

      return cleaned;
    }


  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to generate questions");
  }
};
