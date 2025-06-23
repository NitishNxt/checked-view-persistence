
import type { CheckboxState } from "@/components/dashboard/Dashboard";

interface CheckboxLog {
  userEmail: string;
  rowId: string;
  checked: boolean;
  timestamp: string;
}

// Mock storage keys
const CHECKBOX_STATES_KEY = 'data_portal_checkbox_states';
const CHECKBOX_LOGS_KEY = 'data_portal_checkbox_logs';

const getStoredCheckboxStates = (): Record<string, Record<string, CheckboxState>> => {
  const stored = localStorage.getItem(CHECKBOX_STATES_KEY);
  return stored ? JSON.parse(stored) : {};
};

const storeCheckboxStates = (states: Record<string, Record<string, CheckboxState>>) => {
  localStorage.setItem(CHECKBOX_STATES_KEY, JSON.stringify(states));
};

const getStoredCheckboxLogs = (): CheckboxLog[] => {
  const stored = localStorage.getItem(CHECKBOX_LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const storeCheckboxLogs = (logs: CheckboxLog[]) => {
  localStorage.setItem(CHECKBOX_LOGS_KEY, JSON.stringify(logs));
};

export const getUserCheckboxStates = async (userEmail: string): Promise<Record<string, CheckboxState>> => {
  console.log(`Fetching checkbox states for user: ${userEmail}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allStates = getStoredCheckboxStates();
  const userStates = allStates[userEmail] || {};
  
  console.log(`Found ${Object.keys(userStates).length} checkbox states for ${userEmail}`);
  return userStates;
};

export const logCheckboxAction = async (userEmail: string, rowId: string, checked: boolean): Promise<void> => {
  console.log(`Logging checkbox action: ${userEmail}, row ${rowId}, checked: ${checked}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const timestamp = new Date().toISOString();
  
  // Update checkbox states
  const allStates = getStoredCheckboxStates();
  if (!allStates[userEmail]) {
    allStates[userEmail] = {};
  }
  
  allStates[userEmail][rowId] = {
    rowId,
    checked,
    lastUpdated: timestamp,
  };
  
  storeCheckboxStates(allStates);
  
  // Add to logs (for audit trail)
  const logs = getStoredCheckboxLogs();
  const newLog: CheckboxLog = {
    userEmail,
    rowId,
    checked,
    timestamp,
  };
  
  // Replace existing log for same user/row or add new one
  const existingLogIndex = logs.findIndex(log => 
    log.userEmail === userEmail && log.rowId === rowId
  );
  
  if (existingLogIndex >= 0) {
    logs[existingLogIndex] = newLog;
    console.log(`Updated existing log entry for ${userEmail}, row ${rowId}`);
  } else {
    logs.push(newLog);
    console.log(`Created new log entry for ${userEmail}, row ${rowId}`);
  }
  
  storeCheckboxLogs(logs);
  console.log(`Successfully logged checkbox action`);
};

export const getCheckboxLogs = async (userEmail?: string): Promise<CheckboxLog[]> => {
  console.log(`Fetching checkbox logs${userEmail ? ` for user: ${userEmail}` : ''}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allLogs = getStoredCheckboxLogs();
  
  if (userEmail) {
    return allLogs.filter(log => log.userEmail === userEmail);
  }
  
  return allLogs;
};

export const getCheckboxAuditTrail = async (rowId: string): Promise<CheckboxLog[]> => {
  console.log(`Fetching audit trail for row: ${rowId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allLogs = getStoredCheckboxLogs();
  return allLogs.filter(log => log.rowId === rowId);
};
