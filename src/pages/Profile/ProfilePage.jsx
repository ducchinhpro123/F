import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AvatarUpload from './AvatarUpload';
import './Profile.css';

const ProfilePage = () => {
  const { user, updateUserProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
  });
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }
    
    try {
      await updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <AvatarUpload 
            currentAvatar={user.avatar} 
            username={user.username} 
          />
        </div>
        
        <div className="profile-details">
          <h2>Personal Information</h2>
          
          {formError && <div className="auth-error">{formError}</div>}
          {success && <div className="auth-success">{success}</div>}
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={user.username}
                disabled
                className="disabled-input"
              />
              <small>Username cannot be changed</small>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
