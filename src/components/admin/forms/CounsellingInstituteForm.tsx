"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { counsellingInstituteSchema, CounsellingInstituteFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CounsellingInstituteFormProps {
  initialData?: any;
  counsellings: any[];
  institutes: any[];
  onSubmit: (data: CounsellingInstituteFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CounsellingInstituteForm({ initialData, counsellings, institutes, onSubmit, isSubmitting }: CounsellingInstituteFormProps) {
  const form = useForm<CounsellingInstituteFormValues>({
    resolver: zodResolver(counsellingInstituteSchema),
    defaultValues: {
      counselling_id: initialData?.counselling_id?.id || initialData?.counselling_id || "",
      institute_id: initialData?.institute_id?.id || initialData?.institute_id || "",
    },
  });

  const handleFormSubmit = async (values: CounsellingInstituteFormValues) => {
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

        <FormField control={form.control} name="institute_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Institute *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select institute" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {institutes.map((inst) => <SelectItem key={inst.id} value={inst.id.toString()}>{inst.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Mapping" : "Map Institute"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
