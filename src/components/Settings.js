import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiUser3Line, RiNotification3Line, RiRulerLine } from 'react-icons/ri';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text">
          Settings
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 mb-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="divide-y">
            <button
              onClick={() => navigate('/settings/users')}
              className="w-full px-4 py-4 flex items-center hover:bg-gray-50"
            >
              <RiUser3Line className="text-2xl text-[#833AB4] mr-4" />
              <div>
                <div className="font-medium">User Management</div>
                <div className="text-sm text-gray-500">
                  Manage user profiles and permissions
                </div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/settings/measurement-types')}
              className="w-full px-4 py-4 flex items-center hover:bg-gray-50"
            >
              <RiRulerLine className="text-2xl text-[#E1306C] mr-4" />
              <div>
                <div className="font-medium">Measurement Types</div>
                <div className="text-sm text-gray-500">
                  Manage measurement types and units
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/settings/goals')}
              className="w-full px-4 py-4 flex items-center hover:bg-gray-50"
            >
              <RiNotification3Line className="text-2xl text-[#F77737] mr-4" />
              <div>
                <div className="font-medium">Goals</div>
                <div className="text-sm text-gray-500">
                  Set and manage measurement goals
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
