import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Application Submitted Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for completing your tenant onboarding. Your application has been submitted and
              is now under review.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              The property manager will review your application and contact you shortly.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
