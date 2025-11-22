import { z } from 'zod';

export const featureLabels = {
    age: 'Age',
    gender: 'Gender',
    yearsWithParkinsons: 'Years with Parkinson\'s',
    TMGAMBLE: 'Time Spent Gambling',
    CNTRLGMB: 'Control Over Gambling',
    TMSEX: 'Time on Sexual Behaviors',
    CNTRLSEX: 'Control Over Sexual Behaviors',
    TMBUY: 'Time Spent Buying',
    CNTRLBUY: 'Control Over Buying',
    TMEAT: 'Time Spent Eating',
    CNTRLEAT: 'Control Over Eating',
    TMTORACT: 'Time on Other Activities',
};

export const patientFormSchema = z.object({
  age: z.number().min(18, "Age must be at least 18").max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  yearsWithParkinsons: z.number().min(0, "Cannot be negative").max(80),
  TMGAMBLE: z.number().min(0).max(40),
  CNTRLGMB: z.enum(['Yes', 'No']),
  TMSEX: z.number().min(0).max(40),
  CNTRLSEX: z.enum(['Yes', 'No']),
  TMBUY: z.number().min(0).max(40),
  CNTRLBUY: z.enum(['Yes', 'No']),
  TMEAT: z.number().min(0).max(40),
  CNTRLEAT: z.enum(['Yes', 'No']),
  TMTORACT: z.number().min(0).max(40),
});

export type PatientFormState = z.infer<typeof patientFormSchema>;

export type ShapValue = {
  feature: string;
  value: number;
};

export type PredictionResult = {
  riskScore: number;
  shapValues: ShapValue[];
  shapExplanation: string;
  interventions: string;
};
