'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import PatientForm from '@/components/app/patient-form';
import ResultsDashboard from '@/components/app/results-dashboard';
import type { PatientFormState, PredictionResult } from '@/lib/types';
import { explainIcdRiskFactors } from '@/ai/flows/explain-icd-risk-factors';
import { suggestPersonalizedInterventions } from '@/ai/flows/suggest-personalized-interventions';
import { useToast } from '@/hooks/use-toast';
import { featureLabels } from '@/lib/types';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handlePredict = async (data: PatientFormState) => {
    setIsLoading(true);
    setResults(null);

    // 1. Mock prediction & SHAP values
    const riskScore = Math.floor(Math.random() * 71) + 20; // 20-90

    const features = Object.keys(featureLabels);

    const mockShapValues: Record<string, number> = {};
    features.forEach(feature => {
      // Generate more impactful random values for demonstration
      const isBehavioral = feature.startsWith('TM') || feature.startsWith('CNTRL');
      const baseValue = isBehavioral ? 0.3 : 0.1;
      mockShapValues[feature] = parseFloat((Math.random() * baseValue * 2 - baseValue).toFixed(4));
    });

    try {
      // 2. Get SHAP explanation
      const explanationResult = await explainIcdRiskFactors({
        riskFactors: mockShapValues,
        patientDetails: data,
      });

      const shapExplanation = explanationResult.explanation;
      const riskFactorsString = Object.entries(mockShapValues)
        .filter(([, value]) => value > 0.05)
        .map(([key]) => featureLabels[key as keyof typeof featureLabels] || key)
        .join(', ');

      // 3. Get intervention suggestions
      const interventionResult = await suggestPersonalizedInterventions({
        riskFactors: riskFactorsString || 'none identified',
        shapAnalysis: shapExplanation,
        patientDetails: data,
      });
      
      const shapValuesForChart = Object.entries(mockShapValues).map(([feature, value]) => ({ 
        feature: featureLabels[feature as keyof typeof featureLabels] || feature, 
        value 
      }));

      setResults({
        riskScore,
        shapValues: shapValuesForChart,
        shapExplanation,
        interventions: interventionResult.suggestions,
      });

    } catch (error) {
      console.error("AI flow error:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to generate AI insights. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <PatientForm onSubmit={handlePredict} isLoading={isLoading} />
            </div>
            <div className="flex flex-col gap-6">
                <ResultsDashboard results={results} isLoading={isLoading} />
            </div>
        </div>
      </main>
    </div>
  );
}
