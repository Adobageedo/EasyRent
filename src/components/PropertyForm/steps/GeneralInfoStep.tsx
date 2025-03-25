import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { X } from 'lucide-react';

const generalInfoSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  address: z.object({
    street: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address cannot exceed 200 characters'),
    postalCode: z.string().min(4, 'Postal code must be at least 4 characters').max(10, 'Postal code cannot exceed 10 characters'),
    city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City cannot exceed 100 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country cannot exceed 100 characters'),
  }),
  totalArea: z.number().positive('Total area must be positive').max(100000, 'Total area cannot exceed 100,000 m²'),
  rentAmount: z.number().positive('Rent amount must be positive').max(1000000, 'Rent amount cannot exceed 1,000,000'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description cannot exceed 2000 characters'),
  photos: z.array(z.any()).min(1, 'At least one photo is required').max(10, 'Maximum 10 photos allowed'),
});

interface GeneralInfoStepProps {
  formData: {
    title: string;
    address: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
    };
    totalArea: number;
    rentAmount: number;
    description: string;
    photos: File[];
  };
  updateFormData: (data: Partial<typeof FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos = [...formData.photos];
    acceptedFiles.forEach(file => {
      if (newPhotos.length < 10) {
        newPhotos.push(file);
      }
    });
    updateFormData({ photos: newPhotos });
  }, [formData.photos, updateFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 10,
  });

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateFormData({ photos: newPhotos });
  };

  const handleSubmit = () => {
    try {
      generalInfoSchema.parse(formData);
      setErrors({});
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    subfield?: string
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    
    if (subfield) {
      updateFormData({
        address: {
          ...formData.address,
          [subfield]: value,
        },
      });
    } else {
      updateFormData({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange(e, 'title')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Address</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street & Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange(e, 'address', 'street')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors['address.street'] ? 'border-red-500' : ''
                }`}
              />
              {errors['address.street'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.street']}</p>
              )}
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.address.postalCode}
                onChange={(e) => handleInputChange(e, 'address', 'postalCode')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors['address.postalCode'] ? 'border-red-500' : ''
                }`}
              />
              {errors['address.postalCode'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.postalCode']}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange(e, 'address', 'city')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors['address.city'] ? 'border-red-500' : ''
                }`}
              />
              {errors['address.city'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
              )}
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="country"
                value={formData.address.country}
                onChange={(e) => handleInputChange(e, 'address', 'country')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors['address.country'] ? 'border-red-500' : ''
                }`}
              />
              {errors['address.country'] && (
                <p className="mt-1 text-sm text-red-500">{errors['address.country']}</p>
              )}
            </div>
          </div>
        </div>

        {/* Area and Rent */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="totalArea" className="block text-sm font-medium text-gray-700">
              Total Area (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="totalArea"
              value={formData.totalArea || ''}
              onChange={(e) => handleInputChange(e, 'totalArea')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.totalArea ? 'border-red-500' : ''
              }`}
            />
            {errors.totalArea && (
              <p className="mt-1 text-sm text-red-500">{errors.totalArea}</p>
            )}
          </div>
          <div>
            <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700">
              Rent Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="rentAmount"
              value={formData.rentAmount || ''}
              onChange={(e) => handleInputChange(e, 'rentAmount')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.rentAmount ? 'border-red-500' : ''
              }`}
            />
            {errors.rentAmount && (
              <p className="mt-1 text-sm text-red-500">{errors.rentAmount}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange(e, 'description')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="space-y-1 text-center">
              <input {...getInputProps()} />
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Upload photos
                </span>{' '}
                or drag and drop
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10 photos</p>
            </div>
          </div>
          {errors.photos && (
            <p className="mt-1 text-sm text-red-500">{errors.photos}</p>
          )}
          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default GeneralInfoStep;
