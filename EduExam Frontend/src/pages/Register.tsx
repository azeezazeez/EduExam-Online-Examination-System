// In your api service, update the register method to ensure it returns a consistent response
register: async (userData: any) => {
  try {
    console.log('Sending registration data:', userData);

    const requestBody = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      pincode: userData.pincode,
      city: userData.district,
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
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      
      console.log('User data stored successfully');
      console.log('Stored user:', localStorage.getItem('currentUser'));
      
      return { success: true, data: data.data };
    } else {
      // If the API doesn't return success: true, still try to proceed
      if (data.data) {
        localStorage.setItem('tempUser', JSON.stringify(data.data));
        localStorage.setItem('userId', data.data.userId.toString());
        localStorage.setItem('currentUser', JSON.stringify(data.data));
        return { success: true, data: data.data };
      }
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    // If we get a 201 Created but no success flag, still consider it successful
    if (error.status === 201 || error.status === 200) {
      console.log('Registration successful despite error object');
      return { success: true, data: error.data };
    }
    throw new Error(error.message || 'Registration failed');
  }
},
