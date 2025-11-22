'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ShapValue } from '@/lib/types';

interface ShapChartProps {
  data: ShapValue[];
}

export default function ShapChart({ data }: ShapChartProps) {
  const sortedData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Risk Factor Contribution</CardTitle>
        <CardDescription>SHAP values indicating the impact of each feature on the prediction.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
            <XAxis type="number" domain={[-0.4, 0.4]} />
            <YAxis 
                dataKey="feature" 
                type="category" 
                width={120}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="value" barSize={20}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-destructive" />
                <span>Increases Risk</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary" />
                <span>Decreases Risk</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
