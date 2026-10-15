import { z } from 'zod';

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(6, 'Please enter a valid phone number with dial code'),
  currentLocation: z
    .string()
    .trim()
    .min(2, 'Please specify your current city / country'),
  linkedinUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val),
      'Please enter a valid URL (e.g., https://linkedin.com/in/username)'
    ),
  portfolioUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val),
      'Please enter a valid URL (e.g., https://github.com/username)'
    ),
  experienceYears: z
    .string()
    .min(1, 'Please select your years of relevant experience'),
  earliestStartDate: z
    .string()
    .min(1, 'Please select your earliest start date'),
  expectedSalary: z
    .string()
    .trim()
    .optional(),
  coverLetter: z
    .string()
    .trim()
    .optional(),
  heardFrom: z
    .string()
    .optional(),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
