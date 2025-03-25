import React from 'react';
import { heatingTypes, propertyConditions, energyClasses } from '../../validation/propertySchemas';

interface ApartmentFieldsProps {
  data: {
    num_rooms?: number;
    num_bedrooms?: number;
    num_bathrooms?: number;
    floor_number?: number;
    wheelchair_accessible?: boolean;
    has_elevator?: boolean;
    has_storage_room?: boolean;
    has_balcony?: boolean;
    balcony_size?: number;
    has_terrace?: boolean;
    terrace_size?: number;
    has_garage?: boolean;
    garage_size?: number;
    heating_type?: string;
    property_condition?: string;
    energy_class?: string;
    co2_emission_class?: string;
    has_air_conditioning?: boolean;
  };
  onChange: (data: Partial<ApartmentFieldsProps['data']>) => void;
  errors: Record<string, string>;
}

const ApartmentFields: React.FC<ApartmentFieldsProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Room Configuration */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
            Total Rooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="num_rooms"
            min="1"
            value={data.num_rooms || ''}
            onChange={(e) => onChange({ num_rooms: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.num_rooms ? 'border-red-500' : ''
            }`}
          />
          {errors.num_rooms && <p className="mt-1 text-sm text-red-500">{errors.num_rooms}</p>}
        </div>
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
            Bedrooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="num_bedrooms"
            min="1"
            value={data.num_bedrooms || ''}
            onChange={(e) => onChange({ num_bedrooms: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.num_bedrooms ? 'border-red-500' : ''
            }`}
          />
          {errors.num_bedrooms && <p className="mt-1 text-sm text-red-500">{errors.num_bedrooms}</p>}
        </div>
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
            Bathrooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="num_bathrooms"
            min="1"
            value={data.num_bathrooms || ''}
            onChange={(e) => onChange({ num_bathrooms: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.num_bathrooms ? 'border-red-500' : ''
            }`}
          />
          {errors.num_bathrooms && <p className="mt-1 text-sm text-red-500">{errors.num_bathrooms}</p>}
        </div>
        <div>
          <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700">
            Floor Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="floor_number"
            min="0"
            value={data.floor_number || ''}
            onChange={(e) => onChange({ floor_number: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.floor_number ? 'border-red-500' : ''
            }`}
          />
          {errors.floor_number && <p className="mt-1 text-sm text-red-500">{errors.floor_number}</p>}
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="wheelchair_accessible"
            checked={data.wheelchair_accessible || false}
            onChange={(e) => onChange({ wheelchair_accessible: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="wheelchair_accessible" className="ml-2 block text-sm text-gray-700">
            Wheelchair Access
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_elevator"
            checked={data.has_elevator || false}
            onChange={(e) => onChange({ has_elevator: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="has_elevator" className="ml-2 block text-sm text-gray-700">
            Elevator
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_storage_room"
            checked={data.has_storage_room || false}
            onChange={(e) => onChange({ has_storage_room: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="has_storage_room" className="ml-2 block text-sm text-gray-700">
            Storage Room
          </label>
        </div>
      </div>

      {/* Outdoor Spaces */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_balcony"
              checked={data.has_balcony || false}
              onChange={(e) => onChange({ has_balcony: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="has_balcony" className="ml-2 block text-sm text-gray-700">
              Balcony
            </label>
          </div>
          {data.has_balcony && (
            <div className="mt-2">
              <label htmlFor="balcony_size" className="block text-sm font-medium text-gray-700">
                Balcony Size (m²)
              </label>
              <input
                type="number"
                id="balcony_size"
                min="1"
                value={data.balcony_size || ''}
                onChange={(e) => onChange({ balcony_size: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_terrace"
              checked={data.has_terrace || false}
              onChange={(e) => onChange({ has_terrace: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="has_terrace" className="ml-2 block text-sm text-gray-700">
              Terrace
            </label>
          </div>
          {data.has_terrace && (
            <div className="mt-2">
              <label htmlFor="terrace_size" className="block text-sm font-medium text-gray-700">
                Terrace Size (m²)
              </label>
              <input
                type="number"
                id="terrace_size"
                min="1"
                value={data.terrace_size || ''}
                onChange={(e) => onChange({ terrace_size: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Garage */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_garage"
            checked={data.has_garage || false}
            onChange={(e) => onChange({ has_garage: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="has_garage" className="ml-2 block text-sm text-gray-700">
            Garage
          </label>
        </div>
        {data.has_garage && (
          <div className="mt-2">
            <label htmlFor="garage_size" className="block text-sm font-medium text-gray-700">
              Garage Size (m²)
            </label>
            <input
              type="number"
              id="garage_size"
              min="1"
              value={data.garage_size || ''}
              onChange={(e) => onChange({ garage_size: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
      </div>

      {/* Heating & Condition */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="heating_type" className="block text-sm font-medium text-gray-700">
            Heating Type <span className="text-red-500">*</span>
          </label>
          <select
            id="heating_type"
            value={data.heating_type || ''}
            onChange={(e) => onChange({ heating_type: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.heating_type ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select heating type</option>
            {heatingTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          {errors.heating_type && <p className="mt-1 text-sm text-red-500">{errors.heating_type}</p>}
        </div>
        <div>
          <label htmlFor="property_condition" className="block text-sm font-medium text-gray-700">
            Property Condition <span className="text-red-500">*</span>
          </label>
          <select
            id="property_condition"
            value={data.property_condition || ''}
            onChange={(e) => onChange({ property_condition: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.property_condition ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select condition</option>
            {propertyConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition.replace('_', ' ').charAt(0).toUpperCase() + condition.slice(1)}
              </option>
            ))}
          </select>
          {errors.property_condition && (
            <p className="mt-1 text-sm text-red-500">{errors.property_condition}</p>
          )}
        </div>
      </div>

      {/* Energy Ratings */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="energy_class" className="block text-sm font-medium text-gray-700">
            Energy Class <span className="text-red-500">*</span>
          </label>
          <select
            id="energy_class"
            value={data.energy_class || ''}
            onChange={(e) => onChange({ energy_class: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.energy_class ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select energy class</option>
            {energyClasses.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
          {errors.energy_class && <p className="mt-1 text-sm text-red-500">{errors.energy_class}</p>}
        </div>
        <div>
          <label htmlFor="co2_emission_class" className="block text-sm font-medium text-gray-700">
            CO₂ Emission Class <span className="text-red-500">*</span>
          </label>
          <select
            id="co2_emission_class"
            value={data.co2_emission_class || ''}
            onChange={(e) => onChange({ co2_emission_class: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.co2_emission_class ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select CO₂ emission class</option>
            {energyClasses.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
          {errors.co2_emission_class && (
            <p className="mt-1 text-sm text-red-500">{errors.co2_emission_class}</p>
          )}
        </div>
      </div>

      {/* Air Conditioning */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="has_air_conditioning"
          checked={data.has_air_conditioning || false}
          onChange={(e) => onChange({ has_air_conditioning: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="has_air_conditioning" className="ml-2 block text-sm text-gray-700">
          Air Conditioning
        </label>
      </div>
    </div>
  );
};

export default ApartmentFields;
