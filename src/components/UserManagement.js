import React, { useState, useEffect } from 'react';
import { RiEditLine, RiDeleteBinLine, RiArrowLeftLine, RiAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UserDialog from './UserDialog';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      showSnackbar('Error fetching users', 'error');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      showSnackbar('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.message);
      showSnackbar('Error deleting user', 'error');
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            name: formData.name,
            email: formData.email
          })
          .eq('id', selectedUser.id);

        if (error) throw error;
        showSnackbar('User updated successfully');
      } else {
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert([{
            name: formData.name,
            email: formData.email
          }]);

        if (error) throw error;
        showSnackbar('User created successfully');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error.message);
      showSnackbar('Error saving user', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/settings')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <RiArrowLeftLine className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold gradient-text">
              Users
            </h1>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center px-4 py-2 rounded-md text-white gradient-bg hover:opacity-90"
          >
            <RiAddLine className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RiEditLine className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />

    </div>
  );
};

export default UserManagement;
