
export enum CaseStatus {
  NEW = 'NEW',
  ANALYZING = 'ANALYZING',
  REVIEW_NEEDED = 'REVIEW_NEEDED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  LOST_CONTACT = 'LOST_CONTACT',
  // Post-Acceptance Workflow
  INTAKE_PROCESSING = 'INTAKE_PROCESSING',
  INTAKE_PAUSED = 'INTAKE_PAUSED',
  INTAKE_COMPLETE = 'INTAKE_COMPLETE'
}

export type DocumentType = 'retainer' | 'crash_report' | 'medical_record' | 'authorization' | 'insurance_card' | 'photo' | 'email' | 'other';

export type PhotoCategory = 'drivers_license' | 'insurance_card' | 'client_pd' | 'defendant_pd' | 'injury_photo' | 'scene_photo' | 'other';

export type EmailCategory = 'offer' | 'counteroffer' | 'coverage_response' | 'liability_decision' | 'medical_records' | 'medical_bills' | 'policy_limits_response' | 'client_communication' | 'attorney_correspondence' | 'general';

export type TaskType = 'coverage_followup' | 'liability_followup' | 'policy_limits' | 'er_records' | 'er_bills' | 'medical_records' | 'demand_prep' | 'general';

export type TaskStatus = 'open' | 'completed' | 'overdue';

export type CoverageStatusType = 'pending' | 'accepted' | 'denied' | 'under_investigation';
export type LiabilityStatusType = 'pending' | 'accepted' | 'denied' | 'disputed';
export type PolicyLimitsStatusType = 'not_requested' | 'requested' | 'received' | 'na';
export type ERBillStatus = 'not_requested' | 'requested' | 'received' | 'na';
export type PreferredContactMethod = 'email' | 'fax' | 'mail' | 'phone';
export type SpecialsStatus = 'in_progress' | 'complete' | 'sent_to_attorney';

export const DOCUMENT_NAMING_RULES: Record<string, string> = {
  retainer: 'Retainer',
  crash_report: 'Crash Report',
  medical_record: 'Medical Record',
  authorization: 'Authorization for Release',
  insurance_card: 'Insurance Card',
  photo: 'Photo',
  email: 'Email',
  foia_request: 'FOIA Request',
  letter_of_representation: 'Letter of Representation',
  attorney_lien: 'Attorney Lien',
  bill_request: 'Bill Request',
  demand_letter: 'Demand Letter',
  distribution_sheet: 'Distribution Sheet',
  drivers_license: "Driver's License",
  client_pd_photo: 'Client PD Photo',
  defendant_pd_photo: 'Defendant PD Photo',
  mri_record: 'MRI Record',
  mri_bill: 'MRI Bill',
  er_facility_bill: 'ER Facility Bill',
  er_physician_bill: 'ER Physician Bill',
  er_radiology_bill: 'ER Radiology Bill',
  er_facility_record: 'ER Facility Record',
  specials_package: 'Specials Package',
  intake_form: 'Intake Form',
  preservation_of_evidence: 'Preservation of Evidence Request',
};

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  drivers_license: "Driver's License",
  insurance_card: 'Insurance Card',
  client_pd: 'Client Property Damage',
  defendant_pd: 'Defendant Property Damage',
  injury_photo: 'Injury Photo',
  scene_photo: 'Scene Photo',
  other: 'Other',
};

export const EMAIL_CATEGORY_LABELS: Record<EmailCategory, string> = {
  offer: 'Offer',
  counteroffer: 'Counteroffer',
  coverage_response: 'Coverage Response',
  liability_decision: 'Liability Decision',
  medical_records: 'Medical Records',
  medical_bills: 'Medical Bills',
  policy_limits_response: 'Policy Limits',
  client_communication: 'Client',
  attorney_correspondence: 'Attorney',
  general: 'General',
};

export interface DocumentAttachment {
  type: DocumentType;
  fileData: string | null;
  fileName: string;
  mimeType?: string;
  source?: string;
  tags?: string[];
  linkedFacilityId?: string;
  photoCategory?: PhotoCategory;
}

export type MedicalProviderType = 'hospital' | 'er' | 'urgent_care' | 'chiropractor' | 'physical_therapy' | 'orthopedic' | 'neurologist' | 'pain_management' | 'primary_care' | 'imaging' | 'surgery_center' | 'other';

export interface MedicalProvider {
  id: string;
  name: string;
  type: MedicalProviderType;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  fax?: string;
  email?: string;
  contactPerson?: string;
  totalCost?: number;
  notes?: string;
  dateOfFirstVisit?: string;
  dateOfLastVisit?: string;
  isCurrentlyTreating?: boolean;
  preferredContactMethod?: PreferredContactMethod;
}

