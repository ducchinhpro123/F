import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile, updateUserProfile as apiUpdateProfile, uploadUserAvatar as apiUploadAvatar } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({ username, password });
      
      if (response.success) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      if (response.success) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserProfile();
      
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred fetching user profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiUpdateProfile(profileData);
      
      if (response.success) {
        // Update user in state and localStorage
        const updatedUser = {...user, ...response.user};
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred updating user profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiUploadAvatar(formData);
      
      if (response.success) {
        // Update user in state and localStorage with new avatar
        const updatedUser = {...user, ...response.user};
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error(response.message || 'Failed to upload avatar');
      }
    } catch (err) {
      setError(err.message || 'An error occurred uploading avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      signup, 
      logout,
      fetchUserProfile,
      updateUserProfile,
      uploadAvatar,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
