'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import PatientForm from '@/components/app/patient-form';
import ResultsDashboard from '@/components/app/results-dashboard';
import type { PatientFormState, PredictionResult } from '@/lib/types';
import { generateClinicalSummary } from '@/ai/flows/generate-clinical-summary';
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
      const isBehavioral = feature.startsWith('TM') || feature.startsWith('CNTRL');
      const baseValue = isBehavioral ? 0.3 : 0.1;
      mockShapValues[feature] = parseFloat((Math.random() * baseValue * 2 - baseValue).toFixed(4));
    });
    
    const sortedShap = Object.entries(mockShapValues)
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));

    const topFeatures = sortedShap.slice(0, 3).reduce((acc, [key, value]) => {
      acc[featureLabels[key as keyof typeof featureLabels] || key] = value;
      return acc;
    }, {} as Record<string, number>);


    try {
      // 2. Generate Clinical Summary
      const summaryResult = await generateClinicalSummary({
        riskScore,
        topFeatures,
        patientHistory: 'Patient history shows increasing gambling time and reduced behavioral control.',
      });
      
      const shapValuesForChart = Object.entries(mockShapValues).map(([feature, value]) => ({ 
        feature: featureLabels[feature as keyof typeof featureLabels] || feature, 
        value 
      }));

      setResults({
        riskScore,
        shapValues: shapValuesForChart,
        riskExplanation: summaryResult.riskExplanation,
        clinicalInterpretation: summaryResult.clinicalInterpretation,
        managementOptions: summaryResult.managementOptions,
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
