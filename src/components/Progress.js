import React, { useState, useEffect } from 'react';
import MeasurementDialog from '../components/MeasurementDialog';
import MeasurementTypeCard from './MeasurementTypeCard';
import { supabase } from '../supabaseClient';

const Progress = () => {
  const [measurements, setMeasurements] = useState([]);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedUserId]);

  const reorderMeasurementTypes = (types, userId) => {
    return types.sort((a, b) => {
      const orderA = a.display_order?.[userId] || Number.MAX_SAFE_INTEGER;
      const orderB = b.display_order?.[userId] || Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  };

  const fetchData = async () => {
    try {
      const [usersResponse, typesResponse] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('measurement_types').select('*')
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (typesResponse.error) throw typesResponse.error;

      const userData = usersResponse.data || [];
      setUsers(userData);
      
      const types = typesResponse.data || [];
      const orderedTypes = reorderMeasurementTypes(types, selectedUserId);
      setMeasurementTypes(orderedTypes);

      // Set initial selected user if none is selected
      if (userData.length > 0) {
        const newSelectedId = selectedUserId || userData[0].id;
        setSelectedUserId(newSelectedId);
        
        // Fetch goals for the selected user
        if (newSelectedId) {
          const { data: goalsData, error: goalsError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', newSelectedId);
            
          if (goalsError) throw goalsError;
          setGoals(goalsData || []);
        }
      }

      if (selectedUserId) {
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('measurements')
          .select('*, measurement_types(name, unit)')
          .eq('user_id', selectedUserId)
          .order('measurement_date', { ascending: false });

        if (measurementsError) throw measurementsError;
        setMeasurements(measurementsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">
              Progress
            </h1>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-[#833AB4] focus:ring-[#833AB4] sm:text-sm h-10 px-3"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email || user.id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 pb-24">
          <div className="grid grid-cols-2 gap-4 [&>*:first-child]:col-span-2">
            {measurementTypes.map((type) => (
                        <MeasurementTypeCard
                          key={type.id}
                          type={type}
                          measurements={measurements}
                          goal={goals.find(g => g.measurement_type_id === type.id)}
                          onAddClick={(typeId) => {
                            const type = measurementTypes.find(t => t.id === typeId);
                            setSelectedType(type);
                            setDialogOpen(true);
                          }}
                          onEditMeasurement={(measurement) => {
                            setSelectedType(measurementTypes.find(t => t.id === measurement.measurement_type_id));
                            setDialogOpen(true);
                            setSelectedMeasurement(measurement);
                          }}
                          onDeleteMeasurement={async (measurementId) => {
                            try {
                              const { error } = await supabase
                                .from('measurements')
                                .delete()
                                .eq('id', measurementId);
                              
                              if (error) throw error;
                              fetchData();
                            } catch (error) {
                              console.error('Error deleting measurement:', error.message);
                            }
                          }}
                        />
            ))}
          </div>
      </div>

      <MeasurementDialog
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false);
          setSelectedType(null);
        }}
        measurement={selectedMeasurement}
        measurementTypes={measurementTypes}
        users={users}
        selectedUserId={selectedUserId}
        selectedTypeId={selectedType?.id}
        onSave={async (formData) => {
          try {
            if (selectedMeasurement) {
              const { error } = await supabase
                .from('measurements')
                .update({
                  value: parseFloat(formData.value),
                  measurement_date: formData.measurement_date,
                })
                .eq('id', selectedMeasurement.id);

              if (error) throw error;
            } else {
              const { error } = await supabase
                .from('measurements')
                .insert([{
                  measurement_type_id: selectedType.id,
                  value: parseFloat(formData.value),
                  measurement_date: formData.measurement_date,
                  unit: selectedType.unit,
                  user_id: selectedUserId
                }]);

              if (error) throw error;
            }
            fetchData();
          } catch (error) {
            console.error('Error saving measurement:', error.message);
          }
          setDialogOpen(false);
          setSelectedType(null);
          setSelectedMeasurement(null);
        }}
      />
    </div>
  );
};

export default Progress;
