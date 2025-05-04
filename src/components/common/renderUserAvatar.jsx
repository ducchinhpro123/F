import { useAuth } from '../../context/AuthContext';

const RenderUserAvatar = () => {
  const { user } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`;
    }
    return names[0].charAt(0);
  };

  if (user?.avatar) {
    return (
      <img
        src={`http://localhost:3000${user.avatar}`}
        alt={user.name || 'User'}
        className="user-avatar-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<span>${getUserInitials()}</span>`;
        }}
      />
    );
  }

  return <span>{getUserInitials()}</span>;
};

export default RenderUserAvatar;
