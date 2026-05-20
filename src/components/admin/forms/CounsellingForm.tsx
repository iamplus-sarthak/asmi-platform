"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { counsellingSchema, CounsellingFormValues } from "@/lib/validations/admin";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CounsellingFormProps {
  initialData?: any;
  states: any[];
  exams: any[];
  onSubmit: (data: CounsellingFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CounsellingForm({
  initialData,
  states,
  exams,
  onSubmit,
  isSubmitting,
}: CounsellingFormProps) {
  const form = useForm<CounsellingFormValues>({
    resolver: zodResolver(counsellingSchema),
    defaultValues: {
      name: initialData?.name || "",
      counselling_type: initialData?.counselling_type || "",
      state_id: initialData?.state_id?.id || initialData?.state_id || "",
      exam_id: initialData?.exam_id?.id || initialData?.exam_id || "",
      website_url: initialData?.website_url || "",
      registration_url: initialData?.registration_url || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Counselling Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MCC Counselling" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="counselling_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Counselling Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="government_and_management">Government & Management</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exam_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id.toString()}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString() || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registration_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Counselling" : "Create Counselling"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
