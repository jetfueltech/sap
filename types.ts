
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

export interface DocumentAttachment {
  type: DocumentType;
  fileData: string | null; // Base64 string
  fileName: string;
  mimeType?: string;
  source?: string; // e.g. "Client Portal", "Email", "Scanner"
  tags?: string[]; // Custom user-defined tags
  linkedFacilityId?: string;
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
  contactPerson?: string;
  totalCost?: number;
  notes?: string;
  dateOfFirstVisit?: string;
  dateOfLastVisit?: string;
  isCurrentlyTreating?: boolean;
}

export interface EmailAttachment {
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size: string;
}

export interface EmailMatchAnalysis {
  suggestedCaseId: string | null;
  confidenceScore: number; // 0-100
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
  direction: 'inbound' | 'outbound'; // Added direction
  threadId?: string; // Added threadId for grouping
  attachments: EmailAttachment[];
  linkedCaseId?: string; // If already linked
  aiMatch?: EmailMatchAnalysis; // Result of AI analysis
}

export interface CommunicationLog {
  id: string;
  type: 'call' | 'sms';
  direction: 'inbound' | 'outbound';
  contactName: string;
  contactPhone: string;
  timestamp: string;
  duration?: string; // For calls (e.g., "4m 12s")
  status?: 'completed' | 'missed' | 'voicemail' | 'sent' | 'received'; 
  content: string; // Call notes or SMS body
  transcript?: string; // Full text transcript of the call
  aiSummary?: string; // AI generated summary of the transcript
}

export interface ChatAttachment {
  name: string;
  type: 'image' | 'file';
  url?: string; // Base64 or URL
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderInitials: string;
  isCurrentUser: boolean;
  message: string;
  timestamp: string;
  attachments?: ChatAttachment[];
}

export interface AIAnalysis {
  caseScore: number; // 1-10
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
  coverageLimits?: string; // e.g. "100/300/50"
  isUninsured?: boolean;
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

// Detailed Intake Schema (Exhibit B)
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
    accident_location?: string; // Street/Intersection
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
  additional_clients?: ClientDetails[]; // Support for multiple clients
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
    prior_accident_dates?: string[]; // strings for simplicity
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
  // New Insurance / Defendant sections
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

export interface CaseFile {
  id: string;
  
  // Demographics (Quick View)
  clientName: string;
  clientDob?: string;
  clientAddress?: string;
  clientEmail: string;
  clientPhone: string;
  
  // Incident (Quick View)
  accidentDate: string;
  location?: string;
  description: string; // Facts of loss
  impact?: string; // New field for impact summary e.g. "High PD - HP"
  statuteOfLimitationsDate?: string; // Deadline date based on date of loss
  
  // Auto Specific (Quick View)
  vehicleInfo?: VehicleInfo;
  
  // Parties & Insurance (Quick View)
  parties?: Party[];
  insurance?: Insurance[];
  
  // Medical (Quick View)
  treatmentStatus?: string;
  treatmentProviders?: string;
  medicalProviders?: MedicalProvider[];

  // System
  status: CaseStatus;
  documents: DocumentAttachment[];
  aiAnalysis?: AIAnalysis;
  createdAt: string;
  referralSource: string;
  activityLog: ActivityLog[];
  
  // Tracking Dates
  actionDate?: string; // Date accepted/rejected
  assignedDate?: string; // Date team assigned
  
  // Workflow
  assignedTeam?: 'Team A' | 'Team B';
  cmsSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';

  // Extended Data (Post-Acceptance)
  extendedIntake?: ExtendedIntakeData;

  // Communication
  linkedEmails?: Email[];
  communications?: CommunicationLog[]; // Calls and SMS from RingCentral
  
  // Internal Chat
  chatHistory?: ChatMessage[];

  // Team Notes
  notes?: string;
}
