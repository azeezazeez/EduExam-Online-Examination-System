import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Exam from './pages/Exam';
import Result from './pages/Result';
import './styles/main.css';

// Optional: Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Optional: Public Route Component (redirects to exam if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
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
          
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
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
          
          {/* Catch-all Route - 404 Not Found */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
