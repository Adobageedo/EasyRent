import React from 'react';
import { Home, Building2, Car, Trees, HelpCircle } from 'lucide-react';
import { PropertyType } from '../PropertyForm';

interface PropertyTypeStepProps {
  selectedType: PropertyType | '';
  onTypeSelect: (type: PropertyType) => void;
  onNext: () => void;
}

const propertyTypes = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'apartment', icon: Building2, label: 'Apartment' },
  { id: 'garage', icon: Car, label: 'Garage' },
  { id: 'land', icon: Trees, label: 'Land' },
  { id: 'other', icon: HelpCircle, label: 'Other' },
] as const;

const PropertyTypeStep: React.FC<PropertyTypeStepProps> = ({
  selectedType,
  onTypeSelect,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {propertyTypes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTypeSelect(id as PropertyType)}
            className={`relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200 ${
              selectedType === id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Icon
              className={`h-8 w-8 mb-2 ${
                selectedType === id ? 'text-blue-600' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-lg font-medium ${
                selectedType === id ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedType}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            selectedType
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default PropertyTypeStep;
