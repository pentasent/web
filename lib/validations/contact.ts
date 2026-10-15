import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Please enter a valid work email address'),
  inquiryType: z.string().trim().min(1, 'Please select an inquiry type'),
  company: z.string().trim().min(1, 'Please enter your company or organization name'),
  employees: z.string().trim().min(1, 'Please select company size'),
  headquarters: z.string().trim().min(1, 'Please select your country'),
  phone: z.string().trim().min(5, 'Please enter a valid phone number'),
  message: z.string().trim().min(10, 'Please enter a message (at least 10 characters)'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