export interface EmailAttachment {
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size: string;
}

export interface EmailMatchAnalysis {
  suggestedCaseId: string | null;
  confidenceScore: number;
  reasoning: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  direction: 'inbound' | 'outbound';
  threadId?: string;
  attachments: EmailAttachment[];
  linkedCaseId?: string;
  aiMatch?: EmailMatchAnalysis;
  category?: EmailCategory;
}

export interface CommunicationLog {
  id: string;
  type: 'call' | 'sms';
  direction: 'inbound' | 'outbound';
  contactName: string;
  contactPhone: string;
  timestamp: string;
  duration?: string;
  status?: 'completed' | 'missed' | 'voicemail' | 'sent' | 'received';
  content: string;
  transcript?: string;
  aiSummary?: string;
}

export interface ChatAttachment {
  name: string;
  type: 'image' | 'file';
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderInitials: string;
  isCurrentUser: boolean;
  message: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  channel?: 'intake' | 'medical';
}

export interface AIAnalysis {
  caseScore: number;
  liabilityAssessment: string;
  retainerValid: boolean;
  retainerNotes: string;
  summary: string;
  recommendedAction: 'ACCEPT' | 'REJECT' | 'INVESTIGATE';
  keyRiskFactors: string[];
}

export interface ActivityLog {
  id: string;
  type: 'system' | 'user' | 'note';
  message: string;
  timestamp: string;
  author?: string;
}

export interface Party {
  name: string;
  role: 'Defendant' | 'Witness' | 'Passenger';
  contact?: string;
}

export interface Insurance {
  type: 'Client' | 'Defendant' | 'Other';
  provider: string;
  policyNumber?: string;
  claimNumber?: string;
  adjuster?: string;
  coverageLimits?: string;
  isUninsured?: boolean;
  coverageStatus?: CoverageStatusType;
  liabilityStatus?: LiabilityStatusType;
  coverageFollowUpDate?: string;
  liabilityFollowUpDate?: string;
  coverageStatusDate?: string;
  liabilityStatusDate?: string;
  policyLimitsStatus?: PolicyLimitsStatusType;
  policyLimitsAmount?: string;
  policyLimitsRequestDate?: string;
  policyLimitsReceivedDate?: string;
}

export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  damage?: string;
}

export interface ClientDetails {
    full_name?: string;
    date_of_birth?: string;
    ssn?: string;
    address?: { street?: string; city?: string; state?: string; zip?: string };
    drivers_license?: { number?: string; state_issued?: string };
    phones?: { home?: string; cell?: string };
    email?: string;
    marital_status?: 'Married' | 'Single';
    emergency_contact?: { name?: string; phone?: string };
}

