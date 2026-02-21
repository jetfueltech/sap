import { CaseFile, CaseTask, CaseStatus, TaskType, WorkflowStage, WORKFLOW_STAGES, ActivityLog } from '../types';

export interface WorkflowStageProgress {
  stage: WorkflowStage;
  label: string;
  description: string;
  icon: string;
  status: 'complete' | 'active' | 'pending' | 'blocked';
  completedItems: number;
  totalItems: number;
  items: WorkflowCheckItem[];
}

export interface WorkflowCheckItem {
  id: string;
  label: string;
  done: boolean;
  taskType?: TaskType;
  urgent?: boolean;
  detail?: string;
}

export interface ReminderAlert {
  caseId: string;
  caseName: string;
  type: 'bill_request' | 'records_request' | 'er_bill' | 'er_records' | 'coverage' | 'liability' | 'overdue_task' | 'no_workflow';
  message: string;
  daysPending: number;
  priority: 'critical' | 'high' | 'medium';
  stage: WorkflowStage;
}

const DAYS = (n: number) => n * 24 * 60 * 60 * 1000;

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / DAYS(1));
}

function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / DAYS(1));
}

function addDays(days: number): string {
  return new Date(Date.now() + DAYS(days)).toISOString().split('T')[0];
}

function isActive(c: CaseFile): boolean {
  return [
    CaseStatus.ACCEPTED,
    CaseStatus.INTAKE_PROCESSING,
    CaseStatus.INTAKE_PAUSED,
    CaseStatus.INTAKE_COMPLETE,
  ].includes(c.status);
}

function hasTaskType(c: CaseFile, type: TaskType, completed = false): boolean {
  return (c.tasks || []).some(t => t.type === type && (completed ? t.status === 'completed' : true));
}

function isTaskCompleted(c: CaseFile, type: TaskType): boolean {
  return (c.tasks || []).some(t => t.type === type && t.status === 'completed');
}

function hasRetainerDoc(c: CaseFile): boolean {
  return c.documents.some(d => d.type === 'retainer');
}

function hasHIPAADoc(c: CaseFile): boolean {
  return c.documents.some(d => d.type === 'authorization');
}

function hasCrashReportDoc(c: CaseFile): boolean {
  return c.documents.some(d => d.type === 'crash_report');
}

function getDefendantInsurance(c: CaseFile) {
  return (c.insurance || []).find(i => i.type === 'Defendant');
}

function getClientInsurance(c: CaseFile) {
  return (c.insurance || []).find(i => i.type === 'Client');
}

function allERBillsReceived(c: CaseFile): boolean {
  if (!c.erVisits || c.erVisits.length === 0) return true;
  return c.erVisits.every(v =>
    v.bills.every(b => b.status === 'received' || b.status === 'na')
  );
}

function allERRecordsReceived(c: CaseFile): boolean {
  if (!c.erVisits || c.erVisits.length === 0) return true;
  return c.erVisits.every(v => v.recordStatus === 'received' || v.recordStatus === 'na');
}

function allProviderBillsReceived(c: CaseFile): boolean {
  if (!c.medicalProviders || c.medicalProviders.length === 0) return true;
  return c.medicalProviders.every(p =>
    p.billRequestStatus === 'received' || p.billRequestStatus === 'na' || p.totalCost !== undefined
  );
}

function allProviderRecordsReceived(c: CaseFile): boolean {
  if (!c.medicalProviders || c.medicalProviders.length === 0) return true;
  return c.medicalProviders.every(p =>
    p.recordsRequestStatus === 'received' || p.recordsRequestStatus === 'na'
  );
}

