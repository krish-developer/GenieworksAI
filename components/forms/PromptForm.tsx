"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PromptValidation,
  amountOptions,
  resolutionOptions,
} from "@/lib/validations/prompt";

interface PromptFormProps {
  placeholder: string;
  from?: "Convo" | "Image" | "Video" | "Music" | "Code";
  onSubmit: (
    prompt: string,
    amount?: string,
    resolution?: string
  ) => Promise<void>;
}

const PromptForm = ({ placeholder, from, onSubmit }: PromptFormProps) => {
  const form = useForm<z.infer<typeof PromptValidation>>({
    resolver: zodResolver(PromptValidation),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "256x256",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (
    values: z.infer<typeof PromptValidation>
  ): Promise<void> => {
    await onSubmit(values.prompt, values.amount, values.resolution);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem
              className={cn(
                "col-span-12",
                from === "Image" ? "lg:col-span-6" : "lg:col-span-10"
              )}
            >
              <FormControl className="m-0 p-0">
                <Input
                  className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  disabled={isLoading}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {from === "Image" && (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="col-span-6 lg:col-span-2">
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {amountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}
        {from === "Image" && (
          <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
              <FormItem className="col-span-6 lg:col-span-2">
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resolutionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}
        <Button disabled={isLoading} className="col-span-12 lg:col-span-2">
          {isLoading && <Loader size={16} className="mr-2" />}
          {isLoading ? "Generating" : "Generate"}
        </Button>
      </form>
    </Form>
  );
};

export default PromptForm;
