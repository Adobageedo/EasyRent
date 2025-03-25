import React from 'react';
import { PropertyType } from '../PropertyForm';
import { 
  heatingTypes, 
  propertyConditions, 
  energyClasses 
} from '../validation/propertySchemas';

interface ReviewStepProps {
  formData: {
    type: PropertyType;
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
    specificFields: Record<string, any>;
  };
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onSubmit,
  onBack,
  isSubmitting,
  error,
}) => {
  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (key.includes('Type') && typeof value === 'string') {
      return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return value;
  };

  const renderSpecificFields = () => {
    const fields = formData.specificFields;
    
    switch (formData.type) {
      case 'home':
      case 'apartment':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Room Configuration</h4>
                <dl className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between py-1">
                    <dt>Total Rooms:</dt>
                    <dd>{fields.rooms}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Bedrooms:</dt>
                    <dd>{fields.bedrooms}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Bathrooms:</dt>
                    <dd>{fields.bathrooms}</dd>
                  </div>
                  {formData.type === 'apartment' && (
                    <div className="flex justify-between py-1">
                      <dt>Floor Number:</dt>
                      <dd>{fields.floorNumber}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Property Details</h4>
                <dl className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between py-1">
                    <dt>Heating Type:</dt>
                    <dd>{formatValue('heatingType', fields.heatingType)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Property Condition:</dt>
                    <dd>{formatValue('propertyCondition', fields.propertyCondition)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Energy Class:</dt>
                    <dd>{fields.energyClass}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>CO₂ Emission Class:</dt>
                    <dd>{fields.co2EmissionClass}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900">Features</h4>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(fields)
                  .filter(([key, value]) => typeof value === 'boolean' && value)
                  .map(([key]) => (
                    <li key={key} className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        );

      case 'garage':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Garage Details</h4>
                <dl className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between py-1">
                    <dt>Type:</dt>
                    <dd>{formatValue('garageType', fields.garageType)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Access Type:</dt>
                    <dd>{formatValue('secureAccessType', fields.secureAccessType)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Parking Spots:</dt>
                    <dd>{fields.parkingSpots}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Height:</dt>
                    <dd>{fields.height}m</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Features</h4>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(fields)
                  .filter(([key, value]) => typeof value === 'boolean' && value)
                  .map(([key]) => (
                    <li key={key} className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        );

      case 'land':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Land Details</h4>
                <dl className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between py-1">
                    <dt>Soil Type:</dt>
                    <dd>{formatValue('soilType', fields.soilType)}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Land Use Zone:</dt>
                    <dd>{formatValue('landUseZone', fields.landUseZone)}</dd>
                  </div>
                  {fields.buildable && (
                    <div className="flex justify-between py-1">
                      <dt>Max Building Coverage:</dt>
                      <dd>{fields.maxBuildingCoverage}%</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Available Services</h4>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(fields)
                  .filter(([key, value]) => key.endsWith('Service') && value)
                  .map(([key]) => (
                    <li key={key} className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {key.replace('Service', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        );

      case 'other':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Property Details</h4>
              <dl className="mt-2 text-sm text-gray-700">
                <div className="flex justify-between py-1">
                  <dt>Category:</dt>
                  <dd>{formatValue('propertyCategory', fields.propertyCategory)}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt>Type Description:</dt>
                  <dd>{fields.typeDescription}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt>Condition:</dt>
                  <dd>{formatValue('propertyCondition', fields.propertyCondition)}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt>Occupancy Status:</dt>
                  <dd>{formatValue('occupancyStatus', fields.occupancyStatus)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Features</h4>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(fields)
                  .filter(([key, value]) => typeof value === 'boolean' && value)
                  .map(([key]) => (
                    <li key={key} className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Additional Details</h4>
              <p className="mt-2 text-sm text-gray-700">{fields.propertyDetails}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {/* Basic Information */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Property Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.address.street}<br />
                {formData.address.postalCode} {formData.address.city}<br />
                {formData.address.country}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Area</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.totalArea} m²</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rent Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.rentAmount}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.description}</dd>
            </div>
          </dl>
        </div>

        {/* Photos */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Photos</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative aspect-w-1 aspect-h-1">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Property photo ${index + 1}`}
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Specific Fields */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Property Details</h3>
          <div className="mt-4">
            {renderSpecificFields()}
          </div>
        </div>
      </div>

      {/* GDPR Compliance */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="gdpr"
            name="gdpr"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="gdpr" className="font-medium text-gray-700">
            GDPR Compliance
          </label>
          <p className="text-gray-500">
            I consent to the processing of my data according to the privacy policy.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </div>
          ) : (
            'Submit Property'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
