import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Exam from './pages/Exam';
import Result from './pages/Result';
import CertificatePage from './pages/CertificatePage';
import './styles/main.css';

export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/result" element={<Result />} />

        {/* Certificate page */}
        <Route path="/certificate" element={<CertificatePage />} />

        <Route path="/" element={<Navigate to="/register" replace />} />

      </Routes>
    </Router>
  );
}
