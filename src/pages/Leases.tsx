import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LeaseForm from '../components/LeaseForm';
import Modal from '../components/Modal';

export default function Leases() {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<any>(null);

  useEffect(() => {
    fetchLeases();
  }, []);

  async function fetchLeases() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          tenants (id, first_name, last_name),
          properties (id, name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeases(data || []);
    } catch (error) {
      console.error('Error fetching leases:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch leases');
    } finally {
      setLoading(false);
    }
  }

  const handleEditLease = (lease: any) => {
    setEditingLease(lease);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingLease(null);
    fetchLeases();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingLease(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leases</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add New Lease
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {leases.map((lease) => (
            <li key={lease.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    {lease.properties?.name} - {lease.tenants?.first_name} {lease.tenants?.last_name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Rent: €{lease.rent_amount} | Due: {lease.payment_due_date}th of each month
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(lease.start_date).toLocaleDateString()} to {new Date(lease.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    lease.status === 'active' ? 'bg-green-100 text-green-800' :
                    lease.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    lease.status === 'terminated' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                  </span>
                  <button
                    onClick={() => handleEditLease(lease)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
          {leases.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No leases found. Create your first lease by clicking "Add New Lease".
            </li>
          )}
        </ul>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingLease ? 'Edit Lease' : 'Create New Lease'}
      >
        <LeaseForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          editingLease={editingLease}
        />
      </Modal>
    </div>
  );
}
