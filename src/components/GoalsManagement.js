import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import GoalDialog from './GoalDialog';

const GoalsManagement = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [users, setUsers] = useState([]);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [goalsResponse, usersResponse, typesResponse] = await Promise.all([
        supabase
          .from('goals')
          .select(`
            *,
            users (name, email),
            measurement_types (name, unit)
          `),
        supabase.from('users').select('*'),
        supabase.from('measurement_types').select('*')
      ]);

      if (goalsResponse.error) throw goalsResponse.error;
      if (usersResponse.error) throw usersResponse.error;
      if (typesResponse.error) throw typesResponse.error;

      setGoals(goalsResponse.data || []);
      setUsers(usersResponse.data || []);
      setMeasurementTypes(typesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.filter(goal => goal.id !== goalId));
      showSnackbar('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error.message);
      showSnackbar('Error deleting goal', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">
              Goals
            </h1>
            <button
              onClick={() => {
                setSelectedGoal(null);
                setDialogOpen(true);
              }}
              className="px-4 py-2 rounded-md text-white gradient-bg hover:opacity-90 flex items-center"
            >
              <RiAddLine className="mr-2" />
              Adauga
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {goal.measurement_types.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {goal.users.name || goal.users.email}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDialogOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <RiEditLine className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Goal Value:</span>
                  <span className="text-sm font-semibold">
                    {goal.goal_value} {goal.measurement_types.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <span className="text-sm font-semibold capitalize">
                    {goal.goal_type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {dialogOpen && (
        <GoalDialog
          open={dialogOpen}
          handleClose={() => {
            setDialogOpen(false);
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          users={users}
          measurementTypes={measurementTypes}
          onSave={() => {
            fetchData();
            setDialogOpen(false);
            setSelectedGoal(null);
            showSnackbar(selectedGoal ? 'Goal updated successfully' : 'Goal added successfully');
          }}
        />
      )}
    </div>
  );
};

export default GoalsManagement;
