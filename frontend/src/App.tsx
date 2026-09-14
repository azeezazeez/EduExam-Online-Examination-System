import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Exam from './pages/Exam';
import Result from './pages/Result';
import './styles/main.css';

// ✅ Fixed: check 'currentUser' and 'userId' — the keys api.ts actually sets
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = localStorage.getItem('currentUser');
  const userId = localStorage.getItem('userId');

  if (!currentUser || !userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ✅ Fixed: same keys here too
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = localStorage.getItem('currentUser');
  const userId = localStorage.getItem('userId');

  if (currentUser && userId) {
    return <Navigate to="/exam" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Payment is after register — user exists but hasn't paid yet.
              PublicRoute would redirect them away, so no wrapper here. */}
          <Route path="/payment" element={<Payment />} />

          {/* Protected Routes */}
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
