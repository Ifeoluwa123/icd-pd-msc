import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

interface InterventionCardProps {
  interventions: string;
}

export default function InterventionCard({ interventions }: InterventionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          Personalized Interventions
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground">
        <p>{interventions}</p>
      </CardContent>
    </Card>
  );
}
