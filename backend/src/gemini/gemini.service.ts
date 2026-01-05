import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async onModuleInit() {
    console.log("--- Gemini Service Initialized with gemini-2.0-flash ---");
  }

  // 1. Description එක අනුව Category එක ලබා ගැනීම
  async getCategory(description: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Categorize the following expense description into EXACTLY one of these categories: [Food, Transport, Bills, Health, Entertainment, Shopping, Other]. 
      Description: "${description}"
      Return ONLY the category word.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let category = response.text().trim().replace(/[^a-zA-Z]/g, '');

      const validCategories = ['Food', 'Transport', 'Bills', 'Health', 'Entertainment', 'Shopping', 'Other'];
      return validCategories.find(c => c.toLowerCase() === category.toLowerCase()) || 'Other';
      
    } catch (error) {
      if (error.status === 429) {
        console.warn("Gemini Quota Limit reached. Defaulting to 'Other'.");
      } else {
        console.error("Gemini Error:", error);
      }
      return 'Other'; 
    }
  }

 async generateAdvice(prompt: string): Promise<string> {
  try {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    if (error.status === 429) {
      console.warn("Gemini Quota exceeded. Waiting for reset...");
      return "We’ve received a high number of requests. Please try again in a few moments.";
    }
    console.error("Gemini Advice Error:", error);
    return "We regret to inform you that financial advice cannot be provided at this time.";
  }
}
}