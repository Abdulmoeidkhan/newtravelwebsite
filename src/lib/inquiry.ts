import { z } from 'zod';
import { serviceOptions } from '../data/site';
import type { InquiryFormData } from '../types';
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(100, 'Keep your name under 100 characters.'),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().regex(/^\+?[\d\s().-]+$/, 'Enter a valid phone number.').refine(value => { const count = value.replace(/\D/g, '').length; return count >= 7 && count <= 15; }, 'Use a phone number with 7–15 digits.'),
  service: z.enum(serviceOptions),
  message: z.string().trim().min(10, 'Tell us a little about your journey (at least 10 characters).').max(3000, 'Please keep your message under 3,000 characters.'),
});
export const formatInquiry = (data: InquiryFormData) => `Assalamu Alaikum! I would like to request a quote.\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${data.service}\n\n${data.message}`;
