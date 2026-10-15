import { z } from 'zod';

export const pressReleaseFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid work email address'),
  phone: z
    .string()
    .trim()
    .min(5, 'Please enter a valid phone number'),
  company: z
    .string()
    .trim()
    .min(2, 'Please enter your organization or company name'),
  websiteUrl: z
    .string()
    .trim()
    .min(3, 'Please enter your product or company website')
    .refine(
      (val) =>
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val),
      'Please enter a valid website URL (e.g., https://example.com)'
    ),
  title: z
    .string()
    .trim()
    .min(10, 'Headline must be at least 10 characters')
    .max(120, 'Headline cannot exceed 120 characters'),
  category: z
    .string()
    .trim()
    .min(1, 'Please select a healthcare category'),
  releaseDateType: z
    .enum(['immediate', 'scheduled'])
    .default('immediate'),
  scheduledDate: z
    .string()
    .optional()
    .default(''),
  summary: z
    .string()
    .trim()
    .min(30, 'Executive summary must be at least 30 characters')
    .max(350, 'Executive summary cannot exceed 350 characters'),
  content: z
    .string()
    .trim()
    .min(100, 'Content must be at least 100 characters')
    .max(5000, 'Content cannot exceed 5,000 characters'),
  baseTierId: z
    .string()
    .default('free-standard'),
  selectedToolkitIds: z
    .array(z.string())
    .default([]),
});

export type PressReleaseFormData = z.infer<typeof pressReleaseFormSchema>;
