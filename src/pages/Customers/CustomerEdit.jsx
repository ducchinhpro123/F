import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../../services/customerService';

const CustomerEdit = () => {
  console.log("Customer edit");
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null); // new state for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCustomerById(id);
        if (response._id) {
          setFormData({
            name: response.name,
            role: response.role
          });
          // Optionally set preview if an avatar already exists
          if(response.avatar) {
            setAvatarPreview(`http://localhost:3000${response.avatar}`);
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Tạo FormData
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      if (formData.avatarFile) {
        formDataToSend.append('avatar', formData.avatarFile); // Đảm bảo tên trường là 'avatar'
      }

      // Gọi API với FormData
      const response = await updateCustomer(id, formDataToSend);
      if (response.success) {
        navigate('/customers');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Edit User Information</h4>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {/* Show avatar preview if available */}
          {avatarPreview && (
            <div className="mb-3 text-center">
              <img src={avatarPreview} alt="Avatar Preview" style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover'}} />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Avatar</label>
              <input
                type="file"
                className="form-control"
                name="avatar"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData(prev => ({
                    ...prev,
                    avatarFile: file // store file separately
                  }));
                  if (file) {
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>


            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>


            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/customers')}
              >
                ← Back
              </button>

              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;