export function getWorkflowProgress(c: CaseFile): WorkflowStageProgress[] {
  const defIns = getDefendantInsurance(c);
  const clientIns = getClientInsurance(c);

  const intakeItems: WorkflowCheckItem[] = [
    { id: 'retainer', label: 'Retainer agreement signed', done: isTaskCompleted(c, 'retainer') || hasRetainerDoc(c), taskType: 'retainer' },
    { id: 'hipaa', label: 'HIPAA authorizations signed', done: isTaskCompleted(c, 'hipaa') || hasHIPAADoc(c), taskType: 'hipaa' },
    { id: 'lor_defendant', label: `LOR sent to defendant's insurance${defIns ? ` (${defIns.provider})` : ''}`, done: isTaskCompleted(c, 'lor_defendant') || !!c.lorDefendantSentDate, taskType: 'lor_defendant' },
    ...(clientIns ? [{ id: 'lor_client', label: `LOR sent to client's insurance (${clientIns.provider})`, done: isTaskCompleted(c, 'lor_client_ins') || !!c.lorClientInsSentDate, taskType: 'lor_client_ins' as TaskType }] : []),
  ];

  const investigationItems: WorkflowCheckItem[] = [
    { id: 'crash_request', label: 'Crash/police report requested', done: isTaskCompleted(c, 'crash_report_request') || !!c.crashReportRequestedDate, taskType: 'crash_report_request' },
    { id: 'crash_received', label: 'Crash/police report received', done: isTaskCompleted(c, 'crash_report_received') || hasCrashReportDoc(c), taskType: 'crash_report_received' },
  ];

  const insuranceItems: WorkflowCheckItem[] = [
    { id: 'coverage', label: 'Coverage confirmed', done: defIns?.coverageStatus === 'accepted', urgent: defIns?.coverageStatus === 'pending' },
    { id: 'liability', label: 'Liability accepted', done: defIns?.liabilityStatus === 'accepted', urgent: defIns?.liabilityStatus === 'pending' },
    { id: 'policy_limits', label: 'Policy limits obtained', done: defIns?.policyLimitsStatus === 'received', urgent: defIns?.policyLimitsStatus === 'requested' },
  ];

  const treatmentItems: WorkflowCheckItem[] = [
    { id: 'treatment_active', label: 'Client in active treatment', done: !!(c.medicalProviders && c.medicalProviders.length > 0) },
    { id: 'treatment_complete', label: 'Treatment completed / end date set', done: !!c.treatmentEndDate },
  ];

  const providers = c.medicalProviders || [];
  const erVisits = c.erVisits || [];

  const recordsRequestItems: WorkflowCheckItem[] = [
    ...providers.map(p => ({
      id: `bill_req_${p.id}`,
      label: `Bill request sent - ${p.name}`,
      done: p.billRequestStatus === 'requested' || p.billRequestStatus === 'received' || !!p.billRequestDate,
      taskType: 'bill_request' as TaskType,
      detail: p.billRequestDate ? `Sent ${daysSince(p.billRequestDate)}d ago` : undefined,
    })),
    ...providers.map(p => ({
      id: `rec_req_${p.id}`,
      label: `Records request sent - ${p.name}`,
      done: p.recordsRequestStatus === 'requested' || p.recordsRequestStatus === 'received' || !!p.recordsRequestDate,
      taskType: 'records_request' as TaskType,
    })),
    ...erVisits.map(v => ({
      id: `er_bill_req_${v.id}`,
      label: `ER bill request sent - ${v.facilityName}`,
      done: v.bills.some(b => b.status === 'requested' || b.status === 'received'),
      taskType: 'er_bills' as TaskType,
    })),
    ...erVisits.map(v => ({
      id: `er_rec_req_${v.id}`,
      label: `ER records request sent - ${v.facilityName}`,
      done: v.recordStatus === 'requested' || v.recordStatus === 'received',
      taskType: 'er_records' as TaskType,
    })),
  ];

  const recordsCollectionItems: WorkflowCheckItem[] = [
    ...providers.map(p => ({
      id: `bill_recv_${p.id}`,
      label: `Bill received - ${p.name}`,
      done: p.billRequestStatus === 'received' || (p.totalCost !== undefined && p.totalCost > 0),
      urgent: p.billRequestDate ? daysSince(p.billRequestDate) > 30 && p.billRequestStatus !== 'received' : false,
      detail: p.billRequestDate && p.billRequestStatus !== 'received'
        ? `Requested ${daysSince(p.billRequestDate)}d ago`
        : undefined,
    })),
    ...providers.map(p => ({
      id: `rec_recv_${p.id}`,
      label: `Records received - ${p.name}`,
      done: p.recordsRequestStatus === 'received',
      urgent: p.recordsRequestDate ? daysSince(p.recordsRequestDate) > 30 && p.recordsRequestStatus !== 'received' : false,
    })),
    { id: 'er_bills_recv', label: 'All ER bills received', done: allERBillsReceived(c), urgent: !allERBillsReceived(c) && erVisits.length > 0 },
    { id: 'er_records_recv', label: 'All ER records received', done: allERRecordsReceived(c), urgent: !allERRecordsReceived(c) && erVisits.length > 0 },
  ].filter(item => item.id !== 'er_bills_recv' && item.id !== 'er_records_recv' ? true : erVisits.length > 0);

  const preDemandItems: WorkflowCheckItem[] = [
    { id: 'specials', label: 'Specials package compiled', done: c.specials?.status === 'complete' || c.specials?.status === 'sent_to_attorney', taskType: 'specials_compile' },
    { id: 'demand_review', label: 'Pre-demand attorney review', done: isTaskCompleted(c, 'demand_review'), taskType: 'demand_review' },
  ];

  const demandItems: WorkflowCheckItem[] = [
    { id: 'demand_prep', label: 'Demand letter prepared', done: isTaskCompleted(c, 'demand_prep'), taskType: 'demand_prep' },
  ];

  const stages: { stage: WorkflowStage; items: WorkflowCheckItem[] }[] = [
    { stage: 'intake', items: intakeItems },
    { stage: 'investigation', items: investigationItems },
    { stage: 'insurance', items: insuranceItems },
    { stage: 'treatment', items: treatmentItems },
    { stage: 'records_requests', items: recordsRequestItems.length > 0 ? recordsRequestItems : [{ id: 'no_providers', label: 'No providers added yet', done: false }] },
    { stage: 'records_collection', items: recordsCollectionItems.length > 0 ? recordsCollectionItems : [{ id: 'no_providers_coll', label: 'No providers to collect from', done: true }] },
    { stage: 'pre_demand', items: preDemandItems },
    { stage: 'demand', items: demandItems },
  ];

  const results: WorkflowStageProgress[] = [];
  let previousComplete = true;

  for (const { stage, items } of stages) {
    const info = WORKFLOW_STAGES.find(s => s.id === stage)!;
    const completedItems = items.filter(i => i.done).length;
    const allDone = completedItems === items.length;

    let status: WorkflowStageProgress['status'];
    if (allDone) {
      status = 'complete';
    } else if (!previousComplete) {
      status = 'blocked';
    } else {
      status = 'active';
    }

    results.push({
      stage,
      label: info.label,
      description: info.description,
      icon: info.icon,
      status,
      completedItems,
      totalItems: items.length,
      items,
    });

    if (!allDone) previousComplete = false;
  }

  return results;
}

