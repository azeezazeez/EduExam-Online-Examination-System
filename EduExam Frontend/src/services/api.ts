import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, Loader2, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await api.login(formData);
        console.log('Login response:', response);
        
        if (response.success) {
          success('Welcome back! Logging you in...');
          
          // Small delay to ensure toast is shown before navigation
          setTimeout(() => {
            // Check if payment is completed
            const user = api.getCurrentUser();
            console.log('Current user after login:', user);
            
            if (user && user.paymentStatus) {
              navigate('/exam');
            } else {
              // If payment not completed, redirect to payment
              navigate('/payment');
            }
          }, 500);
        }
      } catch (error: any) {
        console.error('Login error details:', error);
        
        // Handle specific error messages from backend
        if (error.message === 'User not found') {
          toastError('Username not found. Please register first.');
        } else if (error.message === 'Invalid password') {
          toastError('Incorrect password. Please try again.');
        } else {
          toastError(error.message || 'Invalid credentials. Please check your username and password.');
        }
        
        setErrors({ submit: error.message || 'Login failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20"
            >
              <LogIn size={32} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-xs font-medium">Login to your student dashboard</p>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-[40px]" />
          </div>

          <div className="p-8 md:p-10">
            {errors.submit && (
              <div className="mb-6 p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl">
                <p className="text-rose-600 text-xs font-medium text-center">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="text"
                      className={`w-full pl-14 pr-5 py-3.5 rounded-2xl border-2 transition-all font-bold text-sm placeholder:text-slate-300 tracking-widest
                        ${errors.username ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-14 pr-12 py-3.5 rounded-2xl border-2 transition-all font-bold text-sm placeholder:text-slate-300 tracking-widest
                        ${errors.password ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Logging in...
                  </>
                ) : (
                  <>
                    Start Examination
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <div className="flex flex-col items-center gap-4 pt-8 border-t border-slate-100">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  Don't have an account?
                </p>
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  disabled={isSubmitting}
                  className="text-indigo-600 px-6 py-2 rounded-xl border border-slate-100 font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                >
                  Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
