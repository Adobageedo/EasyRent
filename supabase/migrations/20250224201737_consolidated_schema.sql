/*
  # Consolidated Schema for EasyRent Property Management

  This file combines all previous migrations into a single schema file.
  Last consolidated: 2025-02-24
*/

-- Create necessary extensions and types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE contract_status AS ENUM ('draft', 'pending_signature', 'active', 'terminated', 'expired');
CREATE TYPE inspection_type AS ENUM ('move_in', 'move_out');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE tax_category AS ENUM ('rent', 'maintenance', 'insurance', 'tax', 'utility', 'other');
CREATE TYPE lease_status AS ENUM ('draft', 'active', 'terminated', 'expired');

-- Create updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Create user profiles function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create base tables
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name text,
  avatar_url text,
  phone_number text,
  company_name text,
  role text DEFAULT 'user'::text NOT NULL,
  is_admin boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  address text NOT NULL,
  type text NOT NULL,
  rooms integer NOT NULL,
  bathrooms integer NOT NULL,
  area text NOT NULL,
  status text NOT NULL DEFAULT 'Available',
  rent_amount decimal(10,2) NOT NULL,
  images text[] DEFAULT ARRAY[]::text[],
  description text,
  amenities text[] DEFAULT ARRAY[]::text[],
  announcement text,
  user_id uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  user_id uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS leases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  property_id uuid REFERENCES properties(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  rent_amount decimal(10,2) NOT NULL CHECK (rent_amount >= 0),
  deposit_amount decimal(10,2) NOT NULL CHECK (deposit_amount >= 0),
  payment_due_date integer NOT NULL CHECK (payment_due_date >= 1 AND payment_due_date <= 31),
  status lease_status DEFAULT 'draft' NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  description text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  assigned_to text,
  estimated_cost decimal(10,2),
  actual_cost decimal(10,2),
  completion_date date,
  user_id uuid REFERENCES auth.users(id)
);

-- Contract Management Tables
CREATE TABLE contract_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES contract_templates(id),
  lease_id uuid REFERENCES leases(id) NOT NULL,
  content text NOT NULL,
  status contract_status DEFAULT 'draft' NOT NULL,
  tenant_signature jsonb,
  landlord_signature jsonb,
  signed_at timestamptz,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE inspections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  contract_id uuid REFERENCES contracts(id) NOT NULL,
  type inspection_type NOT NULL,
  date date NOT NULL,
  notes text,
  photos text[],
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Accounting Tables
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id),
  type transaction_type NOT NULL,
  category tax_category NOT NULL,
  amount decimal(10,2) NOT NULL,
  date date NOT NULL,
  description text,
  receipt_url text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE tax_declarations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  year integer NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  total_income decimal(10,2) NOT NULL,
  total_expenses decimal(10,2) NOT NULL,
  net_income decimal(10,2) NOT NULL,
  declaration_date date,
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_declarations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for properties
CREATE POLICY "Users can manage their own properties"
  ON properties FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for tenants
CREATE POLICY "Users can manage their own tenants"
  ON tenants FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for leases
CREATE POLICY "Users can manage their own leases"
  ON leases FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for maintenance requests
CREATE POLICY "Users can manage their own maintenance requests"
  ON maintenance_requests FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for contract templates
CREATE POLICY "Users can view their own contract templates"
  ON contract_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contract templates"
  ON contract_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contract templates"
  ON contract_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contract templates"
  ON contract_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for contracts
CREATE POLICY "Users can view their own contracts"
  ON contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contracts"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
  ON contracts FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for inspections
CREATE POLICY "Users can view their own inspections"
  ON inspections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inspections"
  ON inspections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inspections"
  ON inspections FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for tax declarations
CREATE POLICY "Users can view their own tax declarations"
  ON tax_declarations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tax declarations"
  ON tax_declarations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax declarations"
  ON tax_declarations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create storage policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images' AND auth.uid() = owner);

CREATE POLICY "Allow public to read property images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

-- Create triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER contract_templates_updated_at
  BEFORE UPDATE ON contract_templates
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER inspections_updated_at
  BEFORE UPDATE ON inspections
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER tax_declarations_updated_at
  BEFORE UPDATE ON tax_declarations
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER leases_updated_at
  BEFORE UPDATE ON leases
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add helpful comments
COMMENT ON TABLE leases IS 'Stores lease agreements between landlords and tenants for properties';
COMMENT ON COLUMN leases.payment_due_date IS 'Day of the month when rent payment is due (1-31)';
COMMENT ON COLUMN leases.rent_amount IS 'Monthly rent amount in EUR';
COMMENT ON COLUMN leases.deposit_amount IS 'Security deposit amount in EUR';
COMMENT ON COLUMN leases.status IS 'Current status of the lease (draft, active, terminated, expired)';
