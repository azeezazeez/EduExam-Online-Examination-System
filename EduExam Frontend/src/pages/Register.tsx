import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, GraduationCap, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    city: '',
    state: '',
    education: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetchPincodeData(formData.pincode);
    }
  }, [formData.pincode]);

  const fetchPincodeData = async (pin: string) => {
    setLoadingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          city: postOffice.district,
          state: postOffice.State,
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode:', error);
    } finally {
      setLoadingPincode(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Username is required';
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      } else if (formData.email.length > 254) {
        newErrors.email = 'Email address is too long';
      }
    }

    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';
    if (!formData.education) newErrors.education = 'Education is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await api.register(formData);
        navigate('/payment');
      } catch (error) {
        setErrors({ submit: 'Registration failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Hero */}
        <div className="bg-indigo-600 md:w-2/5 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/30">
              <GraduationCap size={28} />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Start Your Future Today.</h2>
            <p className="opacity-80 text-lg font-medium">Join thousands of students in our professional examination platform.</p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-black shadow-lg">1</div>
              <div>
                <p className="font-bold">Registration</p>
                <p className="text-xs opacity-60">Personal & Academic details</p>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black border border-white/30">2</div>
              <div>
                <p className="font-bold">Payment</p>
                <p className="text-xs opacity-60">Secure exam fee processing</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute top-12 -right-12 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        {/* Right Side - Form */}
        <div className="p-6 md:p-8 md:w-3/5 overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="mb-6">
            <h3 className="text-3xl font-black text-slate-800 mb-1">Create Account</h3>
            <p className="text-slate-400 font-medium">Please fill in your information below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    className={`w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 ${errors.username ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                {errors.username && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="email"
                    className={`w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 ${errors.email ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-12 pr-12 py-2.5 rounded-2xl border-2 ${errors.password ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full pl-12 pr-12 py-2.5 rounded-2xl border-2 ${errors.confirmPassword ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    maxLength={6}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 ${errors.pincode ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                    placeholder="123456"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  />
                  {loadingPincode && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {errors.pincode && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.pincode}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-5 py-2.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                  value={formData.city || 'Auto-filled'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-5 py-2.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                  value={formData.state || 'Auto-filled'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education Qualification</label>
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <select
                  className={`w-full pl-12 pr-10 py-2.5 rounded-2xl border-2 ${errors.education ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium appearance-none`}
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                >
                  <option value="">Select Qualification</option>
                  <option value="10th">10th Standard</option>
                  <option value="12th">12th Standard / HSC</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate (Bachelors)</option>
                  <option value="Postgraduate">Postgraduate (Masters)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowRight size={18} className="rotate-90" />
                </div>
              </div>
              {errors.education && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.education}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 mt-4 shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight size={22} />
                </>
              )}
            </button>
            
            <p className="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              By continuing, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> <br /> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </p>
          </form>
          
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
            <p className="text-slate-400 font-medium text-sm">
              Already have an account? <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">Sign In</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
