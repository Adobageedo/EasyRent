import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import TenantInviteForm from '../components/TenantInviteForm/TenantInviteForm';

export default function Tenants() {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
            <button
              type="button"
              onClick={() => setShowInviteForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Tenant
            </button>
          </div>

          {/* Tenant Invite Form Modal */}
          {showInviteForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="absolute right-0 top-0 pr-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowInviteForm(false)}
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Close</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                          Invite New Tenant
                        </h3>
                        <div className="mt-2">
                          <TenantInviteForm 
                            onSuccess={() => setShowInviteForm(false)}
                            onCancel={() => setShowInviteForm(false)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}