import { z } from "zod";

export const PromptValidation = z.object({
  prompt: z.string().min(3, {
    message: "Prompt is required!!!",
  }),
  amount: z.optional(z.string().min(1)),
  resolution: z.optional(z.string().min(1)),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 Photo",
  },
  {
    value: "2",
    label: "2 Photos",
  },
  {
    value: "3",
    label: "3 Photos",
  },
  {
    value: "4",
    label: "4 Photos",
  },
  {
    value: "5",
    label: "5 Photos",
  },
];

export const resolutionOptions = ["256x256", "512x512", "1024x1024"];
