import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { RiScalesLine } from 'react-icons/ri';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, measurementsResponse] = await Promise.all([
        supabase.from('users').select('*'),
        supabase
          .from('measurements')
          .select('*, measurement_types(name)')
          .eq('measurement_types.name', 'Greutate')
          .order('measurement_date', { ascending: false })
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (measurementsResponse.error) throw measurementsResponse.error;

      setUsers(usersResponse.data || []);
      setMeasurements(measurementsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">
            Tracker
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 mb-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Weight Cards for Each User */}
          {users.map(user => {
            const userMeasurements = measurements.filter(m => m.user_id === user.id);
            const latestMeasurement = userMeasurements[0];
            const previousMeasurement = userMeasurements[1];
            
            const change = latestMeasurement && previousMeasurement
              ? (latestMeasurement.value - previousMeasurement.value).toFixed(1)
              : null;

            return (
              <div key={user.id} className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center mb-2">
                  <RiScalesLine className="mr-2 text-[#833AB4] text-xl" />
                  <h2 className="text-base font-semibold">{user.name}</h2>
                </div>
                <p className="text-xl font-bold">
                  {latestMeasurement ? `${latestMeasurement.value} kg` : 'No data'}
                </p>
                {change && (
                  <p className="text-sm text-gray-600">
                    {change > 0 ? '+' : ''}{change} kg
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
