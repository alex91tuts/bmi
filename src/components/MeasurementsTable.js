import React, { useState, useEffect } from 'react';
import { RiEditLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri';
import { supabase } from '../supabaseClient';
import MeasurementDialog from './MeasurementDialog';

const MeasurementsTable = () => {
  const [measurements, setMeasurements] = useState([]);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchMeasurements();
    fetchMeasurementTypes();
    fetchUsers();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const { data, error } = await supabase
        .from('measurements')
        .select(`
          *,
          measurement_types (
            name
          )
        `)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      setMeasurements(data || []);
    } catch (error) {
      console.error('Error fetching measurements:', error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const fetchMeasurementTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('measurement_types')
        .select('*');

      if (error) throw error;
      setMeasurementTypes(data || []);
    } catch (error) {
      console.error('Error fetching measurement types:', error.message);
    }
  };

  const handleAddMeasurement = () => {
    setSelectedMeasurement(null);
    setDialogOpen(true);
  };

  const handleEditMeasurement = (measurement) => {
    setSelectedMeasurement(measurement);
    setDialogOpen(true);
  };

  const handleDeleteMeasurement = async (measurementId) => {
    try {
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', measurementId);

      if (error) throw error;
      fetchMeasurements();
    } catch (error) {
      console.error('Error deleting measurement:', error.message);
    }
  };

  const handleSaveMeasurement = async (formData) => {
    try {
      if (selectedMeasurement) {
        const { error } = await supabase
          .from('measurements')
          .update({
            measurement_type_id: formData.measurement_type_id,
            value: parseFloat(formData.value),
            measurement_date: formData.measurement_date,
            unit: formData.unit,
            user_id: formData.user_id
          })
          .eq('id', selectedMeasurement.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('measurements')
          .insert([{
            measurement_type_id: formData.measurement_type_id,
            value: parseFloat(formData.value),
            measurement_date: formData.measurement_date,
            unit: formData.unit,
            user_id: formData.user_id
          }]);

        if (error) throw error;
      }

      fetchMeasurements();
    } catch (error) {
      console.error('Error saving measurement:', error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Measurements History</h2>
        <button
          onClick={handleAddMeasurement}
          className="flex items-center px-4 py-2 rounded-md text-white gradient-bg hover:opacity-90"
        >
          <RiAddLine className="mr-2" />
          Add Measurement
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {measurements.map((measurement) => (
                <tr key={measurement.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(measurement.measurement_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {measurement.measurement_types.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {measurement.value} {measurement.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditMeasurement(measurement)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <RiEditLine className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeasurement(measurement.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <RiDeleteBinLine className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MeasurementDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        measurement={selectedMeasurement}
        measurementTypes={measurementTypes}
        users={users}
        onSave={handleSaveMeasurement}
      />
    </div>
  );
};

export default MeasurementsTable;
