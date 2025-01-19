import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiBarChartLine, RiSettings3Line } from 'react-icons/ri';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
    { path: '/progress', label: 'Progress', icon: RiBarChartLine },
    { path: '/settings', label: 'Settings', icon: RiSettings3Line },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="gradient-bg">
        <div className="flex justify-around">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center py-2 px-4 w-full ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon className="text-2xl" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
