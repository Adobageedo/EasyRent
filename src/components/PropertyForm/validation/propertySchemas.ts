import { z } from 'zod';

export const heatingTypes = [
  'gas',
  'electric',
  'wood',
  'heat_pump',
  'collective',
] as const;

export const propertyConditions = [
  'new',
  'good_condition',
  'needs_renovation',
] as const;

export const energyClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export const garageTypes = [
  'enclosed_box',
  'outdoor_parking',
  'underground_parking',
] as const;

export const soilTypes = [
  'clay',
  'sandy',
  'rocky',
  'other',
] as const;

export const homeSchema = z.object({
  num_rooms: z.number().positive('Number of rooms must be positive'),
  num_bedrooms: z.number().positive('Number of bedrooms must be positive'),
  num_bathrooms: z.number().positive('Number of bathrooms must be positive'),
  has_garden: z.boolean().default(false),
  garden_area: z.number().optional(),
  has_garage: z.boolean().default(false),
  garage_capacity: z.number().optional(),
  garage_size: z.number().optional(),
  heating_type: z.enum(heatingTypes),
  property_condition: z.enum(propertyConditions),
  energy_class: z.enum(energyClasses),
  co2_emission_class: z.enum(energyClasses),
  has_swimming_pool: z.boolean().default(false),
  has_terrace: z.boolean().default(false),
  has_balcony: z.boolean().default(false),
  has_basement: z.boolean().default(false),
  has_air_conditioning: z.boolean().default(false),
});

export const apartmentSchema = z.object({
  num_rooms: z.number().positive('Number of rooms must be positive'),
  num_bedrooms: z.number().positive('Number of bedrooms must be positive'),
  num_bathrooms: z.number().positive('Number of bathrooms must be positive'),
  floor_number: z.number().min(0, 'Floor number must be 0 or greater'),
  wheelchair_accessible: z.boolean().default(false),
  has_elevator: z.boolean().default(false),
  has_storage_room: z.boolean().default(false),
  has_balcony: z.boolean().default(false),
  balcony_size: z.number().optional(),
  has_terrace: z.boolean().default(false),
  terrace_size: z.number().optional(),
  has_garage: z.boolean().default(false),
  garage_size: z.number().optional(),
  heating_type: z.enum(heatingTypes),
  property_condition: z.enum(propertyConditions),
  energy_class: z.enum(energyClasses),
  co2_emission_class: z.enum(energyClasses),
  has_air_conditioning: z.boolean().default(false),
});

export const garageSchema = z.object({
  garage_type: z.enum(garageTypes),
  secure_access: z.string(),
  parking_spots: z.number().positive('Number of parking spots must be positive'),
  height: z.number().positive('Height must be positive'),
  has_interior_lighting: z.boolean().default(false),
  has_electrical_outlet: z.boolean().default(false),
  has_water_supply: z.boolean().default(false),
  has_security_camera: z.boolean().default(false),
  has_automatic_door: z.boolean().default(false),
});

export const landSchema = z.object({
  is_buildable: z.boolean().default(false),
  is_serviced: z.boolean().default(false),
  soil_type: z.enum(soilTypes),
  is_fenced: z.boolean().default(false),
  has_vehicle_access: z.boolean().default(false),
  available_services: z.array(z.string()).optional(),
});

export const otherSchema = z.object({
  other_type_description: z.string().min(5).max(50),
  specific_description: z.string().min(20).max(1000),
  property_condition: z.enum(propertyConditions),
});
