"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { examSchema, ExamFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ExamFormProps {
  initialData?: any;
  onSubmit: (data: ExamFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ExamForm({ initialData, onSubmit, isSubmitting }: ExamFormProps) {
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: initialData?.name || "",
      short_name: initialData?.short_name || "",
      description: initialData?.description || "",
    },
  });

  const handleFormSubmit = async (values: ExamFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Exam Name *</FormLabel><FormControl><Input placeholder="e.g. National Eligibility cum Entrance Test" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="short_name" render={({ field }) => (
            <FormItem><FormLabel>Short Name *</FormLabel><FormControl><Input placeholder="e.g. NEET UG" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Details about this exam" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Exam" : "Add Exam"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
