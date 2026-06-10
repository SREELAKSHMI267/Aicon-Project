'use server';

/**
 * @fileOverview AI content detection flow for academic papers.
 *
 * - checkAiContent - A function that checks a paper for AI-generated content.
 * - CheckAiContentInput - The input type for the checkAiContent function.
 * - CheckAiContentOutput - The return type for the checkAiContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckAiContentInputSchema = z.object({
  paperText: z.string().describe('The text content of the research paper to be checked for AI-generated content.'),
});

export type CheckAiContentInput = z.infer<typeof CheckAiContentInputSchema>;

const CheckAiContentOutputSchema = z.object({
  aiContentScore: z
    .number()
    .describe(
      'A score from 0 to 100 indicating the likelihood that the paper or significant portions contain AI-generated content. 0 = definitely human-written, 100 = definitely AI-generated.'
    ),
  flaggedSections: z
    .array(z.string())
    .describe(
      'An array of exact quotes from the paper that appear to be AI-generated or suspicious. If no sections are flagged, return an empty array.'
    ),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe(
      'Overall risk assessment: Low (0-30), Medium (30-70), High (70-100).'
    ),
  summary: z
    .string()
    .describe(
      'A brief summary of the AI content analysis, explaining the likelihood of AI involvement and key indicators.'
    ),
});

export type CheckAiContentOutput = z.infer<typeof CheckAiContentOutputSchema>;

export async function checkAiContent(input: CheckAiContentInput): Promise<CheckAiContentOutput> {
  return checkAiContentFlow(input);
}

const aiContentCheckPrompt = ai.definePrompt({
  name: 'aiContentCheckPrompt',
  input: {schema: CheckAiContentInputSchema},
  output: {schema: CheckAiContentOutputSchema},
  prompt: `You are an expert at detecting AI-generated content in academic papers. Your task is to analyze a research paper for signs of AI involvement.

Analyze the following paper text and assess the likelihood that it was generated or significantly contributed to by AI tools.

Paper Text: {{{paperText}}}

Your analysis must include:

1. **Calculate an AI Content Score**: Provide a score from 0-100 representing the likelihood of AI generation. Consider patterns like:
   - Overly polished, generic academic language
   - Lack of personal voice or unique perspective
   - Unusual phrasings or repetitive structures
   - Statistically improbable word combinations
   - Unnaturally perfect grammar and transitions
   - Generic examples or citations
   - Lack of specific, original insights
   
2. **Identify Flagged Sections**: List specific sentences or paragraphs that show strong indicators of AI generation. Focus on sections with suspicious patterns.

3. **Determine Risk Level**: Classify as Low (0-30), Medium (30-70), or High (70-100) based on the score.

4. **Write a Summary**: Explain the findings, highlighting the most concerning patterns and indicators.

Be critical and precise. If the paper appears genuinely human-written with natural voice and original thinking, the score should be low.`,
});

const checkAiContentFlow = ai.defineFlow(
  {
    name: 'checkAiContentFlow',
    inputSchema: CheckAiContentInputSchema,
    outputSchema: CheckAiContentOutputSchema,
  },
  async input => {
    const {output} = await aiContentCheckPrompt(input);
    return output!;
  }
);
