import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { tenantOnboardingSchema } from '../../components/TenantOnboarding/validation/tenantOnboardingSchema';
import PersonalInfoStep from '../../components/TenantOnboarding/steps/PersonalInfoStep';
import FinancialInfoStep from '../../components/TenantOnboarding/steps/FinancialInfoStep';
import DocumentUploadStep from '../../components/TenantOnboarding/steps/DocumentUploadStep';
import GuarantorStep from '../../components/TenantOnboarding/steps/GuarantorStep';

type TenantOnboardingData = z.infer<typeof tenantOnboardingSchema>;

const steps = [
  { id: 'personal', title: 'Personal Information', component: PersonalInfoStep },
  { id: 'financial', title: 'Financial Information', component: FinancialInfoStep },
  { id: 'documents', title: 'Document Upload', component: DocumentUploadStep },
  { id: 'guarantor', title: 'Guarantor Information', component: GuarantorStep },
];

export default function TenantOnboarding() {
  const router = useRouter();
  const { id } = router.query;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempTenant, setTempTenant] = useState<any>(null);

  const methods = useForm<TenantOnboardingData>({
    resolver: zodResolver(tenantOnboardingSchema),
    mode: 'onChange',
  });

  // Fetch temp tenant data
  useEffect(() => {
    const fetchTempTenant = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('temp_tenants')
          .select('*, properties(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Invite not found');

        // Check if invite has expired
        if (new Date(data.expires_at) < new Date()) {
          throw new Error('This invite has expired');
        }

        setTempTenant(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTempTenant();
  }, [id]);

  const onSubmit = async (data: TenantOnboardingData) => {
    try {
      setLoading(true);

      // Create tenant profile
      const { data: tenantProfile, error: tenantError } = await supabase
        .from('tenant_profiles')
        .insert([
          {
            temp_tenant_id: id,
            date_of_birth: data.personal_info.date_of_birth,
            occupation: data.personal_info.occupation,
            emergency_contact: data.personal_info.emergency_contact,
          },
        ])
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Upload documents
      const { data: documents, error: documentsError } = await supabase
        .from('tenant_documents')
        .insert([
          {
            tenant_profile_id: tenantProfile.id,
            id_document: data.documents.id_document,
            proof_of_income: data.documents.proof_of_income,
            proof_of_residence: data.documents.proof_of_residence,
          },
        ]);

      if (documentsError) throw documentsError;

      // Add guarantor if provided
      if (data.guarantor) {
        const { error: guarantorError } = await supabase
          .from('tenant_guarantors')
          .insert([
            {
              tenant_profile_id: tenantProfile.id,
              name: data.guarantor.name,
              email: data.guarantor.email,
              phone: data.guarantor.phone,
              occupation: data.guarantor.occupation,
              proof_of_income: data.guarantor.documents.proof_of_income,
              proof_of_residence: data.guarantor.documents.proof_of_residence,
            },
          ]);

        if (guarantorError) throw guarantorError;
      }

      // Update temp tenant status
      const { error: updateError } = await supabase
        .from('temp_tenants')
        .update({ status: 'completed' })
        .eq('id', id);

      if (updateError) throw updateError;

      // Redirect to success page
      router.push('/onboarding/success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Error</h2>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol role="list" className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
                {steps.map((step, stepIdx) => (
                  <li key={step.id} className="relative md:flex-1 md:flex">
                    <div
                      className={`group flex items-center w-full ${
                        stepIdx !== steps.length - 1 ? 'md:pr-2' : ''
                      }`}
                    >
                      <span className="px-6 py-4 flex items-center text-sm font-medium">
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            stepIdx < currentStep
                              ? 'bg-blue-600'
                              : stepIdx === currentStep
                              ? 'border-2 border-blue-600'
                              : 'border-2 border-gray-300'
                          } mr-4`}
                        >
                          {stepIdx < currentStep ? (
                            <span className="text-white">✓</span>
                          ) : (
                            <span
                              className={
                                stepIdx === currentStep ? 'text-blue-600' : 'text-gray-500'
                              }
                            >
                              {stepIdx + 1}
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            stepIdx === currentStep ? 'text-blue-600' : 'text-gray-500'
                          }
                        >
                          {step.title}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Form */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <CurrentStepComponent />

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(current => Math.max(0, current - 1))}
                      disabled={currentStep === 0}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                      onClick={() => {
                        if (currentStep < steps.length - 1) {
                          methods.trigger().then(isValid => {
                            if (isValid) {
                              setCurrentStep(current => Math.min(steps.length - 1, current + 1));
                            }
                          });
                        }
                      }}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {currentStep === steps.length - 1 ? (
                        loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Submitting...
                          </span>
                        ) : (
                          'Submit'
                        )
                      ) : (
                        'Next'
                      )}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
