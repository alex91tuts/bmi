import React, { useState, useEffect } from 'react';

const MeasurementDialog = ({ open, handleClose, measurement, measurementTypes, users, selectedUserId, selectedTypeId, onSave }) => {
  const [formData, setFormData] = useState({
    measurement_type_id: '',
    value: '',
    measurement_date: new Date().toISOString().split('T')[0],
    unit: '',
    user_id: ''
  });

  useEffect(() => {
    if (measurement) {
      setFormData({
        measurement_type_id: measurement.measurement_type_id,
        value: measurement.value,
        measurement_date: measurement.measurement_date,
        unit: measurement.unit,
        user_id: measurement.user_id
      });
    } else {
      const typeId = selectedTypeId || measurement?.measurement_type_id || measurementTypes[0]?.id || '';
      setFormData({
        measurement_type_id: typeId,
        value: '',
        measurement_date: new Date().toISOString().split('T')[0],
        unit: measurementTypes.find(t => t.id === typeId)?.unit || '',
        user_id: selectedUserId || measurement?.user_id || users[0]?.id || ''
      });
    }
  }, [measurement, measurementTypes, selectedTypeId, selectedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              {measurement ? 'Edit Measurement' : 'Add New Measurement'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <div>
                  <label htmlFor="measurement_date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="measurement_date"
                    name="measurement_date"
                    required
                    value={formData.measurement_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#833AB4] focus:ring-[#833AB4] sm:text-sm h-8 px-3"
                  />
                </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                    User
                  </label>
                  <select
                    id="user_id"
                    name="user_id"
                    required
                    value={formData.user_id}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#833AB4] focus:ring-[#833AB4] sm:text-sm h-8"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email || user.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="measurement_type_id" className="block text-sm font-medium text-gray-700">
                    Measurement Type
                  </label>
                  <select
                    id="measurement_type_id"
                    name="measurement_type_id"
                    required
                    value={formData.measurement_type_id}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#833AB4] focus:ring-[#833AB4] sm:text-sm h-8"
                  >
                    {measurementTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="value"
                    name="value"
                    required
                    value={formData.value}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#833AB4] focus:ring-[#833AB4] sm:text-sm h-8 px-3"
                  />
                </div>
              </div>
              <div className="mt-8 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#833AB4] sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 gradient-bg text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#833AB4] sm:text-sm"
                >
                  {measurement ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementDialog;
