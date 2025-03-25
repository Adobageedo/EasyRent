import React from 'react';
import { heatingTypes, propertyConditions, energyClasses } from '../../validation/propertySchemas';

interface HomeFieldsProps {
  data: {
    num_rooms?: number;
    num_bedrooms?: number;
    num_bathrooms?: number;
    has_garden?: boolean;
    garden_area?: number;
    has_garage?: boolean;
    garage_capacity?: number;
    heating_type?: string;
    property_condition?: string;
    energy_class?: string;
    co2_emission_class?: string;
    has_swimming_pool?: boolean;
    has_terrace?: boolean;
    has_balcony?: boolean;
    has_basement?: boolean;
    has_air_conditioning?: boolean;
  };
  onChange: (data: Partial<HomeFieldsProps['data']>) => void;
  errors: Record<string, string>;
}

const HomeFields: React.FC<HomeFieldsProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Room Configuration */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
      </div>

      {/* Garden & Garage */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_garden"
              checked={data.has_garden || false}
              onChange={(e) => onChange({ has_garden: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="garden" className="ml-2 block text-sm text-gray-700">
              Garden
            </label>
          </div>
          {data.has_garden && (
            <div className="mt-2">
              <label htmlFor="garden_area" className="block text-sm font-medium text-gray-700">
                Garden Area (m²)
              </label>
              <input
                type="number"
                id="garden_area"
                min="1"
                value={data.garden_area || ''}
                onChange={(e) => onChange({ garden_area: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_garage"
              checked={data.has_garage || false}
              onChange={(e) => onChange({ has_garage: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="garage" className="ml-2 block text-sm text-gray-700">
              Garage
            </label>
          </div>
          {data.has_garage && (
            <div className="mt-2">
              <label htmlFor="garage_capacity" className="block text-sm font-medium text-gray-700">
                Garage Capacity
              </label>
              <input
                type="number"
                id="garage_capacity"
                min="1"
                value={data.garage_capacity || ''}
                onChange={(e) => onChange({ garage_capacity: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Heating & Condition */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="heatingType" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="propertyCondition" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="energyClass" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="co2EmissionClass" className="block text-sm font-medium text-gray-700">
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
          {errors.co2EmissionClass && (
            <p className="mt-1 text-sm text-red-500">{errors.co2EmissionClass}</p>
          )}
        </div>
      </div>

      {/* Additional Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Features</label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="swimmingPool"
              checked={data.has_swimming_pool || false}
              onChange={(e) => onChange({ has_swimming_pool: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="swimmingPool" className="ml-2 block text-sm text-gray-700">
              Swimming Pool
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terrace"
              checked={data.has_terrace || false}
              onChange={(e) => onChange({ has_terrace: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terrace" className="ml-2 block text-sm text-gray-700">
              Terrace
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="balcony"
              checked={data.has_balcony || false}
              onChange={(e) => onChange({ has_balcony: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="balcony" className="ml-2 block text-sm text-gray-700">
              Balcony
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="basement"
              checked={data.has_basement || false}
              onChange={(e) => onChange({ has_basement: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="basement" className="ml-2 block text-sm text-gray-700">
              Basement
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="airConditioning"
              checked={data.has_air_conditioning || false}
              onChange={(e) => onChange({ has_air_conditioning: e.target.checked })}
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

export default HomeFields;
