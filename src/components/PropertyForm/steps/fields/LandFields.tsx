import React from 'react';

interface LandFieldsProps {
  data: {
    buildable?: boolean;
    maxBuildingCoverage?: number;
    serviced?: boolean;
    soilType?: 'clay' | 'loam' | 'sand' | 'silt' | 'rock' | 'mixed';
    landUseZone?: 'residential' | 'commercial' | 'industrial' | 'agricultural' | 'mixed';
    waterService?: boolean;
    electricityService?: boolean;
    gasService?: boolean;
    sewerService?: boolean;
    internetService?: boolean;
  };
  onChange: (data: Partial<LandFieldsProps['data']>) => void;
  errors: Record<string, string>;
}

const soilTypes = [
  { value: 'clay', label: 'Clay' },
  { value: 'loam', label: 'Loam' },
  { value: 'sand', label: 'Sand' },
  { value: 'silt', label: 'Silt' },
  { value: 'rock', label: 'Rock' },
  { value: 'mixed', label: 'Mixed' },
] as const;

const landUseZones = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'mixed', label: 'Mixed Use' },
] as const;

const LandFields: React.FC<LandFieldsProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Building Status */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="buildable"
            checked={data.buildable || false}
            onChange={(e) => onChange({ buildable: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="buildable" className="ml-2 block text-sm text-gray-700">
            Buildable Land
          </label>
        </div>
        {data.buildable && (
          <div className="mt-4">
            <label htmlFor="maxBuildingCoverage" className="block text-sm font-medium text-gray-700">
              Maximum Building Coverage (%)
            </label>
            <input
              type="number"
              id="maxBuildingCoverage"
              min="0"
              max="100"
              value={data.maxBuildingCoverage || ''}
              onChange={(e) => onChange({ maxBuildingCoverage: Number(e.target.value) })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.maxBuildingCoverage ? 'border-red-500' : ''
              }`}
            />
            {errors.maxBuildingCoverage && (
              <p className="mt-1 text-sm text-red-500">{errors.maxBuildingCoverage}</p>
            )}
          </div>
        )}
      </div>

      {/* Land Characteristics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">
            Soil Type <span className="text-red-500">*</span>
          </label>
          <select
            id="soilType"
            value={data.soilType || ''}
            onChange={(e) => onChange({ soilType: e.target.value as LandFieldsProps['data']['soilType'] })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.soilType ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select soil type</option>
            {soilTypes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.soilType && <p className="mt-1 text-sm text-red-500">{errors.soilType}</p>}
        </div>
        <div>
          <label htmlFor="landUseZone" className="block text-sm font-medium text-gray-700">
            Land Use Zone <span className="text-red-500">*</span>
          </label>
          <select
            id="landUseZone"
            value={data.landUseZone || ''}
            onChange={(e) => onChange({ landUseZone: e.target.value as LandFieldsProps['data']['landUseZone'] })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.landUseZone ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select land use zone</option>
            {landUseZones.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.landUseZone && <p className="mt-1 text-sm text-red-500">{errors.landUseZone}</p>}
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="serviced"
            checked={data.serviced || false}
            onChange={(e) => onChange({ serviced: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="serviced" className="ml-2 block text-sm text-gray-700">
            Serviced Land
          </label>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Available Services</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="waterService"
                checked={data.waterService || false}
                onChange={(e) => onChange({ waterService: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="waterService" className="ml-2 block text-sm text-gray-700">
                Water Service
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="electricityService"
                checked={data.electricityService || false}
                onChange={(e) => onChange({ electricityService: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="electricityService" className="ml-2 block text-sm text-gray-700">
                Electricity Service
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="gasService"
                checked={data.gasService || false}
                onChange={(e) => onChange({ gasService: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="gasService" className="ml-2 block text-sm text-gray-700">
                Gas Service
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sewerService"
                checked={data.sewerService || false}
                onChange={(e) => onChange({ sewerService: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sewerService" className="ml-2 block text-sm text-gray-700">
                Sewer Service
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="internetService"
                checked={data.internetService || false}
                onChange={(e) => onChange({ internetService: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="internetService" className="ml-2 block text-sm text-gray-700">
                Internet Service
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandFields;
