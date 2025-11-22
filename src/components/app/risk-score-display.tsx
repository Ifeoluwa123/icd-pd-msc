import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RiskScoreDisplayProps {
  score: number;
}

export default function RiskScoreDisplay({ score }: RiskScoreDisplayProps) {
  const getRiskProps = (s: number) => {
    if (s > 75) {
      return { level: 'High Risk', color: 'bg-destructive/20 text-destructive-foreground', textColor: 'text-destructive' };
    }
    if (s > 40) {
      return { level: 'Moderate Risk', color: 'bg-amber-500/20 text-amber-500', textColor: 'text-amber-500' };
    }
    return { level: 'Low Risk', color: 'bg-emerald-500/20 text-emerald-500', textColor: 'text-emerald-500' };
  };

  const { level, color, textColor } = getRiskProps(score);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">ICD Risk Prediction</CardTitle>
        <CardDescription>The model's predicted risk score for the patient.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className={cn("relative flex h-32 w-32 items-center justify-center rounded-full", color)}>
          <span className={cn("text-4xl font-bold", textColor)}>{score}%</span>
        </div>
        <p className={cn("text-xl font-semibold", textColor)}>{level}</p>
      </CardContent>
    </Card>
  );
}