export function generateInitialWorkflowTasks(c: CaseFile): CaseTask[] {
  if (!isActive(c)) return [];
  const existing = c.tasks || [];
  const now = new Date().toISOString();
  const tasks: CaseTask[] = [];

  function addIfMissing(type: TaskType, title: string, description: string, dueDays: number, priority: 'high' | 'medium' | 'low' = 'high') {
    if (!existing.some(t => t.type === type)) {
      tasks.push({
        id: `wf-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        caseId: c.id,
        title,
        description,
        type,
        status: 'open',
        dueDate: addDays(dueDays),
        priority,
        recurrence: 'one-time',
        createdAt: now,
        autoGenerated: true,
      });
    }
  }

  const defIns = getDefendantInsurance(c);
  const clientIns = getClientInsurance(c);

  if (!hasRetainerDoc(c)) {
    addIfMissing('retainer', 'Obtain signed retainer agreement', 'Have client review and sign the retainer agreement', 3);
  }
  addIfMissing('hipaa', 'Obtain signed HIPAA authorizations', 'Have client sign HIPAA/medical authorizations for all treating providers', 3);
  addIfMissing('lor_defendant', `Send LOR to ${defIns?.provider || "defendant's insurance"}`, "Send Letter of Representation to defendant's insurance company", 5);
  if (clientIns) {
    addIfMissing('lor_client_ins', `Send LOR to ${clientIns.provider} (client's insurance)`, "Send Letter of Representation to client's own insurance", 5);
  }
  addIfMissing('crash_report_request', 'Request crash/police report', 'Request official crash report from law enforcement agency', 3, 'medium');

  if (defIns && (!defIns.coverageStatus || defIns.coverageStatus === 'pending')) {
    if (!existing.some(t => t.type === 'coverage_followup' && t.status !== 'completed')) {
      tasks.push({
        id: `wf-cov-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        caseId: c.id,
        title: `Confirm coverage with ${defIns.provider || "defendant's insurance"}`,
        description: 'Follow up with insurance to confirm coverage is in effect',
        type: 'coverage_followup',
        status: 'open',
        dueDate: addDays(7),
        priority: 'high',
        recurrence: 'weekly',
        createdAt: now,
        autoGenerated: true,
      });
    }
  }

  if (defIns && (!defIns.liabilityStatus || defIns.liabilityStatus === 'pending')) {
    if (!existing.some(t => t.type === 'liability_followup' && t.status !== 'completed')) {
      tasks.push({
        id: `wf-liab-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        caseId: c.id,
        title: `Follow up on liability with ${defIns.provider || "defendant's insurance"}`,
        description: 'Pursue liability acceptance/denial decision',
        type: 'liability_followup',
        status: 'open',
        dueDate: addDays(7),
        priority: 'high',
        recurrence: 'weekly',
        createdAt: now,
        autoGenerated: true,
      });
    }
  }

  return tasks;
}

export function generateReminderTasks(c: CaseFile): CaseTask[] {
  if (!isActive(c)) return [];
  const existing = c.tasks || [];
  const now = new Date().toISOString();
  const tasks: CaseTask[] = [];

  function reminderKey(base: string, daysBucket: number) {
    return `reminder-${base}-${daysBucket}`;
  }

  function alreadyHasReminder(key: string): boolean {
    return existing.some(t => t.id.startsWith(key) && t.status !== 'completed');
  }

  const defIns = getDefendantInsurance(c);

  if (defIns?.coverageStatus === 'pending' && defIns.coverageFollowUpDate) {
    const days = daysSince(defIns.coverageFollowUpDate);
    if (days > 14 && !existing.some(t => t.type === 'coverage_followup' && t.status !== 'completed')) {
      tasks.push({
        id: `reminder-cov-${Date.now()}`,
        caseId: c.id,
        title: `OVERDUE: Coverage follow-up with ${defIns.provider || 'insurer'} (${days}d pending)`,
        description: 'Coverage has been pending for over 2 weeks - escalate follow-up',
        type: 'coverage_followup',
        status: 'open',
        dueDate: addDays(1),
        priority: 'high',
        recurrence: 'weekly',
        createdAt: now,
        autoGenerated: true,
      });
    }
  }

  if (defIns?.liabilityStatus === 'pending' && defIns.liabilityFollowUpDate) {
    const days = daysSince(defIns.liabilityFollowUpDate);
    if (days > 14 && !existing.some(t => t.type === 'liability_followup' && t.status !== 'completed')) {
      tasks.push({
        id: `reminder-liab-${Date.now()}`,
        caseId: c.id,
        title: `OVERDUE: Liability follow-up with ${defIns.provider || 'insurer'} (${days}d pending)`,
        description: 'Liability decision has been pending for over 2 weeks - escalate',
        type: 'liability_followup',
        status: 'open',
        dueDate: addDays(1),
        priority: 'high',
        recurrence: 'weekly',
        createdAt: now,
        autoGenerated: true,
      });
    }
  }

  for (const provider of c.medicalProviders || []) {
    if (provider.billRequestDate && provider.billRequestStatus === 'requested') {
      const days = daysSince(provider.billRequestDate);
      const bucket = days >= 90 ? 90 : days >= 60 ? 60 : days >= 30 ? 30 : 0;
      if (bucket > 0) {
        const key = reminderKey(`bill-${provider.id}`, bucket);
        if (!alreadyHasReminder(key)) {
          tasks.push({
            id: `${key}-${Date.now()}`,
            caseId: c.id,
            title: `Follow up: ${provider.name} bill request (${days}d overdue)`,
            description: bucket >= 90
              ? `CRITICAL: Bill from ${provider.name} has been requested for ${days} days. Consider subpoena.`
              : bucket >= 60
              ? `Urgent: Bill request to ${provider.name} has been pending ${days} days. Send demand letter to provider.`
              : `Bill request to ${provider.name} sent ${days} days ago - no response received.`,
            type: 'bill_request',
            status: 'open',
            dueDate: addDays(bucket >= 90 ? 1 : bucket >= 60 ? 2 : 5),
            priority: bucket >= 60 ? 'high' : 'medium',
            recurrence: 'weekly',
            createdAt: now,
            autoGenerated: true,
          });
        }
      }
    }

    if (provider.recordsRequestDate && provider.recordsRequestStatus === 'requested') {
      const days = daysSince(provider.recordsRequestDate);
      const bucket = days >= 90 ? 90 : days >= 60 ? 60 : days >= 30 ? 30 : 0;
      if (bucket > 0) {
        const key = reminderKey(`records-${provider.id}`, bucket);
        if (!alreadyHasReminder(key)) {
          tasks.push({
            id: `${key}-${Date.now()}`,
            caseId: c.id,
            title: `Follow up: ${provider.name} records request (${days}d overdue)`,
            description: bucket >= 60
              ? `Urgent: Records request to ${provider.name} pending ${days} days.`
              : `Records request to ${provider.name} sent ${days} days ago - no response received.`,
            type: 'records_request',
            status: 'open',
            dueDate: addDays(bucket >= 60 ? 2 : 5),
            priority: bucket >= 60 ? 'high' : 'medium',
            recurrence: 'weekly',
            createdAt: now,
            autoGenerated: true,
          });
        }
      }
    }
  }

  for (const visit of c.erVisits || []) {
    for (const bill of visit.bills) {
      if (bill.requestDate && bill.status === 'requested') {
        const days = daysSince(bill.requestDate);
        const bucket = days >= 90 ? 90 : days >= 60 ? 60 : days >= 30 ? 30 : 0;
        if (bucket > 0) {
          const key = reminderKey(`er-bill-${visit.id}-${bill.type}`, bucket);
          if (!alreadyHasReminder(key)) {
            tasks.push({
              id: `${key}-${Date.now()}`,
              caseId: c.id,
              title: `Follow up: ${visit.facilityName} ${bill.type} bill (${days}d pending)`,
              type: 'er_bills',
              status: 'open',
              dueDate: addDays(bucket >= 60 ? 2 : 5),
              priority: bucket >= 60 ? 'high' : 'medium',
              recurrence: 'weekly',
              createdAt: now,
              autoGenerated: true,
            });
          }
        }
      }
    }

    if (visit.recordRequestDate && visit.recordStatus === 'requested') {
      const days = daysSince(visit.recordRequestDate);
      const bucket = days >= 60 ? 60 : days >= 30 ? 30 : 0;
      if (bucket > 0) {
        const key = reminderKey(`er-rec-${visit.id}`, bucket);
        if (!alreadyHasReminder(key)) {
          tasks.push({
            id: `${key}-${Date.now()}`,
            caseId: c.id,
            title: `Follow up: ${visit.facilityName} ER records (${days}d pending)`,
            type: 'er_records',
            status: 'open',
            dueDate: addDays(bucket >= 60 ? 2 : 5),
            priority: bucket >= 60 ? 'high' : 'medium',
            recurrence: 'weekly',
            createdAt: now,
            autoGenerated: true,
          });
        }
      }
    }
  }

  return tasks;
}

export function getAllReminders(cases: CaseFile[]): ReminderAlert[] {
  const alerts: ReminderAlert[] = [];

  for (const c of cases) {
    if (!isActive(c)) continue;

    const tasks = c.tasks || [];
    const overdueTasks = tasks.filter(t => {
      if (t.status === 'completed') return false;
      return daysUntil(t.dueDate) < 0;
    });

    if (overdueTasks.length > 0) {
      alerts.push({
        caseId: c.id,
        caseName: c.clientName,
        type: 'overdue_task',
        message: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        daysPending: Math.abs(Math.min(...overdueTasks.map(t => daysUntil(t.dueDate)))),
        priority: overdueTasks.length >= 3 ? 'critical' : 'high',
        stage: 'intake',
      });
    }

    if (!c.workflowInitialized) {
      alerts.push({
        caseId: c.id,
        caseName: c.clientName,
        type: 'no_workflow',
        message: 'Workflow not initialized - no tasks generated',
        daysPending: Math.floor(daysSince(c.createdAt)),
        priority: 'medium',
        stage: 'intake',
      });
    }

    const defIns = getDefendantInsurance(c);
    if (defIns?.coverageStatus === 'pending') {
      const since = defIns.coverageFollowUpDate ? daysSince(defIns.coverageFollowUpDate) : daysSince(c.createdAt);
      if (since > 7) {
        alerts.push({
          caseId: c.id,
          caseName: c.clientName,
          type: 'coverage',
          message: `Coverage unconfirmed (${since}d pending)`,
          daysPending: since,
          priority: since > 21 ? 'critical' : 'high',
          stage: 'insurance',
        });
      }
    }

    if (defIns?.liabilityStatus === 'pending') {
      const since = defIns.liabilityFollowUpDate ? daysSince(defIns.liabilityFollowUpDate) : daysSince(c.createdAt);
      if (since > 14) {
        alerts.push({
          caseId: c.id,
          caseName: c.clientName,
          type: 'liability',
          message: `Liability unresolved (${since}d pending)`,
          daysPending: since,
          priority: since > 30 ? 'critical' : 'high',
          stage: 'insurance',
        });
      }
    }

    for (const p of c.medicalProviders || []) {
      if (p.billRequestDate && p.billRequestStatus === 'requested') {
        const days = daysSince(p.billRequestDate);
        if (days >= 30) {
          alerts.push({
            caseId: c.id,
            caseName: c.clientName,
            type: 'bill_request',
            message: `${p.name} bill request ${days}d pending`,
            daysPending: days,
            priority: days >= 90 ? 'critical' : days >= 60 ? 'high' : 'medium',
            stage: 'records_collection',
          });
        }
      }
      if (p.recordsRequestDate && p.recordsRequestStatus === 'requested') {
        const days = daysSince(p.recordsRequestDate);
        if (days >= 30) {
          alerts.push({
            caseId: c.id,
            caseName: c.clientName,
            type: 'records_request',
            message: `${p.name} records request ${days}d pending`,
            daysPending: days,
            priority: days >= 60 ? 'high' : 'medium',
            stage: 'records_collection',
          });
        }
      }
    }

    for (const v of c.erVisits || []) {
      for (const b of v.bills) {
        if (b.requestDate && b.status === 'requested') {
          const days = daysSince(b.requestDate);
          if (days >= 30) {
            alerts.push({
              caseId: c.id,
              caseName: c.clientName,
              type: 'er_bill',
              message: `${v.facilityName} ${b.type} bill ${days}d pending`,
              daysPending: days,
              priority: days >= 90 ? 'critical' : days >= 60 ? 'high' : 'medium',
              stage: 'records_collection',
            });
          }
        }
      }
    }
  }

  return alerts.sort((a, b) => {
    const p = { critical: 0, high: 1, medium: 2 };
    return p[a.priority] - p[b.priority] || b.daysPending - a.daysPending;
  });
}

export function applyWorkflowToCase(c: CaseFile): CaseFile {
  const newTasks = generateInitialWorkflowTasks(c);
  const reminderTasks = generateReminderTasks(c);
  const allNew = [...newTasks, ...reminderTasks];

  if (allNew.length === 0 && c.workflowInitialized) return c;

  const logs: ActivityLog[] = allNew.length > 0
    ? [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'system',
        message: `${allNew.length} workflow task${allNew.length > 1 ? 's' : ''} generated`,
        timestamp: new Date().toISOString(),
      }]
    : [];

  return {
    ...c,
    workflowInitialized: true,
    tasks: [...(c.tasks || []), ...allNew],
    activityLog: [...logs, ...(c.activityLog || [])],
  };
}
