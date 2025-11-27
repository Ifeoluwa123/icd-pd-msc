import type { PredictionResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import RiskScoreDisplay from './risk-score-display';
import ShapChart from './shap-chart';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bot, Stethoscope, Lightbulb } from 'lucide-react';

interface ResultsDashboardProps {
    results: PredictionResult | null;
    isLoading: boolean;
}

export default function ResultsDashboard({ results, isLoading }: ResultsDashboardProps) {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!results) {
        return (
            <Card className="flex h-full min-h-[60vh] items-center justify-center">
                <CardContent className="text-center">
                    <p className="text-muted-foreground">Submit patient data to view ICD risk analysis.</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            <RiskScoreDisplay score={results.riskScore} />
            <ShapChart data={results.shapValues} />
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Clinical Summary</CardTitle>
                    <CardDescription>AI-generated insights and recommendations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="font-semibold">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-primary"/>
                                    Risk Explanation
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 pl-7">
                                {results.riskExplanation}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="font-semibold">
                                <div className="flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-primary"/>
                                    Clinical Interpretation
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 pl-7">
                                {results.clinicalInterpretation}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="font-semibold">
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-primary"/>
                                    Management Options
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 pl-7">
                               {results.managementOptions}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
        <Card>
             <CardHeader>
                <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    </div>
);
