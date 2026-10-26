import { z } from "zod";

export const budgetOptions = [
  { value: "$1k – $5k", label: "$1k – $5k" },
  { value: "$5k – $10k", label: "$5k – $10k" },
  { value: "$10k – $25k", label: "$10k – $25k" },
  { value: "$25k+", label: "$25k+" },
  { value: "Full-time role", label: "Full-time role" },
] as const;

export const projectTypeOptions = [
  "React Native / Mobile App",
  "React.js Web Application",
  "Full-Stack Application",
  "API Integration",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name (at least 2 characters)."),
  email: z.string().trim().email("Enter a valid email address."),
  budget: z
    .string()
    .trim()
    .min(1, "Select your estimated budget.")
    .refine(
      (value) => budgetOptions.some((option) => option.value === value),
      "Select a budget from the available options.",
    ),
  projectType: z
    .string()
    .trim()
    .min(1, "Select a project type.")
    .refine(
      (value) => projectTypeOptions.some((option) => option === value),
      "Select a project type from the available options.",
    ),
  details: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters about your project."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
