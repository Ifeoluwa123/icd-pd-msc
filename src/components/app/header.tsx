import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-lg font-semibold text-foreground md:text-xl">
          Parkinson's ICD Insights
        </h1>
      </div>
    </header>
  );
}
