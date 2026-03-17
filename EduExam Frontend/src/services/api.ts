/**
 * API Service for EduExam
 */

const API_BASE_URL = 'https://eduexam-online-examination-system.onrender.com/api';

// Helper function to handle responses
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  console.log('Response:', {
    status: response.status,
    statusText: response.statusText,
    data
  });

  if (!response.ok) {
    // Handle different error formats
    const errorMessage = data?.message || data?.error || response.statusText || 'Request failed';
    throw {
      status: response.status,
      message: errorMessage,
      data: data
    };
  }

  return data;
};

export const api = {
  // --- Auth ---
  register: async (userData: any) => {
    try {
      console.log('Sending registration data:', userData);

      // Map frontend fields to backend expected fields
   const requestBody = {
  username: userData.username,
  email: userData.email,
  password: userData.password,
  pincode: userData.pincode,
  city: userData.city,
  state: userData.state, 
  education: userData.education
};

      console.log('Request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await handleResponse(response);
      console.log('Registration response data:', data);

      if (data.success) {
        // Store user data
        localStorage.setItem('tempUser', JSON.stringify(data.data));
        localStorage.setItem('userId', data.data.userId.toString());
        localStorage.setItem('currentUser', JSON.stringify(data.data)); // Also set as current user
      }

      return { success: true, data: data.data };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  login: async (credentials: any) => {
    try {
      console.log('Sending login data:', credentials);

      // Prepare login request body
      const requestBody = {
        usernameOrEmail: credentials.usernameOrEmail || credentials.username,
        password: credentials.password
      };

      console.log('Login request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await handleResponse(response);
      console.log('Login response data:', data);

      if (data.success) {
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(data.data));
        localStorage.setItem('userId', data.data.userId.toString());

        // Also store username separately for easy access
        localStorage.setItem('username', data.data.username);
      }

      return { success: true, data: data.data };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('examAnswers');
    localStorage.removeItem('lastExamResult');
    localStorage.removeItem('paymentHistory');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  getUserId: (): number | null => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  },

  // --- Payments ---
  processPayment: async (paymentData: any) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    const requestBody = {
      paymentType: paymentData.paymentType,
      cardNumber: paymentData.cardNumber || '1234567890123456',
      cvv: paymentData.cvv || '123',
      upiId: paymentData.upiId || 'onlineexam@upi',
      amount: paymentData.amount || 499
    };

    console.log('Payment request:', { userId, ...requestBody });

    const response = await fetch(`${API_BASE_URL}/payments/process?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await handleResponse(response);

    if (data.success) {
      // Update user payment status in localStorage
      const currentUser = api.getCurrentUser();
      if (currentUser) {
        currentUser.paymentStatus = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }

      // Store payment history locally
      const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
      history.push(data.data);
      localStorage.setItem('paymentHistory', JSON.stringify(history));
    }

    return data.data;
  },

  // --- Exam Questions ---
  getQuestions: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    console.log('Fetching questions for userId:', userId);

    const response = await fetch(`${API_BASE_URL}/exam/questions?userId=${userId}`);
    const data = await handleResponse(response);

    console.log('Raw questions data from API:', data);
    console.log('First question structure:', data.data ? data.data[0] : 'No data');

    return data.data;
  },
  // --- Answers ---
  saveAnswer: async (questionId: number, selectedOption: string) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    // Make sure we're sending the correct field names
    const requestBody = {
      questionId: questionId,  // Make sure this matches backend DTO
      selectedOption: selectedOption
    };

    console.log('Saving answer:', { userId, ...requestBody });

    const response = await fetch(`${API_BASE_URL}/exam/answers?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await handleResponse(response);
    return data.data;
  },
  getAnswers: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await fetch(`${API_BASE_URL}/exam/answers?userId=${userId}`);

    const data = await handleResponse(response);
    return data.data;
  },

  // --- Exam Submission ---
  submitExam: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await fetch(`${API_BASE_URL}/exam/submit?userId=${userId}`, {
      method: 'POST'
    });

    const data = await handleResponse(response);

    if (data.success) {
      localStorage.setItem('lastExamResult', JSON.stringify(data.data));
    }

    return { success: true, data: data.data };
  },

  getExamResult: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    // Try to get from localStorage first
    const cached = localStorage.getItem('lastExamResult');
    if (cached) {
      const parsed = JSON.parse(cached);
      // Only use cache if it's from the current user (you might want to check timestamps)
      return parsed;
    }

    // Otherwise fetch from API
    const response = await fetch(`${API_BASE_URL}/exam/result?userId=${userId}`);

    const data = await handleResponse(response);

    if (data.success) {
      localStorage.setItem('lastExamResult', JSON.stringify(data.data));
    }

    return data.data;
  },

  // --- Payment Status ---
  getPaymentStatus: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await fetch(`${API_BASE_URL}/payments/status?userId=${userId}`);

    const data = await handleResponse(response);
    return data.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!api.getCurrentUser();
  }
};
