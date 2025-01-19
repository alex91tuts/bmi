import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const GoalDialog = ({ open, handleClose, goal, users, measurementTypes, onSave }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    measurement_type_id: '',
    goal_value: '',
    goal_type: 'increase'
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        user_id: goal.user_id,
        measurement_type_id: goal.measurement_type_id,
        goal_value: goal.goal_value,
        goal_type: goal.goal_type
      });
    } else {
      setFormData({
        user_id: users[0]?.id || '',
        measurement_type_id: measurementTypes[0]?.id || '',
        goal_value: '',
        goal_type: 'increase'
      });
    }
  }, [goal, users, measurementTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const goalData = {
        user_id: formData.user_id,
        measurement_type_id: formData.measurement_type_id,
        goal_value: parseFloat(formData.goal_value),
        goal_type: formData.goal_type
      };

      if (goal) {
        const { error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', goal.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals')
          .insert([goalData]);

        if (error) throw error;
      }

      onSave();
      handleClose();
    } catch (error) {
      console.error('Error saving goal:', error.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">
          {goal ? 'Edit Goal' : 'Add New Goal'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User
              </label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Measurement Type
              </label>
              <select
                value={formData.measurement_type_id}
                onChange={(e) => setFormData({ ...formData, measurement_type_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                {measurementTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goal Value
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.goal_value}
                onChange={(e) => setFormData({ ...formData, goal_value: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goal Type
              </label>
              <select
                value={formData.goal_type}
                onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="increase">Increase</option>
                <option value="decrease">Decrease</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gradient-bg hover:opacity-90"
            >
              {goal ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalDialog;
