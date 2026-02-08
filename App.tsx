
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CaseDetail } from './components/CaseDetail';
import { NewIntakePage } from './components/NewIntakePage';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Inbox } from './components/Inbox';
import { CaseFile, CaseStatus, Email, DocumentAttachment } from './types';
import { classifyAttachmentType } from './services/geminiService';

// Initial Mock Emails moved from Inbox to App for persistence
const MOCK_EMAILS: Email[] = [
  {
    id: 'e101',
    from: 'State Farm Claims',
    fromEmail: 'claims@statefarm.com',
    subject: 'Claim SF-889922 - Liability Status - Michael Chen',
    body: 'We have completed our review of the intersection footage. Our insured driver, Susan Miller, has accepted 100% liability for the accident on 11/05/2023.',
    date: '10:45 AM',
    isRead: false,
    direction: 'inbound',
    threadId: 'th-sf-101',
    attachments: [
        { name: 'Liability_Decision_Ltr.pdf', type: 'pdf', size: '145 KB' }
    ]
  },
  {
    id: 'e202',
    from: 'Law Offices of Peter Smith',
    fromEmail: 'psmith@defenselaw.com',
    subject: 'Johnson v. Davis - Answer to Complaint',
    body: 'Please see the attached Answer and Affirmative Defenses filed on behalf of Defendant Robert Davis today.',
    date: 'Yesterday',
    isRead: true,
    direction: 'inbound',
    threadId: 'th-legal-202',
    attachments: [{ name: 'Def_Answer.pdf', type: 'pdf', size: '1.2 MB' }]
  },
  {
    id: 'e103',
    from: 'Michael Chen',
    fromEmail: 'm.chen@email.com',
    subject: 'Dashcam Video',
    body: 'I was able to download the dashcam footage from my car. It clearly shows the green light. The file was too big to email so here is a link, but I also attached a screenshot.',
    date: 'Nov 06',
    isRead: true,
    direction: 'inbound',
    threadId: 'th-dashcam-103',
    attachments: [
        { name: 'Dashcam_Frame_01.jpg', type: 'image', size: '3.2 MB' }
    ]
  },
  {
    id: 'e204',
    from: 'Unknown Sender',
    fromEmail: 'injured_driver@gmail.com',
    subject: 'Car accident question',
    body: 'Hi, I was rear ended yesterday at a red light. The other driver has insurance but they are being difficult. Do you give free consultations?',
    date: 'Nov 12',
    isRead: true,
    direction: 'inbound',
    threadId: 'th-inquiry-204',
    attachments: [{ name: 'car_damage.jpg', type: 'image', size: '2.1 MB' }]
  }
];

