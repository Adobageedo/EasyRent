import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  occupation: z.string().min(1, 'Occupation is required').max(100, 'Occupation must be less than 100 characters'),
  emergency_contact: z.object({
    name: z.string().min(1, 'Emergency contact name is required').max(100, 'Name must be less than 100 characters'),
    phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Must include country code'),
    email: z.string().email('Invalid email format'),
  }),
});

// Financial Information Schema
export const financialInfoSchema = z.object({
  income_proof: z.array(z.string().url('Invalid file URL')).min(1, 'At least one income proof document is required'),
});

// Document Schema
export const documentSchema = z.object({
  id_document: z.array(z.string().url('Invalid file URL')).min(1, 'ID document is required'),
  proof_of_income: z.array(z.string().url('Invalid file URL')).optional(),
  proof_of_residence: z.array(z.string().url('Invalid file URL')).optional(),
});

// Guarantor Schema (Optional)
export const guarantorSchema = z.object({
  name: z.string().min(1, 'Guarantor name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Must include country code'),
  occupation: z.string().min(1, 'Occupation is required').max(100, 'Occupation must be less than 100 characters'),
  documents: z.object({
    proof_of_income: z.array(z.string().url('Invalid file URL')).min(1, 'Income proof is required'),
    proof_of_residence: z.array(z.string().url('Invalid file URL')).min(1, 'Proof of residence is required'),
  }),
}).optional();

// Complete Tenant Onboarding Schema
export const tenantOnboardingSchema = z.object({
  personal_info: personalInfoSchema,
  financial_info: financialInfoSchema,
  documents: documentSchema,
  guarantor: guarantorSchema,
});
