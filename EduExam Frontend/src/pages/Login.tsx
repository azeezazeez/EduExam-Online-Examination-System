import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.usernameOrEmail) newErrors.usernameOrEmail = 'Username or Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (validate()) {
      setLoading(true);
      
      try {
        const response = await api.login(formData);
        
        if (response.success) {
          // Navigate based on payment status
          if (response.data.paymentStatus) {
            navigate('/exam');
          } else {
            navigate('/payment');
          }
        }
      } catch (err: any) {
        setServerError(err.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-indigo-600 p-12 text-white text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 relative z-10">
            <LogIn size={40} />
          </div>
          <h2 className="text-3xl font-black mb-2 relative z-10 tracking-tight">Welcome Back</h2>
          <p className="opacity-80 font-medium relative z-10">Login to your student dashboard</p>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full" />
        </div>

        <div className="p-10">
          {serverError && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl">
              <p className="text-rose-600 text-sm font-medium text-center">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Username or Email
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${
                    errors.usernameOrEmail 
                      ? 'border-rose-100 bg-rose-50/30' 
                      : 'border-slate-100 bg-slate-50/50'
                  } focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                  placeholder="Enter your username or email"
                  value={formData.usernameOrEmail}
                  onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                  disabled={loading}
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.usernameOrEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="password"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${
                    errors.password 
                      ? 'border-rose-100 bg-rose-50/30' 
                      : 'border-slate-100 bg-slate-50/50'
                  } focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'
              } mt-4`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                'Start Examination'
              )}
            </button>

            <p className="text-center text-slate-400 font-medium text-sm pt-4">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-indigo-600 font-bold hover:underline"
                disabled={loading}
              >
                Register Now
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;