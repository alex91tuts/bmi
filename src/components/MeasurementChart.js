import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';

const MeasurementChart = ({ 
  open, 
  handleClose, 
  measurements = [], 
  type = {}, 
  goal = null,
  onEditMeasurement,
  onDeleteMeasurement
}) => {
  const sortedMeasurements = useMemo(() => {
    if (!measurements || measurements.length === 0) return [];
    return [...measurements]
      .sort((a, b) => new Date(a.measurement_date) - new Date(b.measurement_date))
      .map(m => ({
        ...m,
        date: new Date(m.measurement_date).toLocaleDateString(),
        value: parseFloat(m.value)
      }));
  }, [measurements]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="h-full flex flex-col bg-white">
        <div className="bg-white px-4 py-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Progres {type.name} 
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto pb-20">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={sortedMeasurements.slice(-30)}
                margin={{ top: 20, right: 4, left: -40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 8 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('ro-RO', { 
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit'
                    });
                  }}
                  interval="preserveStartEnd"
                  height={20}
                />
                <YAxis 
                  tick={{ fontSize: 8 }}
                />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#833AB4"
                />
                {goal && (
                  <ReferenceLine
                    y={goal.goal_value}
                    stroke="#E1306C"
                    strokeDasharray="3 3"
                    label={{
                      value: ``,
                      position: 'right',
                      fill: '#E1306C'
                    }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Min</h4>
              <p className="text-md font-bold text-gray-900 mt-1">
                {Math.min(...sortedMeasurements.map(m => m.value))} {type.unit}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Max</h4>
              <p className="text-md font-bold text-gray-900 mt-1">
                {Math.max(...sortedMeasurements.map(m => m.value))} {type.unit}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total {goal?.goal_type === 'decrease' ? 'Loss' : 'Gain'}</h4>
              <p className="text-md font-bold text-gray-900 mt-1">
                {(sortedMeasurements[sortedMeasurements.length - 1]?.value - sortedMeasurements[0]?.value).toFixed(1)} {type.unit}
              </p>
            </div>
          </div>

          {goal && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h4 className="text-sm font-medium text-gray-500">Goal Status</h4>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progres</span>
                  <span className="text-sm font-medium">
                    {goal.goal_value} {type.unit} ({goal.goal_type})
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      (goal.goal_type === 'increase' && sortedMeasurements[sortedMeasurements.length - 1]?.value >= goal.goal_value) ||
                      (goal.goal_type === 'decrease' && sortedMeasurements[sortedMeasurements.length - 1]?.value <= goal.goal_value)
                        ? 'bg-green-500'
                        : 'bg-[#833AB4]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs((goal.goal_type === 'increase' 
                        ? (sortedMeasurements[sortedMeasurements.length - 1]?.value / goal.goal_value) 
                        : (goal.goal_value / sortedMeasurements[sortedMeasurements.length - 1]?.value)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Istoric</h4>
            <div className="bg-white rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valoare</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedMeasurements.map((measurement, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(measurement.measurement_date).toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {measurement.value} {type.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button 
                          className="text-[#833AB4] hover:text-[#833AB4]/80 mr-3"
                          onClick={() => onEditMeasurement(measurement)}
                        >
                          <RiEditLine className="text-lg" />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => onDeleteMeasurement(measurement.id)}
                        >
                          <RiDeleteBinLine className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default MeasurementChart;