// Additional mock cases to populate the dashboard
const ADDITIONAL_CASES: CaseFile[] = [
    {
        id: 'case-401', clientName: 'Sarah Connor', accidentDate: '2023-11-20', location: 'Residential Neighborhood',
        description: 'Client was walking dog when neighbor\'s Pitbull escaped yard and attacked. Deep lacerations to forearm.',
        impact: 'Dog Bite - Scarring', status: CaseStatus.REVIEW_NEEDED, assignedTeam: 'Team A',
        referralSource: 'Google Ads', clientEmail: 's.connor@example.com', clientPhone: '(310) 555-0001',
        documents: [], activityLog: [], createdAt: '2023-11-21'
    },
    {
        id: 'case-402', clientName: 'John Rambo', accidentDate: '2023-10-30', location: 'State Highway 1',
        description: 'Motorcycle accident. Defendant made illegal U-turn. Client laid bike down. Road rash and broken clavicle.',
        impact: 'Motorcycle - Fracture', status: CaseStatus.INTAKE_PROCESSING, assignedTeam: 'Team B',
        referralSource: 'Social Media', clientEmail: 'j.rambo@example.com', clientPhone: '(310) 555-0002',
        documents: [], activityLog: [], createdAt: '2023-11-01'
    },
    {
        id: 'case-403', clientName: 'Ellen Ripley', accidentDate: '2023-12-01', location: 'Grocery Store Aisle 4',
        description: 'Slip and fall on spilled laundry detergent. No wet floor sign. Client injured lower back and hip.',
        impact: 'Premises - Soft Tissue', status: CaseStatus.ACCEPTED, assignedTeam: 'Team A',
        referralSource: 'Referrals', clientEmail: 'e.ripley@example.com', clientPhone: '(310) 555-0003',
        documents: [], activityLog: [], createdAt: '2023-12-02'
    },
    {
        id: 'case-404', clientName: 'Marty McFly', accidentDate: '2023-12-15', location: 'Hill Valley Intersection',
        description: 'Rear-ended at stop sign. Low speed impact but client reports neck pain.',
        impact: 'Low PD - Whiplash', status: CaseStatus.NEW,
        referralSource: 'Organic Web', clientEmail: 'm.mcfly@example.com', clientPhone: '(310) 555-0004',
        documents: [], activityLog: [], createdAt: '2023-12-16'
    },
    {
        id: 'case-405', clientName: 'Bruce Wayne', accidentDate: '2023-09-15', location: 'Gotham City Bridge',
        description: 'Minor fender bender. Client works night shift, says neck hurts slightly.',
        impact: 'Low PD', status: CaseStatus.REJECTED,
        referralSource: 'Billboards', clientEmail: 'b.wayne@example.com', clientPhone: '(310) 555-0005',
        documents: [], activityLog: [], createdAt: '2023-09-16'
    },
    {
        id: 'case-406', clientName: 'Tony Stark', accidentDate: '2023-11-11', location: 'Downtown',
        description: 'Defective product. E-scooter battery malfunctioned causing burns.',
        impact: 'Product Liability', status: CaseStatus.ANALYZING,
        referralSource: 'Google Ads', clientEmail: 't.stark@example.com', clientPhone: '(310) 555-0006',
        documents: [], activityLog: [], createdAt: '2023-11-12'
    },
    {
        id: 'case-407', clientName: 'Peter Parker', accidentDate: '2023-08-20', location: 'Crosswalk on Queens Blvd',
        description: 'Pedestrian struck by delivery van while in crosswalk. Broken leg.',
        impact: 'Pedestrian - Fracture', status: CaseStatus.INTAKE_COMPLETE, assignedTeam: 'Team B',
        referralSource: 'Social Media', clientEmail: 'p.parker@example.com', clientPhone: '(310) 555-0007',
        documents: [], activityLog: [], createdAt: '2023-08-21'
    },
    {
        id: 'case-408', clientName: 'Clark Kent', accidentDate: '2023-11-01', location: 'Bike Lane',
        description: 'Cyclist doored by parked car. Concussion and wrist sprain.',
        impact: 'Bicycle - Head Injury', status: CaseStatus.LOST_CONTACT,
        referralSource: 'Organic Web', clientEmail: 'c.kent@example.com', clientPhone: '(310) 555-0008',
        documents: [], activityLog: [], createdAt: '2023-11-02'
    },
    {
        id: 'case-409', clientName: 'Diana Prince', accidentDate: '2023-10-10', location: 'Museum Parking Lot',
        description: 'Backing accident. Dispute over liability. Witness available.',
        impact: 'Med PD - Dispute', status: CaseStatus.INTAKE_PROCESSING, assignedTeam: 'Team A',
        referralSource: 'Billboards', clientEmail: 'd.prince@example.com', clientPhone: '(310) 555-0009',
        documents: [], activityLog: [], createdAt: '2023-10-11'
    },
    {
        id: 'case-410', clientName: 'Natasha Romanoff', accidentDate: '2023-12-05', location: 'Highway 101',
        description: 'Hit and run. Client obtained partial plate. Uninsured motorist claim likely.',
        impact: 'Hit & Run - Soft Tissue', status: CaseStatus.ACCEPTED, assignedTeam: 'Team B',
        referralSource: 'Google Ads', clientEmail: 'n.romanoff@example.com', clientPhone: '(310) 555-0010',
        documents: [], activityLog: [], createdAt: '2023-12-06'
    },
    {
        id: 'case-411', clientName: 'Steve Rogers', accidentDate: '2023-11-25', location: 'Gym Shower',
        description: 'Slip and fall at gym. Tiles were loose. Client broke ankle.',
        impact: 'Premises - Fracture', status: CaseStatus.REVIEW_NEEDED, assignedTeam: 'Team A',
        referralSource: 'Referrals', clientEmail: 's.rogers@example.com', clientPhone: '(310) 555-0011',
        documents: [], activityLog: [], createdAt: '2023-11-26'
    },
    {
        id: 'case-412', clientName: 'Wade Wilson', accidentDate: '2023-09-30', location: 'Clinic',
        description: 'Alleged medical malpractice during routine surgery. Infection set in.',
        impact: 'Med Mal', status: CaseStatus.ANALYZING, assignedTeam: 'Team B',
        referralSource: 'Google Ads', clientEmail: 'w.wilson@example.com', clientPhone: '(310) 555-0012',
        documents: [], activityLog: [], createdAt: '2023-10-01'
    },
    {
        id: 'case-413', clientName: 'Logan Howlett', accidentDate: '2023-10-15', location: 'Logging Site',
        description: 'Workplace injury. Machinery malfunction.',
        impact: 'Work Comp', status: CaseStatus.REJECTED,
        referralSource: 'Organic Web', clientEmail: 'l.howlett@example.com', clientPhone: '(310) 555-0013',
        documents: [], activityLog: [], createdAt: '2023-10-16'
    },
    {
        id: 'case-414', clientName: 'Jean Grey', accidentDate: '2023-08-01', location: 'Intersection',
        description: 'Passenger in Uber that was rear-ended. Multiple passengers injured.',
        impact: 'Rideshare - Soft Tissue', status: CaseStatus.INTAKE_COMPLETE, assignedTeam: 'Team A',
        referralSource: 'Social Media', clientEmail: 'j.grey@example.com', clientPhone: '(310) 555-0014',
        documents: [], activityLog: [], createdAt: '2023-08-02'
    },
    {
        id: 'case-415', clientName: 'Scott Summers', accidentDate: '2023-12-20', location: 'School Zone',
        description: 'Rear-ended by distracted driver. Client has vision issues post-accident.',
        impact: 'Med PD - Head Injury', status: CaseStatus.NEW,
        referralSource: 'Google Ads', clientEmail: 's.summers@example.com', clientPhone: '(310) 555-0015',
        documents: [], activityLog: [], createdAt: '2023-12-21'
    },
    {
        id: 'case-416', clientName: 'Ororo Munroe', accidentDate: '2023-11-05', location: 'Parking Garage',
        description: 'Car scratched while parked. No bodily injury.',
        impact: 'PD Only', status: CaseStatus.REJECTED,
        referralSource: 'Organic Web', clientEmail: 'o.munroe@example.com', clientPhone: '(310) 555-0016',
        documents: [], activityLog: [], createdAt: '2023-11-06'
    },
    {
        id: 'case-417', clientName: 'Hank McCoy', accidentDate: '2023-10-25', location: 'Interstate 80',
        description: 'Sideswiped by semi-truck changing lanes. Client vehicle pushed into barrier.',
        impact: 'Trucking - Heavy PD', status: CaseStatus.INTAKE_PROCESSING, assignedTeam: 'Team B',
        referralSource: 'Billboards', clientEmail: 'h.mccoy@example.com', clientPhone: '(310) 555-0017',
        documents: [], activityLog: [], createdAt: '2023-10-26'
    },
    {
        id: 'case-418', clientName: 'Remy LeBeau', accidentDate: '2023-11-15', location: 'Bourbon St',
        description: 'Pedestrian hit by drunk driver. Police arrested defendant at scene.',
        impact: 'DUI - Severe', status: CaseStatus.ACCEPTED, assignedTeam: 'Team A',
        referralSource: 'Referrals', clientEmail: 'r.lebeau@example.com', clientPhone: '(310) 555-0018',
        documents: [], activityLog: [], createdAt: '2023-11-16'
    },
    {
        id: 'case-419', clientName: 'Anna Marie', accidentDate: '2023-12-08', location: 'Dog Park',
        description: 'Client bitten by unleashed dog. Owner fled but was identified by witnesses.',
        impact: 'Dog Bite', status: CaseStatus.REVIEW_NEEDED, assignedTeam: 'Team B',
        referralSource: 'Social Media', clientEmail: 'a.marie@example.com', clientPhone: '(310) 555-0019',
        documents: [], activityLog: [], createdAt: '2023-12-09'
    },
    {
        id: 'case-420', clientName: 'Bobby Drake', accidentDate: '2023-09-20', location: 'Ice Rink Lobby',
        description: 'Slip and fall on water puddle. No caution signs.',
        impact: 'Premises', status: CaseStatus.INTAKE_PAUSED, assignedTeam: 'Team A',
        referralSource: 'Organic Web', clientEmail: 'b.drake@example.com', clientPhone: '(310) 555-0020',
        documents: [], activityLog: [], createdAt: '2023-09-21'
    },
    {
        id: 'case-421', clientName: 'Kitty Pryde', accidentDate: '2023-12-22', location: 'Tech Park',
        description: 'T-boned at intersection. Client says other driver ran red light.',
        impact: 'High PD', status: CaseStatus.NEW,
        referralSource: 'Google Ads', clientEmail: 'k.pryde@example.com', clientPhone: '(310) 555-0021',
        documents: [], activityLog: [], createdAt: '2023-12-23'
    },
    {
        id: 'case-422', clientName: 'Piotr Rasputin', accidentDate: '2023-11-30', location: 'Construction Site',
        description: 'Scaffolding collapse. Debris hit client walking by.',
        impact: 'Construction - Negligence', status: CaseStatus.ACCEPTED, assignedTeam: 'Team A',
        referralSource: 'Billboards', clientEmail: 'p.rasputin@example.com', clientPhone: '(310) 555-0022',
        documents: [], activityLog: [], createdAt: '2023-12-01'
    }
];

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Lifted State for Persistence
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  
  // Mock initial state with diverse cases
  const [cases, setCases] = useState<CaseFile[]>([
    {
      id: 'case-101',
      clientName: 'Michael Chen',
      clientDob: '1988-03-12',
      clientAddress: '123 Maple Ave, Chicago IL',
      clientEmail: 'm.chen@email.com',
      clientPhone: '(312) 555-0123',
      accidentDate: '2023-11-05',
      location: 'Main St & 4th Ave',
      description: 'Client was proceeding through green light northbound on Main St when Defendant ran a red light westbound on 4th Ave, striking Client\'s vehicle on the driver side (T-bone). Airbags deployed. Client lost consciousness.',
      impact: 'High PD - Hospital',
      vehicleInfo: { year: '2020', make: 'Honda', model: 'Accord', damage: 'Driver side doors, B-pillar, curtain airbags' },
      parties: [
        { name: 'Susan Miller', role: 'Defendant', contact: 'Unknown' }
      ],
      insurance: [
         { type: 'Defendant', provider: 'State Farm', claimNumber: 'SF-889922', coverageLimits: '100/300' },
         { type: 'Client', provider: 'Geico', claimNumber: 'GC-112233' }
      ],
      treatmentStatus: 'Hospitalized',
      treatmentProviders: 'Northwestern Memorial',
      status: CaseStatus.NEW,
      documents: [],
      createdAt: new Date().toISOString(),
      referralSource: 'Organic Web',
      activityLog: [
        {
            id: 'log-1',
            type: 'system',
            message: 'Case created via Web Intake Form',
            timestamp: new Date().toISOString()
        }
      ],
      linkedEmails: [
          // Threaded Conversation Mock
          {
            id: 'e101-chain-1',
            from: 'Michael Chen',
            fromEmail: 'm.chen@email.com',
            subject: 'Questions about medical bills',
            body: 'Hi, I am starting to get bills from the ambulance. Should I pay them or send them to you?',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            isRead: true,
            direction: 'inbound',
            threadId: 'th-bills-101',
            attachments: []
          },
          {
            id: 'e101-chain-2',
            from: 'LegalFlow Team',
            fromEmail: 'intake@legalflow.com',
            subject: 'Re: Questions about medical bills',
            body: 'Hi Michael,\n\nPlease do not pay them directly yet. Send us a copy or photo of the bills. We will open a claim with your PIP/MedPay carrier and the adverse carrier.\n\nBest,\nIntake Team',
            date: new Date(Date.now() - 168000000).toISOString(),
            isRead: true,
            direction: 'outbound',
            threadId: 'th-bills-101',
            attachments: []
          },
          {
            id: 'e101-chain-3',
            from: 'Michael Chen',
            fromEmail: 'm.chen@email.com',
            subject: 'Re: Questions about medical bills',
            body: 'Okay thanks. I will scan them and upload to the portal later today.',
            date: new Date(Date.now() - 86400000).toISOString(),
            isRead: true,
            direction: 'inbound',
            threadId: 'th-bills-101',
            attachments: []
          }
      ],
      communications: [
        {
          id: 'comm-101',
          type: 'call',
          direction: 'inbound',
          contactName: 'Michael Chen',
          contactPhone: '(312) 555-0123',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          duration: '12m 30s',
          status: 'completed',
          content: 'Initial intake call. Client sounded groggy, confirming hospital visit.',
          aiSummary: 'Client confirmed T-bone collision at Main & 4th. Stated they had green light. Confirmed ER visit at Northwestern. Mentioned "Susan Miller" as other driver. Note: Client seems credible but tired.',
          transcript: "Agent: Hi, this is John from LegalFlow. Am I speaking with Michael?\nClient: Yes, this is him.\nAgent: Hi Michael, I'm calling about the accident inquiry you submitted. Are you okay to talk?\nClient: Yeah, I'm still a bit groggy from the meds, but I can talk.\nAgent: I understand. Can you briefly tell me what happened?\nClient: I was driving on Main St, had a green light. Out of nowhere, this car comes from 4th Ave and hits my side. T-boned me.\nAgent: I'm so sorry to hear that. Did you get medical attention?\nClient: Yeah, ambulance took me to Northwestern. Just got discharged.\nAgent: Do you know the other driver's name?\nClient: Police gave me a slip. I think it said Susan Miller.\nAgent: Okay, we can take it from here. Rest up."
        },
        {
          id: 'comm-102',
          type: 'sms',
          direction: 'outbound',
          contactName: 'Michael Chen',
          contactPhone: '(312) 555-0123',
          timestamp: new Date(Date.now() - 82000000).toISOString(),
          status: 'sent',
          content: 'Hi Michael, this is John from LegalFlow. Just confirming we received your intake form.'
        }
      ],
      chatHistory: [
          {
              id: 'chat-101-1',
              sender: 'System Bot',
              senderInitials: 'SB',
              isCurrentUser: false,
              message: 'Teams Channel #case-101-chen created successfully.',
              timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
              id: 'chat-101-2',
              sender: 'Sarah Paralegal',
              senderInitials: 'SP',
              isCurrentUser: false,
              message: 'I pulled the police report. It confirms the defendant ran the red light. Uploading to docs now.',
              timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
              id: 'chat-101-3',
              sender: 'Mike Attorney',
              senderInitials: 'MA',
              isCurrentUser: false,
              message: 'Great. Liability looks clear. I will review the coverage limits once we get the dec page.',
              timestamp: new Date(Date.now() - 1800000).toISOString()
          }
      ]
    },
    {
      id: 'case-202',
      clientName: 'James Rodriguez',
      clientDob: '1990-11-20',
      clientAddress: '882 Elm St, Chicago IL',
      clientEmail: 'j.rodriguez@example.com',
      clientPhone: '(312) 555-0199',
      accidentDate: '2023-12-10',
      location: 'I-90 Westbound',
      description: 'Rear-ended by commercial truck while in stop-and-go traffic. Heavy property damage, whiplash, concussion.',
      impact: 'Med PD - Comm Veh',
      vehicleInfo: { year: '2018', make: 'Ford', model: 'F-150', damage: 'Rear bumper, tailgate, frame damage' },
      parties: [{ name: 'Logistics Transport Inc', role: 'Defendant' }],
      insurance: [{ type: 'Defendant', provider: 'Progressive Commercial', claimNumber: 'PC-992211', coverageLimits: '1M CSL' }],
      treatmentStatus: 'Chiro/PT',
      treatmentProviders: 'Downtown Chiro',
      status: CaseStatus.INTAKE_PROCESSING,
      documents: [],
      createdAt: '2023-12-12T09:00:00Z',
      referralSource: 'Billboard',
      activityLog: [],
      assignedTeam: 'Team A',
      linkedEmails: [],
      communications: [],
      chatHistory: [
          {
              id: 'chat-202-1',
              sender: 'System Bot',
              senderInitials: 'SB',
              isCurrentUser: false,
              message: 'Teams Channel #case-202-rodriguez created successfully.',
              timestamp: '2023-12-12T09:05:00Z'
          }
      ]
    },
    {
      id: 'case-305',
      clientName: 'Linda Johnson',
      clientDob: '1975-08-22',
      clientAddress: '7742 Lake Shore Dr, Chicago IL',
      clientEmail: 'linda.j@example.com',
      clientPhone: '(312) 555-0888',
      accidentDate: '2023-10-12',
      location: 'I-294 South',
      description: 'Sideswiped by merging vehicle. Defendant attempted to change lanes without looking. Client vehicle spun out into median.',
      impact: 'Low PD - Surgery',
      vehicleInfo: { year: '2022', make: 'Tesla', model: 'Model 3', damage: 'Passenger side panels, front bumper, wheels' },
      parties: [{ name: 'Robert Davis', role: 'Defendant' }],
      insurance: [{ type: 'Defendant', provider: 'Allstate', claimNumber: 'AL-772211', coverageLimits: '25/50' }],
      treatmentStatus: 'Ortho/Specialist',
      treatmentProviders: 'Illinois Bone & Joint',
      status: CaseStatus.ACCEPTED,
      documents: [],
      createdAt: '2023-10-15T14:30:00Z',
      referralSource: 'Attorney Referral',
      activityLog: [],
      assignedTeam: 'Team B',
      linkedEmails: [],
      chatHistory: []
    },
    ...ADDITIONAL_CASES
  ]);

  const handleCaseUpdate = (updatedCase: CaseFile) => {
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
  };

  const handleNewCase = (newCase: CaseFile) => {
    setCases([newCase, ...cases]);
  };

  const handleLinkEmail = async (caseId: string, email: Email) => {
      // 1. Optimistically update Email State to reflect it is linked immediately
      setEmails(prevEmails => prevEmails.map(e => 
          e.id === email.id ? { ...e, linkedCaseId: caseId } : e
      ));

      // 2. Process attachments with AI (Async)
      // We map the mock attachments to classified document types
      const classifiedDocs: DocumentAttachment[] = await Promise.all(email.attachments.map(async (att) => {
          const docType = await classifyAttachmentType(att.name, email.subject, email.body);
          return {
              type: docType, // AI determined type
              fileName: att.name,
              fileData: null, // placeholder since we don't have real files
              mimeType: att.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
              source: `Email: ${email.subject}`,
              tags: ['Email Attachment']
          };
      }));

      // 3. Update Case with new documents and logs
      setCases(prevCases => prevCases.map(c => {
          if (c.id === caseId) {
              const newLog = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: 'system' as const,
                  message: `Linked email "${email.subject}" from ${email.from}. Added ${classifiedDocs.length} attachment(s).`,
                  timestamp: new Date().toISOString()
              };

              // Check for duplicate linking to avoid spamming the same email in the case file
              const currentEmails = c.linkedEmails || [];
              const alreadyLinked = currentEmails.some(e => e.id === email.id);
              
              const newLinkedEmails = alreadyLinked 
                ? currentEmails 
                : [email, ...currentEmails];

              return {
                  ...c,
                  documents: [...c.documents, ...classifiedDocs],
                  activityLog: [newLog, ...c.activityLog],
                  linkedEmails: newLinkedEmails
              };
          }
          return c;
      }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
            setCurrentView(view);
            setSelectedCase(null);
        }} 
        caseCount={cases.filter(c => c.status === CaseStatus.NEW).length}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && !selectedCase && (
            <Dashboard 
              cases={cases} 
              onSelectCase={(c) => {
                setSelectedCase(c);
              }}
              onOpenNewIntake={() => setCurrentView('new-intake')}
              onUpdateCase={handleCaseUpdate}
            />
          )}

          {currentView === 'inbox' && !selectedCase && (
              <Inbox 
                cases={cases}
                emails={emails}
                setEmails={setEmails}
                onLinkCase={handleLinkEmail}
              />
          )}

          {currentView === 'new-intake' && !selectedCase && (
            <NewIntakePage 
              onBack={() => setCurrentView('dashboard')}
              onSubmit={(c) => {
                handleNewCase(c);
                setCurrentView('dashboard');
              }}
            />
          )}

          {selectedCase && (
            <CaseDetail 
              caseData={selectedCase} 
              onBack={() => setSelectedCase(null)}
              onUpdateCase={handleCaseUpdate}
            />
          )}
          
          {currentView === 'analytics' && !selectedCase && (
            <Analytics />
          )}

           {currentView === 'settings' && !selectedCase && (
            <Settings />
          )}
        </div>
      </main>
    </div>
  );
}
