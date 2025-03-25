import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';

// Validation schema
const tenantInviteSchema = z.object({
  propertyId: z.string().min(1, 'Please select a property'),
  leaseStartDate: z.string().min(1, 'Start date is required')
    .refine(date => {
      const startDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return startDate >= today;
    }, {
      message: 'Start date must be today or in the future'
    }),
  leaseEndDate: z.string().min(1, 'End date is required')
    .refine(date => {
      const endDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return endDate >= today;
    }, {
      message: 'End date must be today or in the future'
    }),
  deposit: z
    .number()
    .min(0, 'Deposit must be positive')
    .max(1000000, 'Deposit cannot exceed 1,000,000')
    .transform(val => Number(val.toFixed(2))), // Ensure 2 decimal places
  rentAmount: z
    .number()
    .min(0, 'Rent amount must be positive')
    .max(1000000, 'Rent amount cannot exceed 1,000,000')
    .transform(val => Number(val.toFixed(2))), // Ensure 2 decimal places
  firstName: z.string().min(2, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(2, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Must include country code')
}).refine((data) => {
  const startDate = new Date(data.leaseStartDate);
  const endDate = new Date(data.leaseEndDate);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['leaseEndDate']
}).refine((data) => {
  const startDate = new Date(data.leaseStartDate);
  const endDate = new Date(data.leaseEndDate);
  const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
    (endDate.getMonth() - startDate.getMonth());
  return diffMonths >= 1;
}, {
  message: 'Lease duration must be at least 1 month',
  path: ['leaseEndDate']
});

type TenantInviteFormData = z.infer<typeof tenantInviteSchema>;

interface Property {
  id: string;
  title: string;
  address: string;
  property_type: 'home' | 'apartment' | 'garage' | 'land' | 'other';
  rent_amount: number;
}

interface TenantInviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}


export default function TenantInviteForm({ onSuccess, onCancel }: TenantInviteFormProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TenantInviteFormData>({
    resolver: zodResolver(tenantInviteSchema),
  });

  // Fetch available properties on mount
  useEffect(() => {
    const fetchAvailableProperties = async () => {
      try {
        // First, get properties that have active leases
        const { data: activeLeases } = await supabase
          .from('leases')
          .select('property_id')
          .eq('status', 'active');  // Only filter out properties with active leases

        const leasedPropertyIds = activeLeases?.map(lease => lease.property_id) || [];

        // Then get available properties excluding those with active leases
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, address, property_type, rent_amount')
          .neq('property_type', 'land');  // Exclude land properties as they can't be rented

        if (error) throw error;

        // Filter out properties that have active leases
        const availableProperties = (data || []).filter(
          property => !leasedPropertyIds.includes(property.id)
        );

        setProperties(availableProperties);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchAvailableProperties();
  }, []);

  // Handle property selection to auto-fill rent amount
  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProperty = properties.find(p => p.id === event.target.value);
    if (selectedProperty) {
      setValue('rentAmount', selectedProperty.rent_amount);
    }
  };

  // Handle form submission
  const onSubmit = async (data: TenantInviteFormData) => {
    setLoading(true);
    setError(null);
    const inviteToken = crypto.randomUUID();
    try {
      // Create temp tenant record with invite token
      const { error: tempTenantError } = await supabase
        .from('temp_tenants')
        .insert({
          landlord_id: (await supabase.auth.getUser()).data.user?.id,
          property_id: data.propertyId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          lease_start_date: data.leaseStartDate,
          lease_end_date: data.leaseEndDate,
          deposit: data.deposit,
          rent_amount: data.rentAmount,
          status: 'pending',
          invite_token: inviteToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        });

      if (tempTenantError) throw tempTenantError;
      // Get selected property details
      const selectedProperty = properties.find(p => p.id === data.propertyId);
      if (!selectedProperty) {
        throw new Error('Selected property not found');
      }

      // Send invitation email
      const response = await fetch('https://easyrent.newsflix.fr/api/send_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          propertyAddress: `${selectedProperty.title} - ${selectedProperty.address}`,
          inviteLink: `${window.location.origin}/onboarding/${data.email}?token=${inviteToken}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      reset();
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700">
          Property
        </label>
        <select
          id="propertyId"
          {...register('propertyId')}
          onChange={handlePropertyChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.title} - {property.address} ({property.property_type}) - ${property.rent_amount.toFixed(2)}/month
            </option>
          ))}
        </select>
        {errors.propertyId && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="leaseStartDate" className="block text-sm font-medium text-gray-700">
            Lease Start Date
          </label>
          <input
            type="date"
            id="leaseStartDate"
            {...register('leaseStartDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.leaseStartDate && (
            <p className="mt-1 text-sm text-red-600">{errors.leaseStartDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="leaseEndDate" className="block text-sm font-medium text-gray-700">
            Lease End Date
          </label>
          <input
            type="date"
            id="leaseEndDate"
            {...register('leaseEndDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.leaseEndDate && (
            <p className="mt-1 text-sm text-red-600">{errors.leaseEndDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">
            Deposit Amount
          </label>
          <input
            type="number"
            id="deposit"
            {...register('deposit', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.deposit && (
            <p className="mt-1 text-sm text-red-600">{errors.deposit.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700">
            Monthly Rent
          </label>
          <input
            type="number"
            id="rentAmount"
            {...register('rentAmount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.rentAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.rentAmount.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number (with country code)
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          placeholder="+1234567890"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Sending Invite...' : 'Send Invite'}
        </button>
      </div>
    </form>
  );
}
