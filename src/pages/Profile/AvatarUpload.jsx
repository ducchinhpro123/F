import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const AvatarUpload = ({ currentAvatar, username }) => {
  const { uploadAvatar, loading } = useAuth();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const file = fileInputRef.current.files[0];
    if (!file) {
      setError('Please select an image to upload');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      await uploadAvatar(formData);
      setSuccess('Avatar updated successfully!');
      // Reset preview and file input after successful upload
      setPreview(null);
      fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="avatar-upload-container">
      <div className="avatar-preview">
        <img 
          src={preview || `http://localhost:3000${currentAvatar}`} 
          alt={username} 
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150?text=Avatar';
          }}
        />
      </div>
      
      {error && <div className="avatar-error">{error}</div>}
      {success && <div className="avatar-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="avatar-form">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="avatar-input"
          hidden
        />
        
        <div className="avatar-buttons">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleClickUpload}
          >
            Select Image
          </button>
          
          {preview && (
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Avatar'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AvatarUpload;
