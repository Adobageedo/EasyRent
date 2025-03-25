import { useFormContext } from 'react-hook-form';
import { personalInfoSchema } from '../validation/tenantOnboardingSchema';
import { z } from 'zod';

type PersonalInfoData = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PersonalInfoData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide your personal details and emergency contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            {...register('date_of_birth')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.date_of_birth && (
            <p className="mt-1 text-sm text-red-600">{errors.date_of_birth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            {...register('occupation')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Software Engineer"
          />
          {errors.occupation && (
            <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-base font-medium text-gray-900">Emergency Contact</h3>
          
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="emergency_contact.name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="emergency_contact.name"
                {...register('emergency_contact.name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.emergency_contact?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.emergency_contact.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergency_contact.phone" className="block text-sm font-medium text-gray-700">
                Phone Number (with country code)
              </label>
              <input
                type="tel"
                id="emergency_contact.phone"
                {...register('emergency_contact.phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="+1234567890"
              />
              {errors.emergency_contact?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.emergency_contact.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergency_contact.email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="emergency_contact.email"
                {...register('emergency_contact.email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.emergency_contact?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.emergency_contact.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
