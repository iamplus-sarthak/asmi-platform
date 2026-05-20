"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { instituteCourseSchema, InstituteCourseFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InstituteCourseFormProps {
  initialData?: any;
  institutes: any[];
  courses: any[];
  onSubmit: (data: InstituteCourseFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InstituteCourseForm({ initialData, institutes, courses, onSubmit, isSubmitting }: InstituteCourseFormProps) {
  const form = useForm<InstituteCourseFormValues>({
    resolver: zodResolver(instituteCourseSchema) as any,
    defaultValues: {
      institute_id: initialData?.institute_id?.id || initialData?.institute_id || "",
      course_id: initialData?.course_id?.id || initialData?.course_id || "",
      label: initialData?.label || "",
      total_seats: initialData?.total_seats || 0,
    },
  });

  const handleFormSubmit = async (values: InstituteCourseFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="label" render={({ field }) => (
            <FormItem><FormLabel>Display Label *</FormLabel><FormControl><Input placeholder="e.g. AIIMS Delhi - MBBS" {...field} /></FormControl><FormMessage /></FormItem>
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

        <FormField control={form.control} name="course_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Course *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {courses.map((course) => <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <FormField control={form.control} name="total_seats" render={({ field }) => (
            <FormItem><FormLabel>Total Seats *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Course" : "Add Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
