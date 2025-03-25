import { useState } from 'react';
import OpenAI from 'openai';

export function useOpenAI() {
  const [loading, setLoading] = useState(false);

  const analyzeImage = async (base64Image: string) => {
    try {
      setLoading(true);
      
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Note: In production, you should proxy these requests through your backend
      });

      // Remove the data URL prefix if present
      const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this invoice image and extract the total amount and a brief description of the expense. Return the result as a JSON object with 'amount' (number) and 'description' (string) fields."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        max_tokens: 150
      });

      const result = response.choices[0]?.message?.content;
      if (!result) throw new Error('No analysis result received');

      return JSON.parse(result);
    } catch (error: any) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeImage,
    loading
  };
}
