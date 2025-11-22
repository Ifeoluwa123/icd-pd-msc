import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface ExplanationCardProps {
  explanation: string;
}

export default function ExplanationCard({ explanation }: ExplanationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI-Powered Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground">
        <p>{explanation}</p>
      </CardContent>
    </Card>
  );
}
