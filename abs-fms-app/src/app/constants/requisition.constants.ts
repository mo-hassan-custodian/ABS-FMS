export const BANK_BRANCHES = [
  { name: 'Head Office - Victoria Island', value: 'HO_VI', bankName: 'Custodian Bank' },
  { name: 'Lagos Branch - Ikeja', value: 'LAG_IKJ', bankName: 'Custodian Bank' },
  { name: 'Abuja Branch - Wuse II', value: 'ABJ_WUS', bankName: 'Custodian Bank' },
  { name: 'Port Harcourt Branch - GRA', value: 'PHC_GRA', bankName: 'Custodian Bank' },
  { name: 'Kano Branch - Sabon Gari', value: 'KAN_SGB', bankName: 'Custodian Bank' },
  { name: 'Ibadan Branch - Bodija', value: 'IBD_BOD', bankName: 'Custodian Bank' },
  { name: 'Kaduna Branch - Barnawa', value: 'KAD_BAR', bankName: 'Custodian Bank' },
  { name: 'Benin Branch - Ring Road', value: 'BEN_RNG', bankName: 'Custodian Bank' },
  { name: 'Enugu Branch - Independence Layout', value: 'ENU_IND', bankName: 'Custodian Bank' },
  { name: 'Calabar Branch - Marian Road', value: 'CAL_MAR', bankName: 'Custodian Bank' }
];

export const CURRENCIES = [
  { name: 'Nigerian Naira', value: 'NGN', symbol: '₦' },
  { name: 'US Dollar', value: 'USD', symbol: '$' },
  { name: 'British Pound Sterling', value: 'GBP', symbol: '£' },
  { name: 'Euro', value: 'EUR', symbol: '€' },
  { name: 'South African Rand', value: 'ZAR', symbol: 'R' },
  { name: 'Ghanaian Cedi', value: 'GHS', symbol: '₵' },
  { name: 'Kenyan Shilling', value: 'KES', symbol: 'KSh' },
  { name: 'Canadian Dollar', value: 'CAD', symbol: 'C$' },
  { name: 'Australian Dollar', value: 'AUD', symbol: 'A$' },
  { name: 'Japanese Yen', value: 'JPY', symbol: '¥' },
  { name: 'Swiss Franc', value: 'CHF', symbol: 'CHF' },
  { name: 'Chinese Yuan', value: 'CNY', symbol: '¥' }
];

export const BANK_ACCOUNTS = [
  { name: 'Main Operating Account - 0123456789 (Current)', value: '0123456789' },
  { name: 'Petty Cash Account - 0987654321 (Savings)', value: '0987654321' },
  { name: 'Investment Account - 1122334455 (Investment)', value: '1122334455' },
  { name: 'Claims Settlement Account - 2233445566 (Current)', value: '2233445566' },
  { name: 'Premium Collection Account - 3344556677 (Current)', value: '3344556677' },
  { name: 'Commission Account - 4455667788 (Current)', value: '4455667788' },
  { name: 'Reinsurance Account - 5566778899 (Current)', value: '5566778899' },
  { name: 'Staff Welfare Account - 6677889900 (Savings)', value: '6677889900' },
  { name: 'Training & Development Account - 7788990011 (Savings)', value: '7788990011' },
  { name: 'Emergency Fund Account - 8899001122 (Savings)', value: '8899001122' }
];

export const PAYEE_TYPES = [
  { name: 'Individual Client', value: 'INDIVIDUAL_CLIENT' },
  { name: 'Corporate Client', value: 'CORPORATE_CLIENT' },
  { name: 'Insurance Broker', value: 'INSURANCE_BROKER' },
  { name: 'Reinsurance Company', value: 'REINSURANCE_COMPANY' },
  { name: 'Medical Provider', value: 'MEDICAL_PROVIDER' },
  { name: 'Legal Service Provider', value: 'LEGAL_SERVICE' },
  { name: 'Claims Adjuster', value: 'CLAIMS_ADJUSTER' },
  { name: 'Government Agency', value: 'GOVERNMENT_AGENCY' },
  { name: 'Vendor/Supplier', value: 'VENDOR_SUPPLIER' },
  { name: 'Contractor', value: 'CONTRACTOR' },
  { name: 'Consultant', value: 'CONSULTANT' },
  { name: 'Employee', value: 'EMPLOYEE' },
  { name: 'Agent/Representative', value: 'AGENT_REPRESENTATIVE' },
  { name: 'Financial Institution', value: 'FINANCIAL_INSTITUTION' },
  { name: 'Regulatory Body', value: 'REGULATORY_BODY' }
];

export const CREATED_FROM_OPTIONS = [
  { name: 'Manual Entry', value: 'MANUAL' },
  { name: 'System Import', value: 'IMPORT' },
  { name: 'System Generated', value: 'SYSTEM' },
  { name: 'External API', value: 'API' },
  { name: 'Bulk Upload', value: 'BULK' }
];

export const PAYMENT_OPTIONS = [
  { name: 'Electronic Fund Transfer (EFT)', value: 'EFT' },
  { name: 'Real Time Gross Settlement (RTGS)', value: 'RTGS' },
  { name: 'Automated Clearing House (ACH)', value: 'ACH' },
  { name: 'Bank Draft', value: 'BANK_DRAFT' },
  { name: 'Certified Cheque', value: 'CERTIFIED_CHEQUE' },
  { name: 'Company Cheque', value: 'COMPANY_CHEQUE' },
  { name: 'Cash Payment', value: 'CASH' },
  { name: 'Mobile Money Transfer', value: 'MOBILE_MONEY' },
  { name: 'Online Banking Transfer', value: 'ONLINE_BANKING' },
  { name: 'Standing Order', value: 'STANDING_ORDER' },
  { name: 'Direct Debit', value: 'DIRECT_DEBIT' },
  { name: 'Wire Transfer', value: 'WIRE_TRANSFER' }
];
