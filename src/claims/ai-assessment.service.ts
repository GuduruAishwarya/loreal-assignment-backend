import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export type AssessmentDecision = {
  justified: boolean;
  confidenceScore: number;
  reasoning: string;
  rawResponse: Record<string, any>;
};

@Injectable()
export class AiAssessmentService {
  private buildPrompt(productName: string, claimText: string, evidenceText: string, studyType?: string): string {
    return `
      You are a scientific evaluator for cosmetic and personal care claims.

      Decide whether the provided evidence supports the stated claim.
      Be conservative. If the evidence is weak, incomplete, mismatched, or inconclusive,
      return justified as false.

      Product: ${productName}
      Claim: ${claimText}
      Evidence: ${evidenceText}
      Study Type: ${studyType ?? 'not provided'}

      Return JSON only in this format:
      {
        "justified": true,
        "confidenceScore": 0.87,
        "reasoning": "A brief justification"
      }
    `;
  }

  private parseAssessmentResponse(content: string): Record<string, any> {
    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  private normalizeDecision(parsed: Record<string, any>): AssessmentDecision {
    return {
      justified: Boolean(parsed.justified),
      confidenceScore:
        typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0,
      reasoning:
        typeof parsed.reasoning === 'string' ? parsed.reasoning : 'No reasoning provided',
      rawResponse: parsed,
    };
  }

  async assessEvidence(productName: string, claimText: string, evidenceText: string, studyType?: string): Promise<AssessmentDecision> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new BadRequestException('GEMINI_API_KEY is not configured');
    }

    const prompt = this.buildPrompt(productName, claimText, evidenceText, studyType);
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text ?? '{}';
    console.log('AI Assessment Response (Gemini):', text);
    return this.normalizeDecision(this.parseAssessmentResponse(text));
  }
}
