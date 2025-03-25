import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';

const leaseSchema = z.object({
  tenant_id: z.string().min(1, 'Tenant is required'),
  property_id: z.string().min(1, 'Property is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  rent_amount: z.number().min(0, 'Rent amount must be positive'),
  deposit_amount: z.number().min(0, 'Deposit amount must be positive'),
  payment_due_date: z.number().min(1, 'Payment due date is required').max(31, 'Payment due date must be between 1 and 31'),
  status: z.enum(['draft', 'active', 'terminated', 'expired']),
});

type LeaseFormData = z.infer<typeof leaseSchema>;

interface LeaseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingLease?: any;
}

export default function LeaseForm({
  onSuccess,
  onCancel,
  editingLease,
}: LeaseFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: editingLease ? {
      tenant_id: editingLease.tenant_id,
      property_id: editingLease.property_id,
      start_date: editingLease.start_date,
      end_date: editingLease.end_date,
      rent_amount: editingLease.rent_amount,
      deposit_amount: editingLease.deposit_amount,
      payment_due_date: editingLease.payment_due_date,
      status: editingLease.status,
    } : {
      status: 'active',
      payment_due_date: 1, // Default to 1st of the month
    },
  });

  const onSubmit = async (data: LeaseFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (editingLease) {
        const { error } = await supabase
          .from('leases')
          .update({
            tenant_id: data.tenant_id,
            property_id: data.property_id,
            start_date: data.start_date,
            end_date: data.end_date,
            rent_amount: data.rent_amount,
            deposit_amount: data.deposit_amount,
            payment_due_date: data.payment_due_date,
            status: data.status,
          })
          .eq('id', editingLease.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('leases')
          .insert([
            {
              user_id: user.id,
              tenant_id: data.tenant_id,
              property_id: data.property_id,
              start_date: data.start_date,
              end_date: data.end_date,
              rent_amount: data.rent_amount,
              deposit_amount: data.deposit_amount,
              payment_due_date: data.payment_due_date,
              status: data.status,
            },
          ]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving lease:', error);
      setError(error instanceof Error ? error.message : 'Failed to save lease');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tenant
        </label>
        <select
          {...register('tenant_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.first_name} {tenant.last_name}
            </option>
          ))}
        </select>
        {errors.tenant_id && (
          <p className="mt-1 text-sm text-red-600">{errors.tenant_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Property
        </label>
        <select
          {...register('property_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
        {errors.property_id && (
          <p className="mt-1 text-sm text-red-600">{errors.property_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          {...register('start_date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.start_date && (
          <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          {...register('end_date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.end_date && (
          <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Monthly Rent Amount (€)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('rent_amount', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.rent_amount && (
          <p className="mt-1 text-sm text-red-600">{errors.rent_amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Security Deposit Amount (€)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('deposit_amount', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.deposit_amount && (
          <p className="mt-1 text-sm text-red-600">{errors.deposit_amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payment Due Date (Day of Month)
        </label>
        <input
          type="number"
          min="1"
          max="31"
          {...register('payment_due_date', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.payment_due_date && (
          <p className="mt-1 text-sm text-red-600">{errors.payment_due_date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="terminated">Terminated</option>
          <option value="expired">Expired</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting ? 'Saving...' : editingLease ? 'Update Lease' : 'Create Lease'}
        </button>
      </div>
    </form>
  );
}
