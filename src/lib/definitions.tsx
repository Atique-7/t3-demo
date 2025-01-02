export interface Car {
  carNumber: string;
  carMake: string;
  carModel: string;
  location: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  allJobCards: string[];
  carsTableId: string;
}

export interface Part {
  partName: string;
  partNumber: string;
  hsn: string;
  category: string;
  mrp: number;
  gst: number;
  cgst: number;
  sgst: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

// Define the structure for the JobCard object
export interface JobCard {
  serviceAdvisorID: any;
  carId: string;
  diagnosis: string[];
  sendToPartsManager: boolean;
  carNumber: string;
  jobCardStatus: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  parts: string[];
  labour: string[];
  observationRemarks: string;
  partsTotalPreTax: number;
  partsTotalPostTax: number;
  labourTotalPreTax: number;
  labourTotalPostTax: number;
  gatePassPDF: string;
  subTotal: number;
  totalDiscountAmt: number;
  amount: number;
  jobCardNumber: number;
  insuranceDetails: string;
  purposeOfVisit: string;
  totalTax?: number;
  gstin?: string;
  placeOfSupply?: string;
  // invoiceDate?: string;
  totalRoundedOffAmount: number;
  roundOffValue: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
  taxes: any[];
}

export type CurrentPart = {
  partId: string;
  partName: string;
  partNumber: string;
  mrp: number;
  gst: number;
  hsn: string;
  cgst: number;
  sgst: number;
  quantity: number;
  subTotal: number;
  cgstAmt: number;
  sgstAmt: number;
  totalTax: number;
  amount: number;
  discountPercentage?: number;
  discountAmt?: number;
  insurancePercentage?: number;
  insuranceAmt?: number;
  customerAmt?: number;
  amountCust?: number;
  subTotalCust?: number;
  cgstAmtCust?: number;
  sgstAmtCust?: number;
  discountAmtCust?: number;
  totalTaxCust?: number;
  amountIns?: number;
  subTotalIns?: number;
  cgstAmtIns?: number;
  sgstAmtIns?: number;
  totalTaxIns?: number;
  discountAmtIns?: number;
};

export interface Labour {
  labourName: string;
  labourCode: string;
  hsn: string;
  category: string;
  mrp: number;
  gst: number;
  cgst: number;
  sgst: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

export type CurrentLabour = {
  labourId: string;
  labourName: string;
  labourCode: string;
  mrp: number;
  hsn: string;
  gst: number;
  cgst: number;
  sgst: number;
  quantity: number;
  subTotal: number;
  cgstAmt: number;
  sgstAmt: number;
  totalTax: number;
  amount: number;
  discountPercentage?: number;
  discountAmt?: number;
  insurancePercentage?: number;
  insuranceAmt?: number;
  customerAmt?: number;
  amountCust?: number;
  subTotalCust?: number;
  cgstAmtCust?: number;
  sgstAmtCust?: number;
  totalTaxCust?: number;
  discountAmtCust?: number;
  amountIns?: number;
  subTotalIns?: number;
  cgstAmtIns?: number;
  sgstAmtIns?: number;
  totalTaxIns?: number;
  discountAmtIns?: number;
};

export type TempCar = {
  carNumber: string;
  carMake: string;
  carModel: string;
  location: string;
  purposeOfVisitAndAdvisors: string[];
  jobCardId: null | string;
  allJobCardIds: string[];
  carStatus: number;
  carsTableId: null | string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
};

export type ImageObj = {
  imageType: string;
  thumbnailURL: string;
  imageURL: string;
};

export type Target = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  identifier: string;
};

export type UserType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, unknown>;
  targets: Target[];
  accessedAt: string;
};

export interface Invoice {
  invoiceUrl: string;
  jobCardId: string;
  carNumber: string;
  invoiceType: string;
  invoiceNumber: number;
  isInsuranceInvoice: boolean;
  insuranceInvoiceType: string;
  invoiceDate?: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Assuming it's an array of strings, adjust if different
  $databaseId: string;
  $collectionId: string;
  jobCardDetails?: JobCard;
}

export interface TaxObj {
  taxType: string;
  taxRate: number;
  taxName: string;
  taxAmt: number;
}

export interface InputPart {
  partName: string;
  partNumber: string;
  hsn: string;
  category: string;
  mrp: number;
  gst: number;
  cgst: number;
  sgst: number;
}
