import React from 'react';
import { 
  Route,
  createRoutesFromElements,
  createHashRouter,
  RouterProvider 
} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';
import MeasurementTypesManagement from './components/MeasurementTypesManagement';
import Progress from './components/Progress';
import GoalsManagement from './components/GoalsManagement';

const AppLayout = ({ children }) => {
  const location = window.location.pathname;
  return (
    <div className="min-h-screen bg-white">
      {children}
      {location !== '/' && <BottomNav />}
    </div>
  );
};

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/add" element={<AppLayout><div>Add Measurement (Coming Soon)</div></AppLayout>} />
      <Route path="/progress" element={<AppLayout><Progress /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="/settings/users" element={<AppLayout><UserManagement /></AppLayout>} />
      <Route path="/settings/measurement-types" element={<AppLayout><MeasurementTypesManagement /></AppLayout>} />
      <Route path="/settings/goals" element={<AppLayout><GoalsManagement /></AppLayout>} />
    </>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
