import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import "./CustomersEdit.css";

const API_BASE_URL = "http://localhost:3000";

export default function CustomersEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    name: "",
    role: "user",
  });
  const [avatarPreview, setAvatarPreview] = useState(null); // Avatar Preview
  const [avatarFile, setAvatarFile] = useState(null); // Avatar file khi người dùng chọn ảnh mới
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data including avatar when the component mounts
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/user/${id}`);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to fetch user data: ${response.status} ${errorData}`);
        }
        const data = await response.json();

        // Set avatar preview from the current user's avatar if available
        if (data.avatar) {
          setAvatarPreview(`${API_BASE_URL}/avatars/${data.avatar.split('/').pop()}`); // Sử dụng split và pop để lấy tên file
        } else {
          setAvatarPreview(null); // Set to null if no avatar exists
        }

        // Set the rest of the user data
        setUser({
          username: data.username || "",
          name: data.name || "",
          role: data.role || "user",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, role: e.target.value }));
  };

  // Handle file input change for avatar update
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Save the selected avatar file
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Update avatar preview with the new image
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("role", user.role);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append new avatar if selected
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${response.status} ${errorText}`);
      }

      navigate(`/customers/${id}`); // Redirect to the user's detail page after update
    } catch (err) {
      setError(`Update failed: ${err.message}`);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page if cancel is clicked
  };

  if (loading) return <p className="loading-text">Loading user data...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="edit-container">
      <Card className="edit-card">
        <CardContent>
          <h2 className="edit-title">Edit Customer</h2>
          {error && <p className="error-text form-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={user.username}
                disabled
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="form-group select-role">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={handleRoleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Avatar */}
            <div className="form-group">
              <Label htmlFor="avatar">Avatar (Optional)</Label>
              <div className="avatar-row">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="avatar-input"
                />
                {avatarPreview && (
                  <div className="avatar-preview-wrapper">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="avatar-preview"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
