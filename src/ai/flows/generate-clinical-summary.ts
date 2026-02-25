'use server';
/**
 * @fileOverview Flow for generating a complete clinical summary based on a patient's ICD risk profile.
 *
 * - generateClinicalSummary - A function that generates the summary.
 * - ClinicalSummaryInput - The input type for the generateClinicalSummary function.
 * - ClinicalSummaryOutput - The return type for the generateClinicalSummary function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

 const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});



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
    riskExplanation: z.string().describe("A plain English summary of the patient's ICD risk level, identifying the key drivers. Example: 'The patient has a high probability of developing an impulse control disorder, primarily driven by increased gambling behavior.'"),
    clinicalInterpretation: z.string().describe("A concise clinical interpretation of the findings, linking them to potential underlying mechanisms in Parkinson's Disease. Example: 'These patterns often emerge in patients on dopamine agonist therapy due to sensitization of mesolimbic reward pathways.'"),
    managementOptions: z.string().describe("A list of evidence-based management strategies tailored to the patient's risk factors. Example: 'It may be appropriate to consider dose reduction, closer caregiver monitoring, or CBT-based ICD management strategies.'"),
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
  prompt: `You are an expert AI clinical assistant specializing in Parkinson's Disease and associated impulse control disorders (ICDs). Your response should be clinical, interpretable, and personalized.

Analyze the following patient data to generate a cohesive clinical summary.

**Patient Data:**
- ICD Risk Score: {{{riskScore}}}
- Top Contributing Risk Factors (Feature: SHAP Value):
{{{topFeatures}}}
- Patient History: {{{patientHistory}}}

**Your Task:**
Based on the data, provide the following in a clinical and integrated manner:
1.  **Risk Explanation**: Explain the risk level in plain English, identifying the key drivers.
2.  **Clinical Interpretation**: Provide a concise clinical interpretation, linking the patterns to potential mechanisms (e.g., dopamine agonist therapy effects on mesolimbic pathways).
3.  **Management Options**: Suggest evidence-based management strategies tailored to the risk factors.

Your output should be structured but read like a unified assessment.
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
        .map(([key, value]) => `    - ${key}: ${value.toFixed(4)}`)
        .join('\n');

    const promptInput = {
        ...input,
        topFeatures: featuresString,
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
