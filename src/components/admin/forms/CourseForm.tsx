"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { courseMasterSchema, CourseMasterFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseFormProps {
  initialData?: any;
  onSubmit: (data: CourseMasterFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CourseForm({ initialData, onSubmit, isSubmitting }: CourseFormProps) {
  const form = useForm<CourseMasterFormValues>({
    resolver: zodResolver(courseMasterSchema),
    defaultValues: {
      name: initialData?.name || "",
      course_type: initialData?.course_type || undefined,
      degree_type: initialData?.degree_type || undefined,
      duration: initialData?.duration || "",
    },
  });

  const handleFormSubmit = async (values: CourseMasterFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Course Name *</FormLabel><FormControl><Input placeholder="e.g. MBBS" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="course_type" render={({ field }) => (
                <FormItem>
                    <FormLabel>Course Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="clinical">Clinical</SelectItem>
                            <SelectItem value="para_clinical">Para-Clinical</SelectItem>
                            <SelectItem value="non_clinical">Non-Clinical</SelectItem>
                            <SelectItem value="pre_clinical">Pre-Clinical</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>

            <FormField control={form.control} name="degree_type" render={({ field }) => (
                <FormItem>
                    <FormLabel>Degree Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="dental">Dental</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="bsc">BSc</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="duration" render={({ field }) => (
            <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 5.5 Years" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Master Course" : "Add Master Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
