'use server';
/**
 * @fileOverview Explains the key risk factors influencing a patient's ICD risk prediction.
 *
 * - explainIcdRiskFactors - A function that handles the explanation of ICD risk factors.
 * - ExplainIcdRiskFactorsInput - The input type for the explainIcdRiskFactors function.
 * - ExplainIcdRiskFactorsOutput - The return type for the explainIcdRiskFactors function.
 */

import {ai} from '@/ai/genkit';
import { patientFormSchema } from '@/lib/types';
import {z} from 'genkit';

const ExplainIcdRiskFactorsInputSchema = z.object({
  riskFactors: z.record(z.number()).describe('A map of risk factors and their corresponding SHAP values.'),
  patientDetails: patientFormSchema.describe('Relevant details about the patient, such as age, gender, and medical history.'),
});
export type ExplainIcdRiskFactorsInput = z.infer<typeof ExplainIcdRiskFactorsInputSchema>;

// Internal schema for the prompt, which expects a stringified JSON
const PromptInputSchema = ExplainIcdRiskFactorsInputSchema.extend({
    riskFactors: z.string(),
});

const ExplainIcdRiskFactorsOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the key risk factors influencing the patient\'s ICD risk prediction.'),
});
export type ExplainIcdRiskFactorsOutput = z.infer<typeof ExplainIcdRiskFactorsOutputSchema>;

export async function explainIcdRiskFactors(input: ExplainIcdRiskFactorsInput): Promise<ExplainIcdRiskFactorsOutput> {
  return explainIcdRiskFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainIcdRiskFactorsPrompt',
  input: {
    schema: PromptInputSchema,
  },
  output: {schema: ExplainIcdRiskFactorsOutputSchema},
  prompt: `You are an expert medical professional specializing in Impulse Control Disorders (ICD) in Parkinson\'s Disease patients.

You are provided with a set of risk factors and their corresponding SHAP values, which indicate the influence of each factor on the patient\'s ICD risk prediction. You are also provided with relevant details about the patient.

Based on this information, generate a detailed and easy-to-understand explanation of the key risk factors driving the patient\'s ICD risk. Focus on the most influential factors and explain how they contribute to the overall risk. Tailor the explanation to be understandable for clinicians.

Risk Factors and SHAP Values:
{{{riskFactors}}}

Patient Details:
- Age: {{{patientDetails.age}}}
- Gender: {{{patientDetails.gender}}}
- Years with Parkinson's: {{{patientDetails.yearsWithParkinsons}}}
- Time Spent Gambling (hours/week): {{{patientDetails.TMGAMBLE}}}
- Feels control over gambling: {{{patientDetails.CNTRLGMB}}}
- Time on Sexual Behaviors (hours/week): {{{patientDetails.TMSEX}}}
- Feels control over sexual behaviors: {{{patientDetails.CNTRLSEX}}}
- Time Spent Buying (hours/week): {{{patientDetails.TMBUY}}}
- Feels control over buying: {{{patientDetails.CNTRLBUY}}}
- Time Spent Eating (hours/week): {{{patientDetails.TMEAT}}}
- Feels control over eating: {{{patientDetails.CNTRLEAT}}}
- Time on Other Hobbies/Activities (hours/week): {{{patientDetails.TMTORACT}}}

Explanation:`,
});

const explainIcdRiskFactorsFlow = ai.defineFlow(
  {
    name: 'explainIcdRiskFactorsFlow',
    inputSchema: ExplainIcdRiskFactorsInputSchema,
    outputSchema: ExplainIcdRiskFactorsOutputSchema,
  },
  async input => {
    const promptInput = {
      ...input,
      riskFactors: JSON.stringify(input.riskFactors, null, 2),
    };
    const {output} = await prompt(promptInput);
    return output!;
  }
);
