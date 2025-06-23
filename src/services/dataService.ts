
import type { DataRow } from "@/components/dashboard/Dashboard";

// Mock data storage
const generateMockData = (): DataRow[] => {
  const categories = ['Documentation', 'Development', 'Testing', 'Review', 'Planning'];
  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const users = ['john@company.com', 'sarah@company.com', 'mike@company.com'];
  
  const tasks = [
    { title: 'Complete API Documentation', description: 'Finalize the REST API documentation for the new endpoints' },
    { title: 'Review Security Audit', description: 'Analyze and address findings from the quarterly security audit' },
    { title: 'Update User Interface', description: 'Implement new design changes for the dashboard' },
    { title: 'Database Migration', description: 'Migrate legacy data to the new database schema' },
    { title: 'Performance Testing', description: 'Conduct load testing on the production environment' },
    { title: 'Client Presentation', description: 'Prepare slides for the quarterly business review' },
    { title: 'Code Review Process', description: 'Establish new code review guidelines and workflows' },
    { title: 'Training Materials', description: 'Create training content for new team members' },
    { title: 'Backup Verification', description: 'Verify all backup systems are functioning correctly' },
    { title: 'Compliance Check', description: 'Ensure all processes meet regulatory requirements' },
    { title: 'User Feedback Analysis', description: 'Analyze user feedback from the latest feature release' },
    { title: 'Infrastructure Upgrade', description: 'Plan and execute server infrastructure improvements' },
    { title: 'Integration Testing', description: 'Test new third-party service integrations' },
    { title: 'Documentation Review', description: 'Review and update existing technical documentation' },
    { title: 'Quality Assurance', description: 'Perform comprehensive QA testing on new features' },
  ];

  const mockData: DataRow[] = [];
  
  // Generate data for each user
  users.forEach((userEmail, userIndex) => {
    const userTasks = tasks.slice(userIndex * 5, (userIndex + 1) * 5);
    
    userTasks.forEach((task, index) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + (index * 3) - 10);
      
      mockData.push({
        id: `${userEmail.split('@')[0]}_${index + 1}`,
        title: task.title,
        description: task.description,
        category: categories[index % categories.length],
        priority: priorities[index % priorities.length],
        dueDate: baseDate.toISOString(),
        userEmail: userEmail,
      });
    });
  });

  return mockData;
};

// Store mock data in localStorage for persistence
const DATA_KEY = 'data_portal_mock_data';

const getStoredData = (): DataRow[] => {
  const stored = localStorage.getItem(DATA_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Generate and store mock data
  const mockData = generateMockData();
  localStorage.setItem(DATA_KEY, JSON.stringify(mockData));
  return mockData;
};

export const getUserData = async (userEmail: string): Promise<DataRow[]> => {
  console.log(`Fetching data for user: ${userEmail}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allData = getStoredData();
  const userData = allData.filter(row => row.userEmail === userEmail);
  
  console.log(`Found ${userData.length} records for ${userEmail}`);
  return userData;
};

export const getAllData = async (): Promise<DataRow[]> => {
  console.log('Fetching all data');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return getStoredData();
};

// This function would be replaced with BigQuery integration
export const executeQuery = async (query: string, userEmail: string): Promise<DataRow[]> => {
  console.log(`Executing custom query for ${userEmail}:`, query);
  
  // For now, just return user data
  // In real implementation, this would execute the BigQuery and filter by userEmail
  return await getUserData(userEmail);
};
