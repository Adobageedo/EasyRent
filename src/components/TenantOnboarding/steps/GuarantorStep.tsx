import { useFormContext } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { guarantorSchema } from '../validation/tenantOnboardingSchema';
import { z } from 'zod';

type GuarantorData = NonNullable<z.infer<typeof guarantorSchema>>;

interface FileUploadProps {
  fieldName: keyof GuarantorData['documents'];
  label: string;
}

function FileUploadField({ fieldName, label }: FileUploadProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<{ guarantor: GuarantorData }>();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = watch(`guarantor.documents.${fieldName}`) || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      const uploadedFiles = event.target.files;
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      const newUrls: string[] = [];

      for (const file of Array.from(uploadedFiles)) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Files must be less than 10MB');
        }

        // Validate file type
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
          throw new Error('Only PDF, JPEG, and PNG files are allowed');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `guarantor/${fieldName}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('tenant_documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('tenant_documents')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      // Update form values
      setValue(`guarantor.documents.${fieldName}`, [...files, ...newUrls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (urlToRemove: string) => {
    setValue(
      `guarantor.documents.${fieldName}`,
      files.filter(url => url !== urlToRemove)
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={`guarantor-${fieldName}-upload`}
                className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload files</span>
                <input
                  id={`guarantor-${fieldName}-upload`}
                  name={`guarantor-${fieldName}-upload`}
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {errors.guarantor?.documents?.[fieldName] && (
        <p className="mt-1 text-sm text-red-600">
          {errors.guarantor.documents[fieldName]?.message}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Documents</h4>
          <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-200">
            {files.map((url, index) => (
              <li key={url} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <span className="ml-3 text-sm text-gray-500">Document {index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(url)}
                  className="ml-4 flex-shrink-0 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function GuarantorStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{ guarantor: GuarantorData }>();

  const [includeGuarantor, setIncludeGuarantor] = useState(false);

  // When guarantor is not included, clear the form data
  const handleIncludeGuarantorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const include = event.target.checked;
    setIncludeGuarantor(include);
    if (!include) {
      setValue('guarantor', undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Guarantor Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          If you would like to include a guarantor for your lease, please provide their information.
        </p>
      </div>

      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="include-guarantor"
            type="checkbox"
            checked={includeGuarantor}
            onChange={handleIncludeGuarantorChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="include-guarantor" className="font-medium text-gray-700">
            Include a guarantor
          </label>
          <p className="text-gray-500">Add a guarantor to support your rental application</p>
        </div>
      </div>

      {includeGuarantor && (
        <div className="space-y-6 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="guarantor.name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="guarantor.name"
                {...register('guarantor.name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.guarantor?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.guarantor.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guarantor.occupation" className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <input
                type="text"
                id="guarantor.occupation"
                {...register('guarantor.occupation')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.guarantor?.occupation && (
                <p className="mt-1 text-sm text-red-600">{errors.guarantor.occupation.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guarantor.email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="guarantor.email"
                {...register('guarantor.email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.guarantor?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.guarantor.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guarantor.phone" className="block text-sm font-medium text-gray-700">
                Phone Number (with country code)
              </label>
              <input
                type="tel"
                id="guarantor.phone"
                {...register('guarantor.phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="+1234567890"
              />
              {errors.guarantor?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.guarantor.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <FileUploadField
              fieldName="proof_of_income"
              label="Proof of Income"
            />

            <FileUploadField
              fieldName="proof_of_residence"
              label="Proof of Residence"
            />
          </div>
        </div>
      )}
    </div>
  );
}
