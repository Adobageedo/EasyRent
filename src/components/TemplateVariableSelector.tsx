import React from 'react';

export const TEMPLATE_VARIABLES = {
  TENANT: {
    FULL_NAME: '[Tenant\'s Full Name]',
    PHONE: '[Tenant\'s Phone]',
  },
  LANDLORD: {
    FULL_NAME: '[Landlord\'s Full Name]',
    PHONE: '[Landlord\'s Phone]',
    COMPANY: '[Landlord\'s Company]',
  },
  PROPERTY: {
    NAME: '[Property Name]',
    ADDRESS: '[Property Address]',
    UNIT: '[Property Unit]',
    TYPE: '[Property Type]',
  },
  LEASE: {
    START_DATE: '[Lease Start Date]',
    END_DATE: '[Lease End Date]',
    RENT_AMOUNT: '[Monthly Rent Amount]',
    DEPOSIT_AMOUNT: '[Security Deposit Amount]',
    PAYMENT_DUE_DATE: '[Rent Payment Due Date]',
  },
  UTILITIES: {
    INCLUDED: '[Included Utilities]',
    TENANT_RESPONSIBLE: '[Tenant Responsible Utilities]',
  },
};

interface TemplateVariableSelectorProps {
  onSelect: (variable: string) => void;
}

export default function TemplateVariableSelector({ onSelect }: TemplateVariableSelectorProps) {
  return (
    <div className="relative inline-block">
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        defaultValue=""
      >
        <option value="" disabled>Insert Variable...</option>
        {Object.entries(TEMPLATE_VARIABLES).map(([category, variables]) => (
          <optgroup key={category} label={category.replace(/_/g, ' ')}>
            {Object.entries(variables).map(([key, value]) => (
              <option key={`${category}_${key}`} value={value}>
                {key.replace(/_/g, ' ')}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
