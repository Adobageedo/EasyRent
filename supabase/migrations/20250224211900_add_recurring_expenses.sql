-- Add recurring expense fields to expenses table
ALTER TABLE expenses 
ADD COLUMN is_recurring boolean DEFAULT false,
ADD COLUMN periodicity text CHECK (periodicity IN ('Monthly', 'Quarterly', 'Semi-Annual', 'Annual')),
ADD COLUMN end_date timestamp with time zone;
