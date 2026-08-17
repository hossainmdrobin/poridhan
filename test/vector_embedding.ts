import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const fn = async () => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: ["Customers can return products within 7 days.", "I am Ironman the mervel super hero character"],
    });

    const vector = result.embeddings?.[0]?.values;

    console.log("Vector:", vector);
    console.log("Dimensions:", vector?.length);
}
fn()