"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { examCourseSchema, ExamCourseFormValues } from "@/lib/validations/admin";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamCourseFormProps {
  initialData?: any;
  exams: any[];
  courses: any[];
  onSubmit: (data: ExamCourseFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ExamCourseForm({ initialData, exams, courses, onSubmit, isSubmitting }: ExamCourseFormProps) {
  const form = useForm<ExamCourseFormValues>({
    resolver: zodResolver(examCourseSchema),
    defaultValues: {
      exam_id: initialData?.exam_id?.id || initialData?.exam_id || "",
      course_id: initialData?.course_id?.id || initialData?.course_id || "",
    },
  });

  const handleFormSubmit = async (values: ExamCourseFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="exam_id" render={({ field }) => (
            <FormItem>
                <FormLabel>Exam *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {exams.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
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
                        {courses.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Mapping" : "Map Course to Exam"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
