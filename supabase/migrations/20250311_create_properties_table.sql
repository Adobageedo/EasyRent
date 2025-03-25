-- Create enum types for property-specific fields
CREATE TYPE property_type AS ENUM ('home', 'apartment', 'garage', 'land', 'other');
CREATE TYPE heating_type AS ENUM ('central', 'electric', 'gas', 'oil', 'wood', 'heat_pump', 'solar', 'none');
CREATE TYPE property_condition AS ENUM ('new', 'excellent', 'good', 'fair', 'needs_renovation', 'under_construction');
CREATE TYPE energy_class AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');
CREATE TYPE co2_emission_class AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');
CREATE TYPE garage_type AS ENUM ('enclosed_box', 'outdoor_parking', 'underground');
CREATE TYPE secure_access_type AS ENUM ('badge', 'key', 'keypad', 'remote', 'none');
CREATE TYPE soil_type AS ENUM ('clay', 'loam', 'sand', 'silt', 'rock', 'mixed');
CREATE TYPE land_use_zone AS ENUM ('residential', 'commercial', 'industrial', 'agricultural', 'mixed');
CREATE TYPE property_category AS ENUM ('commercial', 'industrial', 'agricultural', 'institutional', 'mixed_use', 'special_purpose');
CREATE TYPE occupancy_status AS ENUM ('vacant', 'occupied', 'partially_occupied');

-- Create the properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Common fields for all property types
    type property_type NOT NULL,
    title VARCHAR(100) NOT NULL CHECK (char_length(title) >= 5),
    address JSONB NOT NULL,
    total_area NUMERIC NOT NULL CHECK (total_area > 0 AND total_area <= 100000),
    rent_amount NUMERIC NOT NULL CHECK (rent_amount > 0 AND rent_amount <= 1000000),
    description TEXT NOT NULL CHECK (char_length(description) >= 20 AND char_length(description) <= 2000),
    photos TEXT[] NOT NULL CHECK (array_length(photos, 1) >= 1 AND array_length(photos, 1) <= 10),

    -- Home and Apartment specific fields
    rooms INTEGER CHECK (CASE WHEN type IN ('home', 'apartment') THEN rooms > 0 ELSE rooms IS NULL END),
    bedrooms INTEGER CHECK (CASE WHEN type IN ('home', 'apartment') THEN bedrooms > 0 ELSE bedrooms IS NULL END),
    bathrooms INTEGER CHECK (CASE WHEN type IN ('home', 'apartment') THEN bathrooms > 0 ELSE bathrooms IS NULL END),
    heating_type heating_type,
    property_condition property_condition,
    energy_class energy_class,
    co2_emission_class co2_emission_class,
    air_conditioning BOOLEAN,

    -- Home specific fields
    garden BOOLEAN,
    garden_area NUMERIC CHECK (CASE WHEN garden = true THEN garden_area > 0 ELSE garden_area IS NULL END),
    garage BOOLEAN,
    garage_capacity INTEGER CHECK (CASE WHEN garage = true THEN garage_capacity > 0 ELSE garage_capacity IS NULL END),
    swimming_pool BOOLEAN,
    terrace BOOLEAN,
    balcony BOOLEAN,
    basement BOOLEAN,

    -- Apartment specific fields
    floor_number INTEGER CHECK (CASE WHEN type = 'apartment' THEN floor_number >= 0 ELSE floor_number IS NULL END),
    wheelchair_access BOOLEAN,
    elevator BOOLEAN,
    storage BOOLEAN,
    balcony_size NUMERIC CHECK (CASE WHEN balcony = true THEN balcony_size > 0 ELSE balcony_size IS NULL END),
    terrace_size NUMERIC CHECK (CASE WHEN terrace = true THEN terrace_size > 0 ELSE terrace_size IS NULL END),
    garage_size NUMERIC CHECK (CASE WHEN garage = true THEN garage_size > 0 ELSE garage_size IS NULL END),

    -- Garage specific fields
    garage_type garage_type CHECK (CASE WHEN type = 'garage' THEN garage_type IS NOT NULL ELSE garage_type IS NULL END),
    secure_access_type secure_access_type CHECK (CASE WHEN type = 'garage' THEN secure_access_type IS NOT NULL ELSE secure_access_type IS NULL END),
    parking_spots INTEGER CHECK (CASE WHEN type = 'garage' THEN parking_spots > 0 ELSE parking_spots IS NULL END),
    height NUMERIC CHECK (CASE WHEN type = 'garage' THEN height > 0 ELSE height IS NULL END),
    interior_lighting BOOLEAN,
    electrical_outlet BOOLEAN,
    water_supply BOOLEAN,
    security_camera BOOLEAN,
    automatic_door BOOLEAN,

    -- Land specific fields
    buildable BOOLEAN,
    max_building_coverage NUMERIC CHECK (CASE WHEN buildable = true THEN max_building_coverage BETWEEN 0 AND 100 ELSE max_building_coverage IS NULL END),
    serviced BOOLEAN,
    soil_type soil_type CHECK (CASE WHEN type = 'land' THEN soil_type IS NOT NULL ELSE soil_type IS NULL END),
    land_use_zone land_use_zone CHECK (CASE WHEN type = 'land' THEN land_use_zone IS NOT NULL ELSE land_use_zone IS NULL END),
    water_service BOOLEAN,
    electricity_service BOOLEAN,
    gas_service BOOLEAN,
    sewer_service BOOLEAN,
    internet_service BOOLEAN,

    -- Other property specific fields
    type_description VARCHAR(50) CHECK (CASE WHEN type = 'other' THEN char_length(type_description) BETWEEN 5 AND 50 ELSE type_description IS NULL END),
    property_details TEXT CHECK (CASE WHEN type = 'other' THEN char_length(property_details) BETWEEN 20 AND 1000 ELSE property_details IS NULL END),
    property_category property_category CHECK (CASE WHEN type = 'other' THEN property_category IS NOT NULL ELSE property_category IS NULL END),
    occupancy_status occupancy_status CHECK (CASE WHEN type = 'other' THEN occupancy_status IS NOT NULL ELSE occupancy_status IS NULL END),
    parking BOOLEAN,
    loading_dock BOOLEAN,
    security_system BOOLEAN,
    fire_safety BOOLEAN
);

-- Create an index on user_id for faster lookups
CREATE INDEX properties_user_id_idx ON properties(user_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
