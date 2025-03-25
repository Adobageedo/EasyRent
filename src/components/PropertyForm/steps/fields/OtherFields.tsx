import React from 'react';
import { propertyConditions } from '../../validation/propertySchemas';

interface OtherFieldsProps {
  data: {
    typeDescription?: string;
    propertyDetails?: string;
    propertyCategory?: 'commercial' | 'industrial' | 'agricultural' | 'institutional' | 'mixed_use' | 'special_purpose';
    propertyCondition?: string;
    occupancyStatus?: 'vacant' | 'occupied' | 'partially_occupied';
    parking?: boolean;
    loadingDock?: boolean;
    securitySystem?: boolean;
    fireSafety?: boolean;
    airConditioning?: boolean;
  };
  onChange: (data: Partial<OtherFieldsProps['data']>) => void;
  errors: Record<string, string>;
}

const propertyCategories = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'institutional', label: 'Institutional' },
  { value: 'mixed_use', label: 'Mixed Use' },
  { value: 'special_purpose', label: 'Special Purpose' },
] as const;

const occupancyStatuses = [
  { value: 'vacant', label: 'Vacant' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'partially_occupied', label: 'Partially Occupied' },
] as const;

const OtherFields: React.FC<OtherFieldsProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="typeDescription" className="block text-sm font-medium text-gray-700">
            Type Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="typeDescription"
            maxLength={50}
            value={data.typeDescription || ''}
            onChange={(e) => onChange({ typeDescription: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.typeDescription ? 'border-red-500' : ''
            }`}
          />
          {errors.typeDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.typeDescription}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {(data.typeDescription?.length || 0)}/50 characters
          </p>
        </div>

        <div>
          <label htmlFor="propertyDetails" className="block text-sm font-medium text-gray-700">
            Property Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="propertyDetails"
            rows={4}
            maxLength={1000}
            value={data.propertyDetails || ''}
            onChange={(e) => onChange({ propertyDetails: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.propertyDetails ? 'border-red-500' : ''
            }`}
          />
          {errors.propertyDetails && (
            <p className="mt-1 text-sm text-red-500">{errors.propertyDetails}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {(data.propertyDetails?.length || 0)}/1000 characters
          </p>
        </div>
      </div>

      {/* Property Classification */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-700">
            Property Category <span className="text-red-500">*</span>
          </label>
          <select
            id="propertyCategory"
            value={data.propertyCategory || ''}
            onChange={(e) => onChange({ propertyCategory: e.target.value as OtherFieldsProps['data']['propertyCategory'] })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.propertyCategory ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select category</option>
            {propertyCategories.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.propertyCategory && (
            <p className="mt-1 text-sm text-red-500">{errors.propertyCategory}</p>
          )}
        </div>

        <div>
          <label htmlFor="propertyCondition" className="block text-sm font-medium text-gray-700">
            Property Condition <span className="text-red-500">*</span>
          </label>
          <select
            id="propertyCondition"
            value={data.propertyCondition || ''}
            onChange={(e) => onChange({ propertyCondition: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.propertyCondition ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select condition</option>
            {propertyConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition.replace('_', ' ').charAt(0).toUpperCase() + condition.slice(1)}
              </option>
            ))}
          </select>
          {errors.propertyCondition && (
            <p className="mt-1 text-sm text-red-500">{errors.propertyCondition}</p>
          )}
        </div>

        <div>
          <label htmlFor="occupancyStatus" className="block text-sm font-medium text-gray-700">
            Occupancy Status <span className="text-red-500">*</span>
          </label>
          <select
            id="occupancyStatus"
            value={data.occupancyStatus || ''}
            onChange={(e) => onChange({ occupancyStatus: e.target.value as OtherFieldsProps['data']['occupancyStatus'] })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.occupancyStatus ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select status</option>
            {occupancyStatuses.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.occupancyStatus && (
            <p className="mt-1 text-sm text-red-500">{errors.occupancyStatus}</p>
          )}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="parking"
              checked={data.parking || false}
              onChange={(e) => onChange({ parking: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="parking" className="ml-2 block text-sm text-gray-700">
              Parking
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="loadingDock"
              checked={data.loadingDock || false}
              onChange={(e) => onChange({ loadingDock: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="loadingDock" className="ml-2 block text-sm text-gray-700">
              Loading Dock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="securitySystem"
              checked={data.securitySystem || false}
              onChange={(e) => onChange({ securitySystem: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="securitySystem" className="ml-2 block text-sm text-gray-700">
              Security System
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fireSafety"
              checked={data.fireSafety || false}
              onChange={(e) => onChange({ fireSafety: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="fireSafety" className="ml-2 block text-sm text-gray-700">
              Fire Safety
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="airConditioning"
              checked={data.airConditioning || false}
              onChange={(e) => onChange({ airConditioning: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="airConditioning" className="ml-2 block text-sm text-gray-700">
              Air Conditioning
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherFields;
