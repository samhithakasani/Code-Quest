import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BookOpen, Trophy, Settings, User, Code2, ChevronRight } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/quizzes', icon: <BookOpen size={20} />, label: 'Quizzes' },
    { to: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/quizzes', icon: <BookOpen size={20} />, label: 'Manage Quizzes' },
    { to: '/admin/questions', icon: <Code2 size={20} />, label: 'Question Bank' },
    { to: '/admin/users', icon: <User size={20} />, label: 'Users' },
    { to: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><Code2 size={22} /></div>
        <span className="brand-name">CodeQuest</span>
      </div>
      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <span className={`user-badge ${user?.role}`}>{user?.role}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {link.icon}<span>{link.label}</span><ChevronRight size={14} className="nav-arrow" />
          </NavLink>
        ))}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} /><span>Logout</span>
      </button>
    </aside>
  );
}
