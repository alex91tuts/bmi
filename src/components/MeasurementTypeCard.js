import React, { useState } from 'react';
import MeasurementChart from './MeasurementChart';
import { RiAddLine, RiLineChartLine } from 'react-icons/ri';

const MeasurementTypeCard = ({ type, measurements, goal, onAddClick, onEditMeasurement, onDeleteMeasurement }) => {
  const [chartOpen, setChartOpen] = useState(false);
  const typeMeasurements = measurements
    .filter(m => m.measurement_type_id === type.id)
    .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date));
  
  const latestMeasurement = typeMeasurements[0];
  const previousMeasurement = typeMeasurements[1];
  
  const calculateProgress = () => {
    if (!latestMeasurement || !previousMeasurement) return null;
    const change = ((latestMeasurement.value - previousMeasurement.value) / previousMeasurement.value) * 100;
    return change.toFixed(1);
  };

  const progress = calculateProgress();

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">{type.name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartOpen(true)}
            className="p-1 rounded-full hover:bg-gray-100"
            title="View progress chart"
          >
            <RiLineChartLine className="text-xl text-[#833AB4]" />
          </button>
          <button
            onClick={() => onAddClick(type.id)}
            className="p-1 rounded-full hover:bg-gray-100"
            title="Add measurement"
          >
            <RiAddLine className="text-xl text-[#833AB4]" />
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-3">
        {latestMeasurement ? (
          <>
            <div>
              <p className="text-2xl font-bold text-[#833AB4]">
                {latestMeasurement.value} {type.unit}
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-600">
                  Last: {new Date(latestMeasurement.measurement_date).toLocaleDateString()}
                </p>
                {progress !== null && (
                  <p className={`text-xs font-medium ${
                    goal ? 
                      ((goal.goal_type === 'increase' && parseFloat(progress) >= 0) ||
                       (goal.goal_type === 'decrease' && parseFloat(progress) < 0)
                      ) ? 'text-green-600' : 'text-red-600'
                    : parseFloat(progress) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {progress > 0 ? '+' : ''}{progress}%
                  </p>
                )}
              </div>
            </div>
            {goal && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">{goal.goal_type === 'increase' ? 'Creștere' : 'Descreștere'}</p>
                  <p className="text-xs font-medium">{goal.goal_value} {type.unit}</p>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      (goal.goal_type === 'increase' && latestMeasurement.value >= goal.goal_value) ||
                      (goal.goal_type === 'decrease' && latestMeasurement.value <= goal.goal_value)
                        ? 'bg-green-500'
                        : 'bg-[#833AB4]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs((goal.goal_type === 'increase' 
                        ? (latestMeasurement.value / goal.goal_value) 
                        : (goal.goal_value / latestMeasurement.value)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-600">No measurements</p>
        )}
      </div>
      </div>
      <MeasurementChart
      open={chartOpen}
      handleClose={() => setChartOpen(false)}
      measurements={typeMeasurements}
      type={type}
      goal={goal}
      onEditMeasurement={onEditMeasurement}
      onDeleteMeasurement={onDeleteMeasurement}
      />
    </>
  );
};

export default MeasurementTypeCard;
