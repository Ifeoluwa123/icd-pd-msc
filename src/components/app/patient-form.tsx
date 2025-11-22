'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { PatientFormState } from "@/lib/types";
import { patientFormSchema, featureLabels } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface PatientFormProps {
    onSubmit: (data: PatientFormState) => void;
    isLoading: boolean;
}

export default function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const form = useForm<PatientFormState>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      age: 55,
      gender: "Male",
      yearsWithParkinsons: 5,
      TMGAMBLE: 0,
      CNTRLGMB: "Yes",
      TMSEX: 0,
      CNTRLSEX: "Yes",
      TMBUY: 0,
      CNTRLBUY: "Yes",
      TMEAT: 0,
      CNTRLEAT: "Yes",
      TMTORACT: 0,
    },
  });

  const timeFields: (keyof PatientFormState)[] = ['TMGAMBLE', 'TMSEX', 'TMBUY', 'TMEAT', 'TMTORACT'];
  const controlFields: (keyof PatientFormState)[] = ['CNTRLGMB', 'CNTRLSEX', 'CNTRLBUY', 'CNTRLEAT'];
  
  const behaviorPairs = [
      { time: 'TMGAMBLE', control: 'CNTRLGMB', label: 'Gambling'},
      { time: 'TMSEX', control: 'CNTRLSEX', label: 'Sexual Activity'},
      { time: 'TMBUY', control: 'CNTRLBUY', label: 'Shopping'},
      { time: 'TMEAT', control: 'CNTRLEAT', label: 'Eating'},
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Patient Data Input</CardTitle>
        <CardDescription>
          Enter the patient's details to predict ICD risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Demographics</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{featureLabels.age}</FormLabel>
                            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}/></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{featureLabels.gender}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="yearsWithParkinsons" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{featureLabels.yearsWithParkinsons}</FormLabel>
                            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}/></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Behavioral Assessment</h3>
                <p className="text-sm text-muted-foreground">Assess compulsive behaviors over the past month.</p>
                
                {behaviorPairs.map(pair => (
                    <div key={pair.label} className="space-y-4 rounded-lg border p-4">
                         <h4 className="font-semibold">{pair.label}</h4>
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                             <FormField control={form.control} name={pair.time as keyof PatientFormState} render={({ field }) => (
                                 <FormItem>
                                     <FormLabel>{featureLabels[pair.time as keyof typeof featureLabels]}</FormLabel>
                                     <FormControl>
                                        <Slider defaultValue={[0]} max={40} step={1} onValueChange={vals => field.onChange(vals[0])} />
                                     </FormControl>
                                     <FormDescription className="text-right">{field.value} hours/week</FormDescription>
                                     <FormMessage />
                                 </FormItem>
                             )}/>
                             <FormField control={form.control} name={pair.control as keyof PatientFormState} render={({ field }) => (
                                 <FormItem>
                                     <FormLabel>{featureLabels[pair.control as keyof typeof featureLabels]}</FormLabel>
                                     <FormControl>
                                         <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                                             <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                             <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                         </RadioGroup>
                                     </FormControl>
                                     <FormMessage />
                                 </FormItem>
                             )}/>
                         </div>
                    </div>
                ))}
                
                <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="font-semibold">Other Activities</h4>
                     <FormField control={form.control} name="TMTORACT" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{featureLabels.TMTORACT}</FormLabel>
                            <FormControl>
                               <Slider defaultValue={[0]} max={40} step={1} onValueChange={vals => field.onChange(vals[0])} />
                            </FormControl>
                            <FormDescription className="text-right">{field.value} hours/week</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Predict Risk'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
