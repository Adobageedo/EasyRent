import React, { useState } from 'react';
import { Building2, Home, Car, Trees, HelpCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import PropertyTypeStep from './steps/PropertyTypeStep';
import GeneralInfoStep from './steps/GeneralInfoStep';
import SpecificFieldsStep from './steps/SpecificFieldsStep';
import ReviewStep from './steps/ReviewStep';

export type PropertyType = 'home' | 'apartment' | 'garage' | 'land' | 'other';

interface PropertyFormProps {
  onSuccess?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '' as PropertyType,
    title: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: '',
    },
    totalArea: 0,
    rentAmount: 0,
    description: '',
    photos: [] as File[],
    specificFields: {} as Record<string, any>,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check if bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'property-photos');
      console.log('Bucket exists:', bucketExists);
      console.log('formData:', formData);


      if (!bucketExists) {
        console.log('Bucket does not exist. Attempting to create it...');
      
        const { error: createBucketError } = await supabase.storage.createBucket('property-photos', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/jpeg', 'image/png']
        });
      
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          throw new Error(`Failed to create bucket: ${createBucketError.message}`);
        }
      
        console.log('Bucket created successfully!');
      }      
      console.log('Postal code:', formData.address.postalCode);

      // Upload photos to storage
      const photoUrls = await Promise.all(
        formData.photos.map(async (photo) => {
          try {
            const fileName = `${user.id}/${Date.now()}-${photo.name}`;
            const { data, error } = await supabase.storage
              .from('property-photos')
              .upload(fileName, photo, {
                cacheControl: '3600',
                upsert: false
              });
            
            if (error) throw error;
            
            const { data: urlData } = supabase.storage
              .from('property-photos')
              .getPublicUrl(data.path);
              
            return urlData.publicUrl;
          } catch (error) {
            console.error('Error uploading photo:', error);
            throw new Error(`Failed to upload photo ${photo.name}: ${error.message}`);
          }
        })
      );

      // Map form data to database schema
      const propertyData = {
        user_id: user.id,
        property_type: formData.type,
        title: formData.title,
        address: formData.address,
        postal_code: formData.address.postalCode,
        city: formData.address.city,
        country: formData.address.country,
        total_area: formData.totalArea,
        rent_amount: formData.rentAmount,
        description: formData.description,
        photos: photoUrls,
      };

      // Add type-specific fields
      if (formData.type === 'home' || formData.type === 'apartment') {
        Object.assign(propertyData, {
          num_rooms: formData.specificFields.num_rooms,
          num_bedrooms: formData.specificFields.num_bedrooms,
          num_bathrooms: formData.specificFields.num_bathrooms,
          heating_type: formData.specificFields.heating_type,
          property_condition: formData.specificFields.property_condition,
          energy_class: formData.specificFields.energy_class,
          co2_emission_class: formData.specificFields.co2_emission_class,
          has_garage: formData.specificFields.has_garage,
          garage_capacity: formData.specificFields.garage_capacity,
          garage_size: formData.specificFields.garage_size,
        });
      }

      if (formData.type === 'home') {
        Object.assign(propertyData, {
          has_garden: formData.specificFields.has_garden,
          garden_area: formData.specificFields.garden_area,
          has_swimming_pool: formData.specificFields.has_swimming_pool,
          has_terrace: formData.specificFields.has_terrace,
          has_balcony: formData.specificFields.has_balcony,
          has_basement: formData.specificFields.has_basement,
          has_air_conditioning: formData.specificFields.has_air_conditioning,
        });
      }

      if (formData.type === 'apartment') {
        Object.assign(propertyData, {
          floor_number: formData.specificFields.floor_number,
          wheelchair_accessible: formData.specificFields.wheelchair_accessible,
          has_elevator: formData.specificFields.has_elevator,
          has_storage_room: formData.specificFields.has_storage_room,
          has_balcony: formData.specificFields.has_balcony,
          balcony_size: formData.specificFields.balcony_size,
          has_terrace: formData.specificFields.has_terrace,
          terrace_size: formData.specificFields.terrace_size,
          has_garage: formData.specificFields.has_garage,
          garage_size: formData.specificFields.garage_size,
          has_air_conditioning: formData.specificFields.has_air_conditioning,
        });
      }

      if (formData.type === 'garage') {
        Object.assign(propertyData, {
          garage_type: formData.specificFields.garageType,
          secure_access: formData.specificFields.secureAccessType,
          has_interior_lighting: formData.specificFields.interiorLighting,
          has_electrical_outlet: formData.specificFields.electricalOutlet,
        });
      }

      if (formData.type === 'land') {
        Object.assign(propertyData, {
          is_buildable: formData.specificFields.buildable,
          is_serviced: formData.specificFields.serviced,
          available_services: [
            formData.specificFields.waterService && 'water',
            formData.specificFields.electricityService && 'electricity',
            formData.specificFields.gasService && 'gas',
            formData.specificFields.sewerService && 'sewer',
          ].filter(Boolean),
          soil_type: formData.specificFields.soilType,
          is_fenced: formData.specificFields.fenced,
          has_vehicle_access: formData.specificFields.vehicleAccess,
        });
      }

      if (formData.type === 'other') {
        Object.assign(propertyData, {
          other_type_description: formData.specificFields.typeDescription,
          specific_description: formData.specificFields.propertyDetails,
        });
      }

      // Save property data
      const { error: insertError } = await supabase.from('properties').insert(propertyData);

      if (insertError) throw insertError;
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      setErrors({ 
        submit: `Failed to submit property: ${error.message || 'Please try again.'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyTypeStep
            selectedType={formData.type}
            onTypeSelect={(type) => updateFormData({ type })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <GeneralInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <SpecificFieldsStep
            type={formData.type}
            formData={formData.specificFields}
            updateFormData={(newFields) => updateFormData({
              specificFields: { ...formData.specificFields, ...newFields }
            })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            error={errors.submit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 4
          </div>
        </div>
        <div className="mt-4 bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default PropertyForm;
