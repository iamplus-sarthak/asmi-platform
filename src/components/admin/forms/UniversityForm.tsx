"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { universitySchema, UniversityFormValues } from "@/lib/validations/admin";

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

interface UniversityFormProps {
  initialData?: any;
  states: any[];
  onSubmit: (data: UniversityFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function UniversityForm({
  initialData,
  states,
  onSubmit,
  isSubmitting,
}: UniversityFormProps) {
  const form = useForm<UniversityFormValues>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: initialData?.name || "",
      university_type: initialData?.university_type || "",
      state_id: initialData?.state_id?.id || initialData?.state_id || "",
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
              <FormLabel>University Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter university name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="university_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="central">Central</SelectItem>
                  <SelectItem value="deemed">Deemed</SelectItem>
                  <SelectItem value="state_govt">State Government</SelectItem>
                  <SelectItem value="state_private">State Private</SelectItem>
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
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update University" : "Create University"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