export interface ExtendedIntakeData {
  intake_admin?: {
    total_clients?: number;
    primary_language?: string;
    primary_language_other?: string;
    referral_source?: string;
    referral_source_other?: string;
    interview?: {
      date?: string;
      location?: 'Office' | 'Field';
      time?: string;
    };
  };
  accident?: {
    crash_report_number?: string;
    agency?: string;
    city?: string;
    county?: string;
    accident_location?: string;
    plaintiff_role?: string;
    date_of_loss?: string;
    day_of_week?: string;
    time_of_accident?: string;
    weather_conditions?: string;
    weather_conditions_other?: string;
    traffic_controls?: string[];
    traffic_controls_other?: string;
    main_intersections?: string;
    intersection_city?: string;
    plaintiff_direction?: string;
    defendant_direction?: string;
    nature_of_trip?: string;
    speed_limit?: number;
    accident_facts?: string;
  };
  client?: ClientDetails;
  additional_clients?: ClientDetails[];
  employment?: {
    time_lost_from_work?: boolean;
    how_much_time_lost?: string;
    position?: string;
    employer?: {
        name?: string;
        phone?: string;
        address?: { street?: string; city?: string; state?: string; zip?: string }
    };
    wages?: { amount?: number; per?: 'Hour' | 'Week' | 'Year' };
    hours_per_week?: number;
  };
  vehicle_property_damage?: {
    license_plate?: string;
    damaged_vehicle?: { year?: number; make?: string; model?: string; color?: string };
    vehicle_location_or_body_shop?: string;
    body_shop?: { name?: string; address?: string; phone?: string };
    vehicle_drivable?: boolean;
    pictures_taken?: boolean;
    pictures_taken_by_whom?: string;
    airbags_deployed?: boolean;
    seatbelt_worn?: boolean;
    property_damage_amount_or_estimate?: number;
    total_loss?: boolean;
    prior_accidents_within_last_10_years?: boolean;
    prior_accident_dates?: string[];
    injuries_summary?: string;
    at_fault?: boolean;
    claim_made?: boolean;
  };
  medical?: {
    injuries_detail?: string;
    ambulance?: boolean;
    xrays_taken?: boolean;
    hospital?: { name?: string; address?: string; phone?: string };
    pre_existing_conditions?: string;
    conditions_detail?: string;
    doctor_referred_to?: { name?: string; address?: string; phone?: string };
    providers?: Array<{ name: string; address?: string; phone?: string }>;
    um_uim_claim?: string;
  };
  auto_insurance?: {
    driver_or_passenger_insurance_company?: string;
    vehicle_owner_insurance_company?: string;
    claims_adjuster?: { name?: string; phone?: string; ext?: string };
    insured_name?: string;
    auto_insurance_type?: 'Personal' | 'Commercial';
    claim_number?: string;
    policy_number?: string;
    insured_policy_info?: string;
  };
  health_insurance?: {
    company?: string;
    insured_name?: string;
    ssn?: string;
    address?: { street?: string; city?: string; state?: string; zip?: string };
    phone?: string;
    group_number?: string;
    id_number?: string;
    member_number?: string;
  };
  first_party_insurance?: {
    company?: string;
    claim_number?: string;
    insured_name?: string;
    policy_number?: string;
    notes?: string;
    coverage_limits?: string;
  };
  defendant?: {
    name?: string;
    phone?: string;
    address?: { street?: string; city?: string; state?: string; zip?: string };
    drivers_license_number?: string;
    license_plate?: string;
    vehicle?: { year?: number; make?: string; model?: string; color?: string };
    insurance?: {
      company?: string;
      type?: 'Personal' | 'Commercial';
      claim_number?: string;
      policy_number?: string;
      claims_adjuster?: { name?: string; phone?: string; ext?: string };
      coverage_limits?: string;
    };
  };
  passengers_involved?: Array<{ name: string; phone?: string; notes?: string }>;
  notes?: string;
}

export interface CaseTask {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  dueDate: string;
  completedDate?: string;
  assignedTeam?: 'Team A' | 'Team B';
  recurrence?: 'one-time' | 'weekly' | 'monthly';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  autoGenerated?: boolean;
}

export interface ERBillLine {
  type: 'facility' | 'physician' | 'radiology';
  status: ERBillStatus;
  requestDate?: string;
  receivedDate?: string;
  followUpDate?: string;
  amount?: number;
  notes?: string;
}

export interface ERVisit {
  id: string;
  facilityName: string;
  facilityId?: string;
  visitDate: string;
  bills: ERBillLine[];
  recordStatus: ERBillStatus;
  recordRequestDate?: string;
  recordReceivedDate?: string;
  recordFollowUpDate?: string;
}

export interface SpecialsPackage {
  id: string;
  status: SpecialsStatus;
  items: SpecialsItem[];
  totalAmount: number;
  compiledDocumentIndex?: number;
  notes?: string;
  lastUpdated: string;
}

export interface SpecialsItem {
  providerName: string;
  providerId?: string;
  documentType: string;
  amount: number;
  included: boolean;
  documentIndex?: number;
}

export interface CaseFile {
  id: string;

  clientName: string;
  clientDob?: string;
  clientAddress?: string;
  clientEmail: string;
  clientPhone: string;

  accidentDate: string;
  location?: string;
  description: string;
  impact?: string;
  statuteOfLimitationsDate?: string;

  vehicleInfo?: VehicleInfo;

  parties?: Party[];
  insurance?: Insurance[];

  treatmentStatus?: string;
  treatmentProviders?: string;
  medicalProviders?: MedicalProvider[];

  status: CaseStatus;
  documents: DocumentAttachment[];
  aiAnalysis?: AIAnalysis;
  createdAt: string;
  referralSource: string;
  activityLog: ActivityLog[];

  actionDate?: string;
  assignedDate?: string;

  assignedTeam?: 'Team A' | 'Team B';
  cmsSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';

  extendedIntake?: ExtendedIntakeData;

  linkedEmails?: Email[];
  communications?: CommunicationLog[];

  chatHistory?: ChatMessage[];

  notes?: string;

  tasks?: CaseTask[];
  erVisits?: ERVisit[];
  mriCompleted?: boolean;
  mriCompletedDate?: string;
  treatmentEndDate?: string;
  specials?: SpecialsPackage;
}
