-- Drop existing properties table
DROP TABLE IF EXISTS properties CASCADE;

-- Create property-related enums
CREATE TYPE property_type AS ENUM ('home', 'apartment', 'garage', 'land', 'other');
CREATE TYPE heating_type AS ENUM ('gas', 'electric', 'wood', 'heat_pump', 'collective');
CREATE TYPE property_condition AS ENUM ('new', 'good_condition', 'needs_renovation');
CREATE TYPE energy_class AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');
CREATE TYPE garage_type AS ENUM ('enclosed_box', 'outdoor_parking', 'underground_parking');
CREATE TYPE soil_type AS ENUM ('clay', 'sandy', 'rocky', 'other');

-- Create updated properties table
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- General Fields
  property_type property_type NOT NULL,
  title VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  total_area DECIMAL(10,2) NOT NULL,
  photos TEXT[] NOT NULL,
  rent_amount DECIMAL(10,2),
  description TEXT,
  
  -- Home & Apartment Common Fields
  num_rooms INTEGER,
  num_bedrooms INTEGER,
  num_bathrooms INTEGER,
  heating_type heating_type,
  property_condition property_condition,
  energy_class energy_class,
  co2_emission_class energy_class,
  has_garage BOOLEAN,
  garage_capacity INTEGER,
  garage_size DECIMAL(10,2),
  
  -- Home Specific Fields
  has_garden BOOLEAN,
  garden_area DECIMAL(10,2),
  has_swimming_pool BOOLEAN,
  has_terrace BOOLEAN,
  has_balcony BOOLEAN,
  has_basement BOOLEAN,
  has_air_conditioning BOOLEAN,
  
  -- Apartment Specific Fields
  floor_number INTEGER,
  is_ground_floor BOOLEAN,
  wheelchair_accessible BOOLEAN,
  has_elevator BOOLEAN,
  balcony_size DECIMAL(10,2),
  has_storage_room BOOLEAN,
  has_intercom BOOLEAN,
  has_concierge BOOLEAN,
  has_private_parking BOOLEAN,
  
  -- Garage Specific Fields
  garage_type garage_type,
  secure_access TEXT,
  has_interior_lighting BOOLEAN,
  has_electrical_outlet BOOLEAN,
  
  -- Land Specific Fields
  is_buildable BOOLEAN,
  is_serviced BOOLEAN,
  available_services TEXT[],
  soil_type soil_type,
  is_fenced BOOLEAN,
  has_vehicle_access BOOLEAN,
  
  -- Other Type Fields
  other_type_description VARCHAR(50),
  specific_description TEXT,

  -- Constraints
  CONSTRAINT photos_length CHECK (array_length(photos, 1) BETWEEN 1 AND 10),
  CONSTRAINT valid_services CHECK (available_services IS NULL OR array_length(available_services, 1) <= 4)
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties
CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
