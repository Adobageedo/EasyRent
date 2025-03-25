import React, { useEffect, useState } from 'react';
import { Building2, Users, Wallet, PenTool as Tool } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout/Layout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeTenants: 0,
    monthlyRevenue: 0,
    pendingMaintenance: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Fetch properties count
        const { data: properties } = await supabase
          .from('properties')
          .select('id, rent_amount')
          .eq('user_id', user.id);

        // Fetch active tenants
        const { data: tenants } = await supabase
          .from('tenants')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'Active');

        // Fetch pending maintenance requests
        const { data: maintenance } = await supabase
          .from('maintenance_requests')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'Pending');

        // Calculate monthly revenue
        const totalRevenue = properties?.reduce((sum, prop) => sum + (prop.rent_amount || 0), 0) || 0;

        setStats({
          totalProperties: properties?.length || 0,
          activeTenants: tenants?.length || 0,
          monthlyRevenue: totalRevenue,
          pendingMaintenance: maintenance?.length || 0,
        });

        // Fetch recent activity
        const { data: recentActivity } = await supabase
          .from('maintenance_requests')
          .select('id, description, status, created_at, property_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // If we have maintenance requests, fetch the related property names
        let maintenanceWithProperties = [];
        if (recentActivity && recentActivity.length > 0) {
          const propertyIds = recentActivity.map(req => req.property_id);
          const { data: propertiesData } = await supabase
            .from('properties')
            .select('id, name')
            .in('id', propertyIds);

          maintenanceWithProperties = recentActivity.map(req => ({
            ...req,
            property: propertiesData?.find(p => p.id === req.property_id)
          }));
        }

        setRecentActivity(maintenanceWithProperties || []);

        // Fetch upcoming payments
        const { data: leases } = await supabase
          .from('leases')
          .select('id, start_date, end_date, rent_amount, property_id, tenant_id')
          .eq('user_id', user.id)
          .order('start_date', { ascending: true })
          .limit(5);

        // If we have leases, fetch the related property and tenant data
        let leasesWithDetails = [];
        if (leases && leases.length > 0) {
          const propertyIds = leases.map(lease => lease.property_id);
          const tenantIds = leases.map(lease => lease.tenant_id);

          const [{ data: propertiesData }, { data: tenantsData }] = await Promise.all([
            supabase
              .from('properties')
              .select('id, name')
              .in('id', propertyIds),
            supabase
              .from('tenants')
              .select('id, first_name, last_name')
              .in('id', tenantIds)
          ]);

          leasesWithDetails = leases.map(lease => ({
            ...lease,
            property: propertiesData?.find(p => p.id === lease.property_id),
            tenant: tenantsData?.find(t => t.id === lease.tenant_id)
          }));
        }

        setUpcomingPayments(leasesWithDetails || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Add loading state UI
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-500">Loading dashboard data...</div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { name: 'Total Properties', value: stats.totalProperties, icon: Building2 },
    { name: 'Active Tenants', value: stats.activeTenants, icon: Users },
    { name: 'Monthly Revenue', value: `€${stats.monthlyRevenue.toLocaleString()}`, icon: Wallet },
    { name: 'Pending Maintenance', value: stats.pendingMaintenance, icon: Tool },
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        
        <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-blue-500 p-3">
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.properties?.name}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Upcoming Payments
              </h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {upcomingPayments.map((payment) => (
                    <li key={payment.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Rent Payment Due
                          </p>
                          <p className="text-sm text-gray-500">
                            €{payment.rent_amount} - {payment.properties?.name}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">
                            {new Date(payment.start_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}