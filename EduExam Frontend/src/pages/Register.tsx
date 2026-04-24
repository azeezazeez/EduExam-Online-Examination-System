import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, GraduationCap, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

const Register = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    district: '',
    state: '',
    education: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeManual, setPincodeManual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  // Debounced pincode fetch
  const fetchPincodeData = useCallback(async (pin: string) => {
    // Don't fetch if pin is invalid
    if (!/^\d{6}$/.test(pin)) return;
    
    setLoadingPincode(true);
    setPincodeManual(false);
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if API returned success
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const postOffices = data[0].PostOffice;
        
        // Try to find the main post office or use the first one
        const bestMatch = postOffices.find((po: any) => 
          po.Name === po.District || 
          po.Name.includes('SO') || 
          po.Name.includes('HO')
        ) || postOffices[0];
        
        setFormData(prev => ({
          ...prev,
          district: bestMatch.District || bestMatch.Name.split(' ')[0],
          state: bestMatch.State,
        }));
        
        // Clear any existing errors for these fields
        setErrors(prev => ({ ...prev, district: '', state: '' }));
        success('Location auto-filled successfully!');
      } else {
        // Invalid pincode
        setPincodeManual(true);
        setFormData(prev => ({ ...prev, district: '', state: '' }));
        toastError('Invalid pincode. Please enter your district and state manually.');
      }
    } catch (error) {
      console.error('Pincode API error:', error);
      setPincodeManual(true);
      setFormData(prev => ({ ...prev, district: '', state: '' }));
      toastError('Unable to fetch location. Please enter district and state manually.');
    } finally {
      setLoadingPincode(false);
    }
  }, [success, toastError]);

  // Debounce effect for pincode
  useEffect(() => {
    if (formData.pincode.length === 6) {
      const timer = setTimeout(() => {
        fetchPincodeData(formData.pincode);
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (!pincodeManual && formData.pincode.length > 0 && formData.pincode.length < 6) {
      setFormData(prev => ({ ...prev, district: '', state: '' }));
    }
  }, [formData.pincode, fetchPincodeData, pincodeManual]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) newErrors.username = 'Required';
    else if (formData.username.length < 3) newErrors.username = 'Min 3 characters';

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

    // Updated password validation - minimum 5 characters
    if (!formData.password) newErrors.password = 'Required';
    else if (formData.password.length < 5) newErrors.password = 'Min 5 characters';
    else if (formData.password.length > 50) newErrors.password = 'Max 50 characters';

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.pincode) newErrors.pincode = 'Required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Must be 6 digits';

    if (!formData.district) newErrors.district = 'Enter your district / city';
    if (!formData.state) newErrors.state = 'Enter your state';
    if (!formData.education) newErrors.education = 'Select qualification';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toastError('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    const wakingTimer = setTimeout(() => setServerWaking(true), 5000);

    try {
      const response = await api.register(formData);
      clearTimeout(wakingTimer);
      setServerWaking(false);

      if (response?.success) {
        success('Registration successful! Redirecting to payment...');
        setTimeout(() => navigate('/payment'), 1500);
      } else {
        throw new Error('Unexpected response from server. Please try again.');
      }
    } catch (error: any) {
      clearTimeout(wakingTimer);
      setServerWaking(false);
      toastError(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
      >
        {/* Left Side Panel */}
        <div className="bg-slate-900 md:w-1/3 p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-2xl">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">Exam Portal</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Register your credentials for terminal access.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-600/30">
                1
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Registration</span>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm border border-slate-700">
                2
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Payment</span>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px]" />
        </div>

        {/* Form Content */}
        <div className="p-8 md:p-12 md:w-2/3 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h3>
            <p className="text-slate-400 text-sm font-medium">Please fill in your information below</p>
          </div>

          <AnimatePresence>
            {serverWaking && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4"
              >
                <Loader2 className="animate-spin text-amber-500 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-amber-800 font-black text-xs uppercase tracking-widest">Server Starting Up</p>
                  <p className="text-amber-600 text-xs font-medium mt-0.5">
                    The server is waking from sleep. This may take up to 30 seconds — please wait.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Username"
                icon={<User size={16} />}
                placeholder="johndoe"
                value={formData.username}
                onChange={(v: string) => setFormData({ ...formData, username: v })}
                error={errors.username}
                disabled={isSubmitting}
              />
              <InputField
                label="Email"
                type="email"
                icon={<Mail size={16} />}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(v: string) => setFormData({ ...formData, email: v })}
                error={errors.email}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock size={16} />}
                placeholder="••••••••"
                value={formData.password}
                onChange={(v: string) => setFormData({ ...formData, password: v })}
                error={errors.password}
                hasToggle
                onToggle={() => setShowPassword(!showPassword)}
                showState={showPassword}
                disabled={isSubmitting}
                helperText="Minimum 5 characters"
              />
              <InputField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={<Lock size={16} />}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(v: string) => setFormData({ ...formData, confirmPassword: v })}
                error={errors.confirmPassword}
                hasToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                showState={showConfirmPassword}
                disabled={isSubmitting}
              />
            </div>

            {/* Pincode + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InputField
                label="Pincode"
                icon={<MapPin size={16} />}
                placeholder="123456"
                value={formData.pincode}
                onChange={(v: string) => setFormData({ ...formData, pincode: v.replace(/\D/g, '') })}
                error={errors.pincode}
                loading={loadingPincode}
                maxLength={6}
                disabled={isSubmitting}
              />
              <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-4">
                {/* District */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    District/City{pincodeManual && <span className="text-indigo-400 normal-case font-medium"> (enter manually)</span>}
                  </label>
                  {pincodeManual ? (
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      disabled={isSubmitting}
                      className={`w-full px-5 py-3 rounded-2xl border-2 transition-all font-bold text-sm placeholder:text-slate-300 h-[48px]
                        ${errors.district ? 'border-rose-100 bg-rose-50/30' : 'border-indigo-200 bg-indigo-50/30 focus:border-indigo-500 focus:bg-white'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    />
                  ) : (
                    <div className={`px-5 py-3 rounded-2xl border-2 ${errors.district ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50'} h-[48px] flex items-center`}>
                      {loadingPincode ? (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="animate-spin" size={14} />
                          <span className="text-xs font-medium">Fetching location...</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-bold uppercase text-[11px]">
                          {formData.district || 'Auto-filled from pincode'}
                        </span>
                      )}
                    </div>
                  )}
                  {errors.district && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.district}</p>}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    State{pincodeManual && <span className="text-indigo-400 normal-case font-medium"> (enter manually)</span>}
                  </label>
                  {pincodeManual ? (
                    <input
                      type="text"
                      placeholder="e.g. Telangana"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      disabled={isSubmitting}
                      className={`w-full px-5 py-3 rounded-2xl border-2 transition-all font-bold text-sm placeholder:text-slate-300 h-[48px]
                        ${errors.state ? 'border-rose-100 bg-rose-50/30' : 'border-indigo-200 bg-indigo-50/30 focus:border-indigo-500 focus:bg-white'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    />
                  ) : (
                    <div className={`px-5 py-3 rounded-2xl border-2 ${errors.state ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50'} h-[48px] flex items-center`}>
                      {loadingPincode ? (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="animate-spin" size={14} />
                          <span className="text-xs font-medium">Fetching location...</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-bold uppercase text-[11px]">
                          {formData.state || 'Auto-filled from pincode'}
                        </span>
                      )}
                    </div>
                  )}
                  {errors.state && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.state}</p>}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education Qualification</label>
              <div className="relative">
                <div
                  onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full pl-14 pr-10 py-3.5 rounded-2xl border-2 ${errors.education ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus-within:border-indigo-500 focus-within:bg-white transition-all duration-300 font-bold cursor-pointer text-sm shadow-sm hover:border-indigo-100 flex items-center justify-between ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="text-slate-300" size={18} />
                    <span className={formData.education ? 'text-slate-900' : 'text-slate-400'}>
                      {formData.education
                        ? formData.education === 'SSC' ? '10th Standard (SSC)'
                          : formData.education === 'Intermediate' ? '12th Standard / Intermediate'
                          : formData.education === 'Diploma' ? 'Diploma'
                          : formData.education === 'BTech' ? 'Undergraduate (BTech)'
                          : formData.education === 'MTech' ? 'Postgraduate (MTech)'
                          : 'Other'
                        : 'Select Qualification'}
                    </span>
                  </div>
                  <ArrowRight size={16} className={`text-slate-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 5, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute z-50 left-0 right-0 top-full bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden py-2"
                    >
                      {[
                        { val: 'SSC', label: '10th Standard (SSC)' },
                        { val: 'Intermediate', label: '12th Standard / Intermediate' },
                        { val: 'Diploma', label: 'Diploma' },
                        { val: 'BTech', label: 'Undergraduate (BTech)' },
                        { val: 'MTech', label: 'Postgraduate (MTech)' },
                        { val: 'Other', label: 'Other' },
                      ].map(opt => (
                        <div
                          key={opt.val}
                          onClick={() => { setFormData({ ...formData, education: opt.val }); setIsDropdownOpen(false); }}
                          className="px-6 py-3 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors font-bold text-sm text-slate-600"
                        >
                          {opt.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.education && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.education}</p>}
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
                  {serverWaking ? 'Waiting for server...' : 'Processing...'}
                </>
              ) : (
                <>Register & Continue <ArrowRight size={18} /></>
              )}
            </motion.button>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>{' '}
              <br /> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-8 pt-8 border-t border-slate-100">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-indigo-600 hover:underline">Sign In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({
  label, icon, placeholder, value, onChange, error,
  type = 'text', hasToggle, onToggle, showState, loading, maxLength, disabled, helperText,
}: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-indigo-500'}`}>
        {icon}
      </div>
      <input
        type={type}
        maxLength={maxLength}
        disabled={disabled}
        className={`
          w-full pl-14 pr-10 py-3 rounded-2xl border-2 transition-all duration-300 font-bold text-sm placeholder:text-slate-300
          ${error ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white'}
          ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
        `}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {helperText && !error && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          <span className="text-[9px] text-slate-400 font-medium">{helperText}</span>
        </div>
      )}
      {hasToggle && (
        <button 
          type="button" 
          onClick={onToggle} 
          disabled={disabled}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors disabled:opacity-50"
        >
          {showState ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
      {loading && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        </div>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default Register;
