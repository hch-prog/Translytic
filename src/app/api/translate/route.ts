import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { sourceText, selectedLanguage } = await request.json();

        if (!sourceText || !selectedLanguage) {
            return NextResponse.json(
                { error: "Source text and language are required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `You will be provided with a sentence. This sentence:
      ${sourceText}. Your tasks are to:
      - Detect what language the sentence is in
      - Translate the sentence into ${selectedLanguage}
      Do not return anything other than the translated sentence.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ translatedText: text });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { error: "Failed to translate text" },
            { status: 500 }
        );
    }
} 