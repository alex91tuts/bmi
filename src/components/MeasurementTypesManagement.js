import React, { useState, useEffect } from 'react';
import { RiEditLine, RiDeleteBinLine, RiArrowLeftLine, RiAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import MeasurementTypeDialog from './MeasurementTypeDialog';

const MeasurementTypesManagement = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('measurement_types')
        .select('*');

      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error('Error fetching measurement types:', error.message);
      showSnackbar('Error fetching measurement types', 'error');
    }
  };

  const handleAddType = () => {
    setSelectedType(null);
    setDialogOpen(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type);
    setDialogOpen(true);
  };

  const handleDeleteType = async (typeId) => {
    try {
      const { error } = await supabase
        .from('measurement_types')
        .delete()
        .eq('id', typeId);

      if (error) throw error;

      showSnackbar('Measurement type deleted successfully');
      fetchTypes();
    } catch (error) {
      console.error('Error deleting measurement type:', error.message);
      showSnackbar('Error deleting measurement type', 'error');
    }
  };

  const handleSaveType = async (formData) => {
    try {
      if (selectedType) {
        // Update existing type
        const { error } = await supabase
          .from('measurement_types')
          .update({
            name: formData.name,
            unit: formData.unit,
            description: formData.description
          })
          .eq('id', selectedType.id);

        if (error) throw error;
        showSnackbar('Measurement type updated successfully');
      } else {
        // Create new type
        const { error } = await supabase
          .from('measurement_types')
          .insert([{
            name: formData.name,
            unit: formData.unit,
            description: formData.description
          }]);

        if (error) throw error;
        showSnackbar('Measurement type created successfully');
      }

      fetchTypes();
    } catch (error) {
      console.error('Error saving measurement type:', error.message);
      showSnackbar('Error saving measurement type', 'error');
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
              Măsurători
            </h1>
          </div>
          <button
            onClick={handleAddType}
            className="flex items-center px-4 py-2 rounded-md text-white gradient-bg hover:opacity-90"
          >
            <RiAddLine className="mr-2" />
            Adaugă
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {types.map((type) => (
            <div key={type.id} className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Unit: {type.unit}</p>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditType(type)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RiEditLine className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDeleteType(type.id)}
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

      <MeasurementTypeDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        type={selectedType}
        onSave={handleSaveType}
      />

    </div>
  );
};

export default MeasurementTypesManagement;
