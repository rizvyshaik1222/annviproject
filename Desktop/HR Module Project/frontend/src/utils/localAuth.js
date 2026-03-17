const USERS_KEY = 'avvi_hr_users';
const SESSION_KEY = 'avvi_hr_session';

const readUsers = () => {
  try {
    const value = localStorage.getItem(USERS_KEY);
    const users = value ? JSON.parse(value) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Initialize sample admin and HR users on first load
export const initializeSampleUsers = () => {
  const users = readUsers();
  
  // Check if sample users already exist
  const hasAdmin = users.some(u => u.email === 'admin@anvvi.com');
  const hasHR = users.some(u => u.email === 'hr@anvvi.com');
  
  if (!hasAdmin || !hasHR) {
    const sampleUsers = [
      ...users.filter(u => u.email !== 'admin@anvvi.com' && u.email !== 'hr@anvvi.com'),
      {
        id: 1001,
        name: 'Admin User',
        email: 'admin@anvvi.com',
        password: 'AdminPass123!',
        role: 'admin'
      },
      {
        id: 1002,
        name: 'HR Manager',
        email: 'hr@anvvi.com',
        password: 'HRPass123!',
        role: 'hr'
      }
    ];
    writeUsers(sampleUsers);
  }
};

// Initialize on module load
initializeSampleUsers();

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const getPasswordStrength = (password = '') => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z\d]/.test(password)) score += 1;

  if (!password) {
    return { score: 0, label: 'Enter password', level: 'none' };
  }

  if (score <= 2) {
    return { score, label: 'Weak', level: 'weak' };
  }

  if (score <= 4) {
    return { score, label: 'Medium', level: 'medium' };
  }

  return { score, label: 'Strong', level: 'strong' };
};

export const validatePasswordStrength = (password) => {
  if (!passwordRule.test(password)) {
    return {
      ok: false,
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    };
  }

  return { ok: true };
};

export const getSession = () => {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const signupUser = ({ name, email, password, role = 'hr' }) => {
  const cleanEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (!name.trim() || !cleanEmail || !password) {
    return { ok: false, message: 'Please fill all fields.' };
  }

  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.ok) {
    return passwordCheck;
  }

  const existing = users.find((user) => user.email === cleanEmail);
  if (existing) {
    return { ok: false, message: 'Email already exists. Please login.' };
  }

  const user = {
    id: Date.now(),
    name: name.trim(),
    email: cleanEmail,
    password,
    role: role || 'hr'
  };

  users.push(user);
  writeUsers(users);

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
};

export const loginUser = ({ email, password, role = 'hr' }) => {
  const cleanEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (!cleanEmail || !password) {
    return { ok: false, message: 'Please enter email and password.' };
  }

  const user = users.find((row) => row.email === cleanEmail && row.password === password && (row.role === role));
  if (!user) {
    return { ok: false, message: 'Invalid email, password, or role.' };
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
};
