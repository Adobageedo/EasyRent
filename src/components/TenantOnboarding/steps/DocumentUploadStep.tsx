import { useFormContext } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { documentSchema } from '../validation/tenantOnboardingSchema';
import { z } from 'zod';

type DocumentData = z.infer<typeof documentSchema>;

interface FileUploadProps {
  fieldName: keyof DocumentData;
  label: string;
  required?: boolean;
}

function FileUploadField({ fieldName, label, required }: FileUploadProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DocumentData>();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = watch(fieldName) || [];

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
        const filePath = `${fieldName}/${fileName}`;

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
      setValue(fieldName, [...files, ...newUrls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (urlToRemove: string) => {
    setValue(
      fieldName,
      files.filter(url => url !== urlToRemove)
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={`${fieldName}-upload`}
                className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload files</span>
                <input
                  id={`${fieldName}-upload`}
                  name={`${fieldName}-upload`}
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

      {errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]?.message}</p>
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

export default function DocumentUploadStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Required Documents</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please upload the required documents. Make sure all documents are clear and readable.
        </p>
      </div>

      <div className="space-y-8">
        <FileUploadField
          fieldName="id_document"
          label="Government-issued ID (Passport or Driver's License)"
          required
        />

        <FileUploadField
          fieldName="proof_of_income"
          label="Proof of Income (Last 3 payslips)"
        />

        <FileUploadField
          fieldName="proof_of_residence"
          label="Proof of Current Residence"
        />
      </div>
    </div>
  );
}
