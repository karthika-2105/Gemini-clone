
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("" );

const main = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);

  return text;
};

export default main;
