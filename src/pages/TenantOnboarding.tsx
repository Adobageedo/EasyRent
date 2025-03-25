import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const tenantOnboardingSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type TenantOnboardingData = z.infer<typeof tenantOnboardingSchema>;

export default function TenantOnboarding() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempTenant, setTempTenant] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TenantOnboardingData>({
    resolver: zodResolver(tenantOnboardingSchema),
  });

  useEffect(() => {
    async function verifyInvite() {
      console.group('🔍 Tenant Invite Verification');
      console.log('📝 Starting verification process at:', new Date().toLocaleString());
      console.log('🔑 Verification parameters:', { 
        email, 
        token,
        url: window.location.href 
      });
      
      try {
        // 1. Session Check
        console.group('1️⃣ Checking Authentication Status');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session state:', {
          exists: !!session,
          user: session?.user?.email,
          expires: session?.expires_at
        });
        
        if (session?.user) {
          // Check if the session user matches the invite email
          if (session.user.email === email) {
            console.warn('⚠️ User already registered with this email');
            toast.error('You are already registered. Please sign out first.');
            navigate('/dashboard');
            return;
          } else {
            console.warn('⚠️ Different user logged in');
            // Sign out the current user
            await supabase.auth.signOut();
            toast.success('Signed out previous user. Please proceed with registration.');
          }
        }
        console.groupEnd(); // Session Check

        // 2. Parameter Validation
        console.group('2️⃣ Validating Parameters');
        if (!email) {
          console.error('❌ Missing email parameter');
          throw new Error('Invalid invite link - missing email');
        }
        if (!token) {
          console.error('❌ Missing token parameter');
          throw new Error('Invalid invite link - missing token');
        }
        console.log('✅ Parameters validated successfully');
        console.groupEnd(); // Parameter Validation

        // 3. Database Verification
        console.group('3️⃣ Verifying Invite in Database');
        console.log('Querying temp_tenants table with:', {
          email,
          token,
          status: 'pending'
        });

        const { data: tenant, error: tenantError } = await supabase
          .from('temp_tenants')
          .select('*')
          .eq('email', email)
          .eq('invite_token', token)
          .eq('status', 'pending')
          .single();

        if (tenantError) {
          console.error('❌ Database error:', {
            code: tenantError.code,
            message: tenantError.message,
            details: tenantError.details
          });
          throw new Error(`Invalid invite: ${tenantError.message}`);
        }

        if (!tenant) {
          console.error('❌ No matching tenant record found');
          throw new Error('Invalid or expired invite token');
        }

        console.log('✅ Found matching tenant record:', {
          id: tenant.id,
          name: `${tenant.first_name} ${tenant.last_name}`,
          created_at: new Date(tenant.created_at).toLocaleString()
        });
        console.groupEnd(); // Database Verification

        // 4. Expiration Check
        console.group('4️⃣ Checking Invite Expiration');
        const expirationDate = new Date(tenant.expires_at);
        const now = new Date();
        
        console.log('Expiration details:', {
          expires_at: expirationDate.toLocaleString(),
          current_time: now.toLocaleString(),
          time_left: Math.round((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), // days left
          is_expired: expirationDate < now
        });

        if (expirationDate < now) {
          console.error('❌ Invite has expired:', {
            expired_on: expirationDate.toLocaleString(),
            expired_for: Math.round((now.getTime() - expirationDate.getTime()) / (1000 * 60 * 60 * 24)) + ' days'
          });
          throw new Error(`Invite expired on ${expirationDate.toLocaleString()}`);
        }
        console.log('✅ Invite is still valid');
        console.groupEnd(); // Expiration Check

        // 5. Form Preparation
        console.group('5️⃣ Preparing Form Data');
        console.log('Setting form values from tenant record:', {
          first_name: tenant.first_name,
          last_name: tenant.last_name,
          email: tenant.email,
          phone: tenant.phone
        });

        setTempTenant(tenant);
        setValue('firstName', tenant.first_name);
        setValue('lastName', tenant.last_name);
        setValue('email', tenant.email);
        setValue('phone', tenant.phone);
        
        console.log('✅ Form data set successfully');
        console.groupEnd(); // Form Preparation

        toast.success('Invite verified successfully');
      } catch (error: any) {
        console.error('Verification error:', error);
        const errorMessage = error.message || 'Failed to verify invite';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    verifyInvite();
  }, [email, token, setValue]);

  const onSubmit = async (data: TenantOnboardingData) => {
    console.group('📝 Tenant Registration Process');
    console.log('📅 Starting registration at:', new Date().toLocaleString());
    console.log('📝 Form data received:', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordLength: data.password.length
    });
    
    try {
      setLoading(true);
      setError(null);
      
      // 1. Create auth user
      console.group('1️⃣ Creating Authentication User');
      console.log('🔑 Initiating signup with Supabase auth...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        },
      });

      console.log('💬 Auth response received:', {
        success: !authError,
        userId: authData?.user?.id,
        email: authData?.user?.email,
        created_at: authData?.user?.created_at
      });

      if (authError) {
        console.error('❌ Auth error:', {
          code: authError.code,
          message: authError.message,
          status: authError.status
        });
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        console.error('❌ No user data in auth response');
        throw new Error('Failed to create user account - no user data returned');
      }

      console.log('✅ Auth user created successfully');
      console.groupEnd(); // Auth User Creation

      // 2. Create tenant record
      console.group('2️⃣ Creating Tenant Record');
      console.log('📝 Preparing tenant data...');
      
      const tenantData = {
        user_id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('💾 Inserting tenant record:', tenantData);
      
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert(tenantData)
        .select()
        .single();

      if (tenantError) {
        console.error('❌ Tenant creation failed:', {
          code: tenantError.code,
          message: tenantError.message,
          details: tenantError.details
        });
        throw new Error(`Failed to create tenant: ${tenantError.message}`);
      }

      console.log('✅ Tenant record created:', {
        id: tenant.id,
        name: `${tenant.first_name} ${tenant.last_name}`,
        created_at: tenant.created_at
      });
      console.groupEnd(); // Tenant Creation

      // 3. Create lease record
      console.group('3️⃣ Creating Lease Record');
      console.log('🏠 Temp tenant lease details:', {
        property_id: tempTenant.property_id,
        start_date: tempTenant.lease_start_date,
        end_date: tempTenant.lease_end_date,
        rent_amount: tempTenant.rent_amount,
        deposit: tempTenant.deposit
      });
      
      const leaseData = {
        tenant_id: tenant.id,
        property_id: tempTenant.property_id,
        start_date: tempTenant.lease_start_date,
        end_date: tempTenant.lease_end_date,
        rent_amount: tempTenant.rent_amount,
        deposit_amount: tempTenant.deposit,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Creating lease record:', leaseData);
      const { error: leaseError } = await supabase
        .from('leases')
        .insert(leaseData);

      if (leaseError) {
        console.error('❌ Lease creation failed:', {
          code: leaseError.code,
          message: leaseError.message,
          details: leaseError.details
        });
        throw new Error(`Failed to create lease: ${leaseError.message}`);
      }

      console.log('✅ Lease record created successfully');
      console.groupEnd(); // Lease Creation

      // 4. Update temp tenant status
      console.group('4️⃣ Updating Invite Status');
      console.log('📝 Marking invite as completed for temp_tenant:', {
        id: tempTenant.id,
        email: tempTenant.email
      });

      const { error: updateError } = await supabase
        .from('temp_tenants')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', tempTenant.id);

      if (updateError) {
        console.error('❌ Status update failed:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details
        });
        throw new Error(`Failed to update invite status: ${updateError.message}`);
      }

      console.log('✅ Temp tenant status updated successfully');
      console.groupEnd(); // Invite Status Update

      console.log('🎉 Registration process completed successfully!');
      console.groupEnd(); // Tenant Registration Process

      toast.success('Account created successfully! Check your email to verify your account.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-gray-50 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
