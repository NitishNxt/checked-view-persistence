
interface User {
  email: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

// Mock user storage (in a real app, this would be handled by your backend)
const USERS_KEY = 'data_portal_users';
const CURRENT_USER_KEY = 'data_portal_current_user';

const getStoredUsers = (): UserCredentials[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const storeUsers = (users: UserCredentials[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const setCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const register = async (email: string, password: string): Promise<User> => {
  console.log(`Registering user: ${email}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getStoredUsers();
  
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    throw new Error('User already exists');
  }
  
  // Add new user
  const newUser: UserCredentials = { email, password };
  users.push(newUser);
  storeUsers(users);
  
  const user: User = { email };
  setCurrentUser(user);
  
  console.log(`User registered successfully: ${email}`);
  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  console.log(`Logging in user: ${email}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const authenticatedUser: User = { email };
  setCurrentUser(authenticatedUser);
  
  console.log(`User logged in successfully: ${email}`);
  return authenticatedUser;
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) {
    return null;
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  console.log('Logging out user');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  clearCurrentUser();
  console.log('User logged out successfully');
};

// Initialize with demo users for testing
const initializeDemoUsers = () => {
  const users = getStoredUsers();
  if (users.length === 0) {
    const demoUsers: UserCredentials[] = [
      { email: 'john@company.com', password: 'demo123' },
      { email: 'sarah@company.com', password: 'demo123' },
      { email: 'mike@company.com', password: 'demo123' },
    ];
    storeUsers(demoUsers);
    console.log('Demo users initialized');
  }
};

// Initialize demo users on module load
initializeDemoUsers();
