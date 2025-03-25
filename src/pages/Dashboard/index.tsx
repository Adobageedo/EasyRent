import { useEffect, useState } from 'react';
import { Grid, Card, Typography, Container } from '@mui/material';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  properties: number;
  tenants: number;
  inspections: number;
  maintenance: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    properties: 0,
    tenants: 0,
    inspections: 0,
    maintenance: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [
      { count: propertiesCount },
      { count: tenantsCount },
      { count: inspectionsCount },
      { count: maintenanceCount },
    ] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('tenants').select('*', { count: 'exact', head: true }),
      supabase.from('inspections').select('*', { count: 'exact', head: true }),
      supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      properties: propertiesCount || 0,
      tenants: tenantsCount || 0,
      inspections: inspectionsCount || 0,
      maintenance: maintenanceCount || 0,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Properties
            </Typography>
            <Typography variant="h4">{stats.properties}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Tenants
            </Typography>
            <Typography variant="h4">{stats.tenants}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Inspections
            </Typography>
            <Typography variant="h4">{stats.inspections}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Maintenance
            </Typography>
            <Typography variant="h4">{stats.maintenance}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
