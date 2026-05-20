"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { instituteTypeSchema, InstituteTypeFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InstituteTypeFormProps {
  initialData?: any;
  onSubmit: (data: InstituteTypeFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InstituteTypeForm({ initialData, onSubmit, isSubmitting }: InstituteTypeFormProps) {
  const form = useForm<InstituteTypeFormValues>({
    resolver: zodResolver(instituteTypeSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const handleFormSubmit = async (values: InstituteTypeFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Type Name *</FormLabel><FormControl><Input placeholder="e.g. AIIMS" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Short description" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Type" : "Create Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
