export type InspectionType = 'move_in' | 'move_out' | 'routine';
export type ConditionRating = 'good' | 'fair' | 'poor';
export type CleanlinessRating = 'clean' | 'needs_cleaning' | 'damaged';

export interface InspectionSection {
  id: string;
  name: string;
  items: InspectionItem[];
}

export interface InspectionItem {
  id: string;
  name: string;
  condition?: ConditionRating;
  cleanliness?: CleanlinessRating;
  comments?: string;
  images?: InspectionImage[];
}

export interface InspectionImage {
  id: string;
  url: string;
  caption?: string;
  created_at: string;
}

export interface InspectionTemplate {
  id: string;
  user_id: string;
  name: string;
  type: InspectionType;
  sections: InspectionSection[];
  created_at: string;
  updated_at: string;
}

export interface InspectionSignature {
  id: string;
  inspection_id: string;
  user_id: string;
  role: 'landlord' | 'tenant';
  signature_data: string;
  ip_address?: string;
  user_agent?: string;
  signed_at: string;
}

export interface Property {
  id: string;
  address: string;
  unit_number?: string;
}

export interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Inspection {
  id: string;
  property_id: string;
  template_id?: string;
  type: InspectionType;
  status: 'draft' | 'pending_signatures' | 'completed';
  findings: InspectionSection[];
  landlord_signature?: InspectionSignature;
  tenant_signature?: InspectionSignature;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  created_by: string;
  tenant_id?: string;
  // Joined data
  properties?: Property;
  tenants?: Tenant;
}

// Default templates for each inspection type
export const DEFAULT_TEMPLATES: Record<InspectionType, InspectionSection[]> = {
  move_in: [
    {
      id: 'living-room',
      name: 'Living Room',
      items: [
        { id: 'walls', name: 'Walls' },
        { id: 'ceiling', name: 'Ceiling' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'windows', name: 'Windows' },
        { id: 'lighting', name: 'Lighting Fixtures' },
        { id: 'electrical', name: 'Electrical Outlets' },
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      items: [
        { id: 'countertops', name: 'Countertops' },
        { id: 'cabinets', name: 'Cabinets' },
        { id: 'sink', name: 'Sink and Faucet' },
        { id: 'appliances', name: 'Appliances' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'lighting', name: 'Lighting Fixtures' },
      ],
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      items: [
        { id: 'toilet', name: 'Toilet' },
        { id: 'sink', name: 'Sink and Vanity' },
        { id: 'shower', name: 'Shower/Bathtub' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'ventilation', name: 'Ventilation' },
      ],
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      items: [
        { id: 'walls', name: 'Walls' },
        { id: 'ceiling', name: 'Ceiling' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'windows', name: 'Windows' },
        { id: 'closet', name: 'Closet' },
        { id: 'lighting', name: 'Lighting Fixtures' },
      ],
    },
    {
      id: 'exterior',
      name: 'Exterior',
      items: [
        { id: 'siding', name: 'Siding/Paint' },
        { id: 'roof', name: 'Roof' },
        { id: 'landscaping', name: 'Landscaping' },
        { id: 'driveway', name: 'Driveway/Parking' },
        { id: 'mailbox', name: 'Mailbox' },
      ],
    },
  ],
  move_out: [
    // Same sections as move_in template
    {
      id: 'living-room',
      name: 'Living Room',
      items: [
        { id: 'walls', name: 'Walls' },
        { id: 'ceiling', name: 'Ceiling' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'windows', name: 'Windows' },
        { id: 'lighting', name: 'Lighting Fixtures' },
        { id: 'electrical', name: 'Electrical Outlets' },
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      items: [
        { id: 'countertops', name: 'Countertops' },
        { id: 'cabinets', name: 'Cabinets' },
        { id: 'sink', name: 'Sink and Faucet' },
        { id: 'appliances', name: 'Appliances' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'lighting', name: 'Lighting Fixtures' },
      ],
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      items: [
        { id: 'toilet', name: 'Toilet' },
        { id: 'sink', name: 'Sink and Vanity' },
        { id: 'shower', name: 'Shower/Bathtub' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'ventilation', name: 'Ventilation' },
      ],
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      items: [
        { id: 'walls', name: 'Walls' },
        { id: 'ceiling', name: 'Ceiling' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'windows', name: 'Windows' },
        { id: 'closet', name: 'Closet' },
        { id: 'lighting', name: 'Lighting Fixtures' },
      ],
    },
    {
      id: 'exterior',
      name: 'Exterior',
      items: [
        { id: 'siding', name: 'Siding/Paint' },
        { id: 'roof', name: 'Roof' },
        { id: 'landscaping', name: 'Landscaping' },
        { id: 'driveway', name: 'Driveway/Parking' },
        { id: 'mailbox', name: 'Mailbox' },
      ],
    },
  ],
  routine: [
    // Simplified version of move_in template
    {
      id: 'general',
      name: 'General Condition',
      items: [
        { id: 'walls', name: 'Walls and Ceilings' },
        { id: 'flooring', name: 'Flooring' },
        { id: 'windows', name: 'Windows and Doors' },
        { id: 'plumbing', name: 'Plumbing Fixtures' },
        { id: 'electrical', name: 'Electrical Systems' },
        { id: 'hvac', name: 'HVAC System' },
      ],
    },
    {
      id: 'safety',
      name: 'Safety Items',
      items: [
        { id: 'smoke-detectors', name: 'Smoke Detectors' },
        { id: 'co-detectors', name: 'Carbon Monoxide Detectors' },
        { id: 'fire-extinguishers', name: 'Fire Extinguishers' },
        { id: 'locks', name: 'Door Locks and Security' },
      ],
    },
    {
      id: 'maintenance',
      name: 'Maintenance Items',
      items: [
        { id: 'appliances', name: 'Appliances' },
        { id: 'pest-control', name: 'Pest Control' },
        { id: 'ventilation', name: 'Ventilation and Mold' },
        { id: 'landscaping', name: 'Landscaping and Exterior' },
      ],
    },
  ],
};
