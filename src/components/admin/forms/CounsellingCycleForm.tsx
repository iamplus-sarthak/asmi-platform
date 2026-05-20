"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { counsellingCycleSchema, CounsellingCycleFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CounsellingCycleFormProps {
  initialData?: any;
  counsellings: any[];
  academicYears: any[];
  onSubmit: (data: CounsellingCycleFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CounsellingCycleForm({ initialData, counsellings, academicYears, onSubmit, isSubmitting }: CounsellingCycleFormProps) {
  const form = useForm<CounsellingCycleFormValues>({
    resolver: zodResolver(counsellingCycleSchema),
    defaultValues: {
      counselling_id: initialData?.counselling_id?.id || initialData?.counselling_id || "",
      academic_year_id: initialData?.academic_year_id?.id || initialData?.academic_year_id || "",
      total_rounds: initialData?.total_rounds || 1,
    },
  });

  const handleFormSubmit = async (values: CounsellingCycleFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="counselling_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Counselling *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select counselling" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {counsellings.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <FormField control={form.control} name="academic_year_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Academic Year *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select academic year" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {academicYears.map((ay) => <SelectItem key={ay.id} value={ay.id.toString()}>{ay.year}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <FormField control={form.control} name="total_rounds" render={({ field }) => (
            <FormItem><FormLabel>Total Rounds *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Cycle" : "Add Cycle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
