-- Create tenants table
CREATE TABLE tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants
CREATE POLICY "Users can view their own tenants"
    ON tenants FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create tenants"
    ON tenants FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tenants"
    ON tenants FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own tenants"
    ON tenants FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create trigger for tenant updates
CREATE TRIGGER handle_tenant_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Create leases table
CREATE TABLE leases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    payment_due_date INTEGER NOT NULL CHECK (payment_due_date BETWEEN 1 AND 31),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for leases
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- Create policies for leases
CREATE POLICY "Users can view their own leases"
    ON leases FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR tenant_id = auth.uid());

CREATE POLICY "Users can create leases for their properties"
    ON leases FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own leases"
    ON leases FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own leases"
    ON leases FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create trigger for lease updates
CREATE TRIGGER handle_lease_updated_at
    BEFORE UPDATE ON leases
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Create temp_tenants table
CREATE TABLE temp_tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    invite_token VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_documents table
CREATE TABLE tenant_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    temp_tenant_id UUID REFERENCES temp_tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (tenant_id IS NOT NULL AND temp_tenant_id IS NULL) OR
        (tenant_id IS NULL AND temp_tenant_id IS NOT NULL)
    )
);

-- Create tenant_guarantors table
CREATE TABLE tenant_guarantors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    temp_tenant_id UUID REFERENCES temp_tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (tenant_id IS NOT NULL AND temp_tenant_id IS NULL) OR
        (tenant_id IS NULL AND temp_tenant_id IS NOT NULL)
    )
);

-- Create tenant_profiles table (for additional tenant information)
CREATE TABLE tenant_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    occupation VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE temp_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_guarantors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;

-- Landlord policies for temp_tenants
CREATE POLICY "Landlords can view their own temp tenants"
    ON temp_tenants FOR SELECT
    TO authenticated
    USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can create temp tenants"
    ON temp_tenants FOR INSERT
    TO authenticated
    WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update their own temp tenants"
    ON temp_tenants FOR UPDATE
    TO authenticated
    USING (landlord_id = auth.uid());

-- Anonymous policy for invite verification
CREATE POLICY "Anyone can verify their invite"
    ON temp_tenants FOR SELECT
    TO anon
    USING (
        status = 'pending' AND
        expires_at > NOW()
    );

-- Document policies
CREATE POLICY "Users can view their own documents"
    ON tenant_documents FOR SELECT
    TO authenticated
    USING (
        tenant_id = auth.uid() OR
        temp_tenant_id IN (
            SELECT id FROM temp_tenants WHERE landlord_id = auth.uid()
        )
    );

CREATE POLICY "Users can upload their own documents"
    ON tenant_documents FOR INSERT
    TO authenticated
    WITH CHECK (
        tenant_id = auth.uid() OR
        temp_tenant_id IN (
            SELECT id FROM temp_tenants WHERE landlord_id = auth.uid()
        )
    );

-- Guarantor policies
CREATE POLICY "Users can view their own guarantors"
    ON tenant_guarantors FOR SELECT
    TO authenticated
    USING (
        tenant_id = auth.uid() OR
        temp_tenant_id IN (
            SELECT id FROM temp_tenants WHERE landlord_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own guarantors"
    ON tenant_guarantors FOR ALL
    TO authenticated
    USING (
        tenant_id = auth.uid() OR
        temp_tenant_id IN (
            SELECT id FROM temp_tenants WHERE landlord_id = auth.uid()
        )
    );

-- Profile policies
CREATE POLICY "Users can view their own profiles"
    ON tenant_profiles FOR SELECT
    TO authenticated
    USING (tenant_id = auth.uid());

CREATE POLICY "Users can manage their own profiles"
    ON tenant_profiles FOR ALL
    TO authenticated
    USING (tenant_id = auth.uid());

-- Create function to handle tenant invite expiration
CREATE OR REPLACE FUNCTION handle_tenant_invite_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- If the invite has expired, update the property status back to 'vacant'
    IF NEW.expires_at < NOW() AND OLD.expires_at >= NOW() THEN
        UPDATE properties
        SET status = 'vacant'
        WHERE id = NEW.property_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tenant invite expiration
CREATE TRIGGER tenant_invite_expiration
    AFTER UPDATE ON temp_tenants
    FOR EACH ROW
    EXECUTE FUNCTION handle_tenant_invite_expiration();
