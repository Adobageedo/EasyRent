import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];
type Tenant = Database['public']['Tables']['tenants']['Row'];
type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];

export function useUserData() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id);

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData);

      // Fetch tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .eq('user_id', user.id);

      if (tenantsError) throw tenantsError;
      setTenants(tenantsData);

      // Fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('user_id', user.id);

      if (maintenanceError) throw maintenanceError;
      setMaintenanceRequests(maintenanceData);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }

  return {
    properties,
    tenants,
    maintenanceRequests,
    loading,
    error,
    refetch: fetchUserData
  };
}
