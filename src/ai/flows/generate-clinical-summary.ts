'use server';
/**
 * @fileOverview Flow for generating a complete clinical summary based on patient's ICD risk profile.
 *
 * - generateClinicalSummary - A function that generates the summary.
 * - ClinicalSummaryInput - The input type for the generateClinicalSummary function.
 * - ClinicalSummaryOutput - The return type for the generateClinicalSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClinicalSummaryInputSchema = z.object({
  riskScore: z.number().describe('The overall ICD risk score for the patient (0-100).'),
  topFeatures: z.record(z.string(), z.number()).describe('A map of the top contributing features and their SHAP values.'),
  patientHistory: z.string().describe('A brief summary of relevant patient history.'),
});
export type ClinicalSummaryInput = z.infer<typeof ClinicalSummaryInputSchema>;

// Internal schema for the prompt, which expects a stringified JSON for top features
const PromptInputSchema = ClinicalSummaryInputSchema.extend({
    topFeatures: z.string(),
});

const ClinicalSummaryOutputSchema = z.object({
    riskExplanation: z.string().describe("The risk level explained in plain English."),
    clinicalInterpretation: z.string().describe("The clinical interpretation of the findings."),
    managementOptions: z.string().describe("A list of suggested evidence-based management options."),
});
export type ClinicalSummaryOutput = z.infer<typeof ClinicalSummaryOutputSchema>;

export async function generateClinicalSummary(
  input: ClinicalSummaryInput
): Promise<ClinicalSummaryOutput> {
  return generateClinicalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateClinicalSummaryPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: ClinicalSummaryOutputSchema},
  prompt: `You are an AI clinical assistant. 

Based on the data below, explain the risk level in plain English, provide a clinical interpretation, and suggest evidence-based management options.

Risk score: {{{riskScore}}}
Top contributing features:
{{{topFeatures}}}

Patient history: {{{patientHistory}}}
`,
});

const generateClinicalSummaryFlow = ai.defineFlow(
  {
    name: 'generateClinicalSummaryFlow',
    inputSchema: ClinicalSummaryInputSchema,
    outputSchema: ClinicalSummaryOutputSchema,
  },
  async input => {
    // Format the top features for clearer presentation in the prompt
    const featuresString = Object.entries(input.topFeatures)
        .map(([key, value]) => `    ${key}: ${value.toFixed(4)}`)
        .join('\n');

    const promptInput = {
        ...input,
        topFeatures: featuresString,
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
