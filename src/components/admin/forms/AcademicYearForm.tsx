"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { academicYearSchema, AcademicYearFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AcademicYearFormProps {
  initialData?: any;
  onSubmit: (data: AcademicYearFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function AcademicYearForm({ initialData, onSubmit, isSubmitting }: AcademicYearFormProps) {
  const form = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      year: initialData?.year || "",
    },
  });

  const handleFormSubmit = async (values: AcademicYearFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="year" render={({ field }) => (
            <FormItem><FormLabel>Academic Year *</FormLabel><FormControl><Input placeholder="e.g. 2024-25" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Academic Year" : "Add Academic Year"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
