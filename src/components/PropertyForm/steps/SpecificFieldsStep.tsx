import React from 'react';
import { PropertyType } from '../PropertyForm';
import { z } from 'zod';
import {
  homeSchema,
  apartmentSchema,
  garageSchema,
  landSchema,
  otherSchema,
} from '../validation/propertySchemas';
import HomeFields from './fields/HomeFields';
import ApartmentFields from './fields/ApartmentFields';
import GarageFields from './fields/GarageFields';
import LandFields from './fields/LandFields';
import OtherFields from './fields/OtherFields';

interface SpecificFieldsStepProps {
  type: PropertyType;
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SpecificFieldsStep: React.FC<SpecificFieldsStepProps> = ({
  type,
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateFields = () => {
    try {
      // Add default values for boolean fields based on property type
      const defaultedFormData = { ...formData };
      switch (type) {
        case 'home':
          ['garden', 'garage', 'swimmingPool', 'terrace', 'balcony', 'basement', 'airConditioning'].forEach(field => {
            if (defaultedFormData[field] === undefined) defaultedFormData[field] = false;
          });
          homeSchema.parse(defaultedFormData);
          break;
        case 'apartment':
          ['wheelchairAccess', 'elevator', 'storage', 'balcony', 'terrace', 'garage', 'airConditioning'].forEach(field => {
            if (defaultedFormData[field] === undefined) defaultedFormData[field] = false;
          });
          apartmentSchema.parse(defaultedFormData);
          break;
        case 'garage':
          ['interiorLighting', 'electricalOutlet', 'waterSupply', 'securityCamera', 'automaticDoor'].forEach(field => {
            if (defaultedFormData[field] === undefined) defaultedFormData[field] = false;
          });
          garageSchema.parse(defaultedFormData);
          break;
        case 'land':
          ['buildable', 'serviced', 'waterService', 'electricityService', 'gasService', 'sewerService', 'internetService'].forEach(field => {
            if (defaultedFormData[field] === undefined) defaultedFormData[field] = false;
          });
          landSchema.parse(defaultedFormData);
          break;
        case 'other':
          ['parking', 'loadingDock', 'securitySystem', 'fireSafety', 'airConditioning'].forEach(field => {
            if (defaultedFormData[field] === undefined) defaultedFormData[field] = false;
          });
          otherSchema.parse(defaultedFormData);
          break;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        console.error('Validation errors:', newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateFields()) {
      onNext();
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'home':
        return (
          <HomeFields
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 'apartment':
        return (
          <ApartmentFields
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 'garage':
        return (
          <GarageFields
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 'land':
        return (
          <LandFields
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 'other':
        return (
          <OtherFields
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        {renderFields()}
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
          onClick={handleNext}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default SpecificFieldsStep;
