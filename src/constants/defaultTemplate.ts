// Define the variables that can be automatically replaced
// Variables available in database:
// - properties.name (PROPERTY_NAME)
// - tenants.first_name, tenants.last_name (TENANT_NAME)
// - tenants.email (TENANT_EMAIL)
// - tenants.phone (TENANT_PHONE)
// - rent_amount (RENT_AMOUNT)
// - deposit_amount (DEPOSIT_AMOUNT)
// - payment_due_date (PAYMENT_DUE_DATE)
// - start_date (START_DATE)
// - end_date (END_DATE)

// Variables that need manual input:
// - LANDLORD_NAME
// - LANDLORD_ADDRESS
// - LANDLORD_PHONE
// - LANDLORD_EMAIL
// - TENANT_ADDRESS
// - PET_DEPOSIT
// - PET_RESTRICTIONS

export const CONTRACT_VARIABLES = {
  PROPERTY_NAME: 'properties.name',
  TENANT_NAME: 'tenants.first_name + tenants.last_name',
  TENANT_EMAIL: 'tenants.email',
  TENANT_PHONE: 'tenants.phone',
  RENT_AMOUNT: 'rent_amount',
  DEPOSIT_AMOUNT: 'deposit_amount',
  START_DATE: 'start_date',
  END_DATE: 'end_date',
  PAYMENT_DUE_DATE: 'payment_due_date',
} as const;

export const DEFAULT_LEASE_TEMPLATE = `LEASE AGREEMENT

This Lease Agreement ("Agreement") is made and entered into on this {CURRENT_DATE}, by and between:

Landlord: {LANDLORD_NAME}
Address: {LANDLORD_ADDRESS}
Phone: {LANDLORD_PHONE}
Email: {LANDLORD_EMAIL}

AND

Tenant: {TENANT_NAME}
Address: {TENANT_ADDRESS}
Phone: {TENANT_PHONE}
Email: {TENANT_EMAIL}

1. PROPERTY DESCRIPTION
The Landlord hereby leases to the Tenant the property:
{PROPERTY_NAME} ("Premises").

2. TERM
The lease term is defined as follows:
[_] Month-to-month agreement
[_] Fixed term lease from {START_DATE} to {END_DATE}

3. RENT
The Tenant agrees to pay a monthly rent of €{RENT_AMOUNT} payable on the {PAYMENT_DUE_DATE}th day of each month to the Landlord via:
[_] Bank transfer
[_] Check
[_] Other: _______________

4. SECURITY DEPOSIT
The Tenant shall pay a security deposit of €{DEPOSIT_AMOUNT} upon signing this Agreement. The deposit shall be held to cover damages beyond normal wear and tear and shall be refunded within 30 days after lease termination, minus any deductions.

5. UTILITIES AND SERVICES
The responsibility for utilities and services is as follows:
[_] Landlord [_] Tenant - Electricity
[_] Landlord [_] Tenant - Water/Sewer
[_] Landlord [_] Tenant - Gas
[_] Landlord [_] Tenant - Internet/TV
[_] Landlord [_] Tenant - Garbage Collection

6. USE OF PROPERTY
The Tenant shall use the Premises solely for residential purposes and agrees to abide by all laws, regulations, and community rules.

7. MAINTENANCE AND REPAIRS
The Tenant shall maintain the Premises in good condition and promptly notify the Landlord of any needed repairs. The Landlord is responsible for major repairs except those caused by the Tenant's negligence.

8. PET POLICY
[_] Pets are not allowed.
[_] Pets are allowed with a non-refundable pet deposit of €{PET_DEPOSIT} and the following restrictions: {PET_RESTRICTIONS}

9. TERMINATION AND NOTICE
Either party may terminate this Agreement by providing 30 days' written notice. If the Tenant vacates before the lease term ends, they may be responsible for remaining rent unless a replacement is found.

10. DEFAULT AND EVICTION
The Landlord may terminate this lease and initiate eviction proceedings if the Tenant:
- Fails to pay rent within 5 days of the due date
- Causes damage to the property
- Engages in illegal activities

11. GOVERNING LAW
This Agreement shall be governed by the laws of Italy.

SIGNATURES

Landlord:
Signature: ________________________
Date: {CURRENT_DATE}

Tenant:
Signature: ________________________
Date: {CURRENT_DATE}
`;
