import { useState, useEffect } from 'react';
import { Building2, BedDouble, Bath, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Modal from '../components/Modal';
import PropertyForm from '../components/PropertyForm/PropertyForm';
import { supabase } from '../lib/supabase';

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<any>(null);
  const [tenantInfo, setTenantInfo] = useState<any>(null);


  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setProperties(data);
    } catch (err: any) {
      setError('Error fetching properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);



  const handleEditProperty = (property: any) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!property.id || !uuidRegex.test(property.id)) {
      setError('Invalid property ID');
      return;
    }
    window.location.href = `/properties/${property.id}/edit`;
  };

  const checkPropertyTenants = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          tenants (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('property_id', propertyId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data;
    } catch (err) {
      console.error('Error checking tenants:', err);
      return null;
    }
  };

  const handleDeleteClick = async (property: any) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!property.id || !uuidRegex.test(property.id)) {
      setError('Invalid property ID');
      return;
    }
    const tenantData = await checkPropertyTenants(property.id);
    setTenantInfo(tenantData);
    setPropertyToDelete(property);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!propertyToDelete.id || !uuidRegex.test(propertyToDelete.id)) {
      setError('Invalid property ID');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id);

      if (error) throw error;
      
      setShowDeleteConfirm(false);
      setPropertyToDelete(null);
      setTenantInfo(null);
      fetchProperties();
    } catch (err: any) {
      setError('Error deleting property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setPropertyToDelete(null);
    setTenantInfo(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex justify-between">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-4 inline-flex text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => fetchProperties()}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Properties
            </h2>
            <button
              onClick={() => setShowAddProperty(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Property
            </button>
          </div>

          <Modal
            isOpen={showDeleteConfirm}
            onClose={handleDeleteCancel}
            title="Confirm Delete Property"
          >
        <div className="p-6">
          {tenantInfo ? (
            <div className="mb-4">
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>This property currently has an active tenant:</p>
                      <p className="mt-1">
                        {tenantInfo.tenants.first_name} {tenantInfo.tenants.last_name}
                        <br />
                        {tenantInfo.tenants.email}
                      </p>
                      <p className="mt-2">
                        Please ensure you have properly handled the lease termination before deleting this property.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <p className="mb-4 text-sm text-gray-500">
            Are you sure you want to delete this property? This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleDeleteCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Property Modal */}
      <Modal
        isOpen={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        title="Add New Property"
        size="large"
      >
        <div className="p-6">
          <PropertyForm
            onSuccess={() => {
              setShowAddProperty(false);
              fetchProperties();
            }}
          />
        </div>
      </Modal>



      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new property.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddProperty(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Property
              </button>
            </div>
          </div>
        ) : (
          properties.map((property) => (
          <div
            key={property.id}
            className="group overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
          >
            <div className="relative h-48">
              <img
                src={property.photos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80'}
                alt={property.title || 'Property'}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => handleEditProperty(property)}
                  className="rounded-full bg-white p-2 text-gray-600 shadow-md hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(property)}
                  className="rounded-full bg-white p-2 text-gray-600 shadow-md hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    property.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                    ${property.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {property.status || 'Available'}
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  €{property.rent_amount?.toLocaleString() || 0}/mo
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600 capitalize">
                    {property.property_type?.toLowerCase().replace('_', ' ') || 'Not specified'}
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-sm font-medium text-gray-900">
                    {property.total_area?.toLocaleString() || 0} m²
                  </span>
                </div>
              </div>

              {/* Property condition and energy info for homes and apartments */}
              {(property.property_type === 'home' || property.property_type === 'apartment') && property.property_condition && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span className="capitalize">{property.property_condition.toLowerCase().replace('_', ' ')}</span>
                  {property.energy_class && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      Energy Class {property.energy_class}
                    </span>
                  )}
                </div>
              )}

              {/* Property type-specific details */}
              {property.property_type === 'home' || property.property_type === 'apartment' ? (
                <div className="space-y-4">
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <BedDouble className="h-4 w-4 text-gray-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {property.num_rooms || property.rooms || 0} rooms
                      </span>
                    </div>
                    <div className="flex items-center justify-end">
                      <Bath className="h-4 w-4 text-gray-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {property.num_bathrooms || property.bathrooms || 0} baths
                      </span>
                    </div>
                  </div>
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {property.property_type === 'home' ? (
                      <>
                        {property.has_garden && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Garden</span>}
                        {property.has_garage && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Garage</span>}
                        {property.has_swimming_pool && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Pool</span>}
                      </>
                    ) : (
                      <>
                        {property.wheelchair_accessible && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Wheelchair Access</span>}
                        {property.has_elevator && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Elevator</span>}
                        {property.has_storage_room && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Storage</span>}
                      </>
                    )}
                    {property.has_air_conditioning && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">AC</span>}
                  </div>
                </div>
              ) : property.property_type === 'garage' ? (
                <div className="space-y-4">
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-600">
                      {property.garage_type?.toLowerCase().replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {property.parking_spots} spots
                    </div>
                  </div>
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {property.has_interior_lighting && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Lighting</span>}
                    {property.has_electrical_outlet && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Power</span>}
                    {property.has_water_supply && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Water</span>}
                    {property.has_security_camera && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Security</span>}
                  </div>
                </div>
              ) : property.property_type === 'land' ? (
                <div className="space-y-4">
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-600">
                      {property.land_use_zone?.toLowerCase().replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {property.is_buildable ? 'Buildable' : 'Not buildable'}
                    </div>
                  </div>
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {property.is_serviced && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Serviced</span>}
                    {property.has_vehicle_access && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Vehicle Access</span>}
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-600">
                  {property.property_category?.toLowerCase().replace('_', ' ')}
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500 truncate">
                  {[property.postal_code, property.city, property.country].filter(Boolean).join(', ')}
                </div>
                {property.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {property.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
        )}
        </div>
      </div>
    </Layout>
  );
}