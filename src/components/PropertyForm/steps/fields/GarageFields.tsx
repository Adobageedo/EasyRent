import React from 'react';

interface GarageFieldsProps {
  data: {
    garageType?: 'enclosed_box' | 'outdoor_parking' | 'underground';
    secureAccessType?: 'badge' | 'key' | 'keypad' | 'remote' | 'none';
    parkingSpots?: number;
    height?: number;
    interiorLighting?: boolean;
    electricalOutlet?: boolean;
    waterSupply?: boolean;
    securityCamera?: boolean;
    automaticDoor?: boolean;
  };
  onChange: (data: Partial<GarageFieldsProps['data']>) => void;
  errors: Record<string, string>;
}

const garageTypes = [
  { value: 'enclosed_box', label: 'Enclosed Box' },
  { value: 'outdoor_parking', label: 'Outdoor Parking' },
  { value: 'underground', label: 'Underground' },
] as const;

const secureAccessTypes = [
  { value: 'badge', label: 'Badge' },
  { value: 'key', label: 'Key' },
  { value: 'keypad', label: 'Keypad' },
  { value: 'remote', label: 'Remote' },
  { value: 'none', label: 'None' },
] as const;

const GarageFields: React.FC<GarageFieldsProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Garage Type & Access */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="garageType" className="block text-sm font-medium text-gray-700">
            Garage Type <span className="text-red-500">*</span>
          </label>
          <select
            id="garageType"
            value={data.garageType || ''}
            onChange={(e) => onChange({ garageType: e.target.value as GarageFieldsProps['data']['garageType'] })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.garageType ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select garage type</option>
            {garageTypes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.garageType && <p className="mt-1 text-sm text-red-500">{errors.garageType}</p>}
        </div>
        <div>
          <label htmlFor="secureAccessType" className="block text-sm font-medium text-gray-700">
            Secure Access Type <span className="text-red-500">*</span>
          </label>
          <select
            id="secureAccessType"
            value={data.secureAccessType || ''}
            onChange={(e) => onChange({ secureAccessType: e.target.value as GarageFieldsProps['data']['secureAccessType'] })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.secureAccessType ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select access type</option>
            {secureAccessTypes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.secureAccessType && (
            <p className="mt-1 text-sm text-red-500">{errors.secureAccessType}</p>
          )}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="parkingSpots" className="block text-sm font-medium text-gray-700">
            Parking Spots <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="parkingSpots"
            min="1"
            value={data.parkingSpots || ''}
            onChange={(e) => onChange({ parkingSpots: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.parkingSpots ? 'border-red-500' : ''
            }`}
          />
          {errors.parkingSpots && <p className="mt-1 text-sm text-red-500">{errors.parkingSpots}</p>}
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Height (m) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="height"
            min="0.1"
            step="0.1"
            value={data.height || ''}
            onChange={(e) => onChange({ height: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.height ? 'border-red-500' : ''
            }`}
          />
          {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="interiorLighting"
              checked={data.interiorLighting || false}
              onChange={(e) => onChange({ interiorLighting: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="interiorLighting" className="ml-2 block text-sm text-gray-700">
              Interior Lighting
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="electricalOutlet"
              checked={data.electricalOutlet || false}
              onChange={(e) => onChange({ electricalOutlet: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="electricalOutlet" className="ml-2 block text-sm text-gray-700">
              Electrical Outlet
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="waterSupply"
              checked={data.waterSupply || false}
              onChange={(e) => onChange({ waterSupply: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="waterSupply" className="ml-2 block text-sm text-gray-700">
              Water Supply
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="securityCamera"
              checked={data.securityCamera || false}
              onChange={(e) => onChange({ securityCamera: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="securityCamera" className="ml-2 block text-sm text-gray-700">
              Security Camera
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="automaticDoor"
              checked={data.automaticDoor || false}
              onChange={(e) => onChange({ automaticDoor: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="automaticDoor" className="ml-2 block text-sm text-gray-700">
              Automatic Door
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageFields;
