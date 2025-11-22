'use server';
/**
 * @fileOverview Flow for generating personalized intervention suggestions based on patient risk factors and SHAP analysis.
 *
 * - suggestPersonalizedInterventions - A function that generates personalized intervention suggestions.
 * - InterventionInput - The input type for the suggestPersonalizedInterventions function.
 * - InterventionOutput - The return type for the suggestPersonalizedInterventions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterventionInputSchema = z.object({
  riskFactors: z
    .string()
    .describe('A comma-separated list of risk factors for the patient.'),
  shapAnalysis: z
    .string()
    .describe(
      'The SHAP analysis results, providing insights into the factors driving the ICD risk prediction.'
    ),
  patientDetails: z
    .string()
    .describe('Details of the patient including demographics, clinical and behavioral features'),
});
export type InterventionInput = z.infer<typeof InterventionInputSchema>;

const InterventionOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Personalized intervention suggestions based on the patient’s risk factors and SHAP analysis.'
    ),
});
export type InterventionOutput = z.infer<typeof InterventionOutputSchema>;

export async function suggestPersonalizedInterventions(
  input: InterventionInput
): Promise<InterventionOutput> {
  return suggestPersonalizedInterventionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPersonalizedInterventionsPrompt',
  input: {schema: InterventionInputSchema},
  output: {schema: InterventionOutputSchema},
  prompt: `You are an AI assistant specialized in providing personalized intervention suggestions for Impulse Control Disorders (ICD) in Parkinson’s Disease patients.

  Based on the following patient details: {{{patientDetails}}}

  Considering the following risk factors: {{{riskFactors}}}

  And the SHAP analysis results: {{{shapAnalysis}}}

  Generate personalized intervention suggestions tailored to the patient's specific situation. These suggestions should be practical, actionable, and aimed at mitigating the identified risk factors. Be as specific as possible.
  Speak directly to the user as if you were a clinician.
  `,
});

const suggestPersonalizedInterventionsFlow = ai.defineFlow(
  {
    name: 'suggestPersonalizedInterventionsFlow',
    inputSchema: InterventionInputSchema,
    outputSchema: InterventionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
