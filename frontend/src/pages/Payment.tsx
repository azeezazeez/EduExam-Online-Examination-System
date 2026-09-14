import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle2, ShieldCheck, User, ArrowRight, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

const Payment = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'card' | 'upi'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    upiId: '',
    upiApp: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = v.match(/.{1,4}/g);
    return parts ? parts.join(' ') : v;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (method === 'card') {
      const rawCardNumber = formData.cardNumber.replace(/\s/g, '');
      if (rawCardNumber.length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!formData.cardHolder) newErrors.cardHolder = 'Card holder name is required';
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Invalid expiry (MM/YY)';
      if (formData.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    } else {
      if (!formData.upiId || !formData.upiId.includes('@')) newErrors.upiId = 'Invalid UPI ID format';
      if (!formData.upiApp) newErrors.upiApp = 'Please select a UPI app';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (validate()) {
      setIsSubmitting(true);
      try {
        await api.processPayment({
          paymentType: method,
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardHolder: formData.cardHolder,
          expiry: formData.expiry,
          cvv: formData.cvv,
          upiId: formData.upiId,
          upiApp: formData.upiApp,
        });

        // Navigate to login after successful payment
        navigate('/login');
      } catch (error: any) {
        setServerError(error.message || 'Payment failed. Please try again.');
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
        className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
      >
        {/* Visual Summary Panel */}
        <div className="bg-slate-900 md:w-1/3 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Lock size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Checkout</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">Complete Your Enrollment</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Securely pay your examination fee to finalize your registration.</p>

            <div className="mt-12 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Total Payable</p>
              <h3 className="text-3xl font-black tracking-tighter text-white">₹499.00</h3>
              <div className="mt-3 space-y-2 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Examination Fee</span>
                  <span>₹499.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Instant Activation</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">256-bit SSL Encryption</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Payment Configuration */}
        <div className="p-8 md:p-12 md:w-2/3 bg-white overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment Method</h3>
            <p className="text-slate-400 text-sm font-medium">Choose how you'd like to pay for your exam</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl">
              <p className="text-rose-600 text-sm font-medium text-center">{serverError}</p>
            </div>
          )}

          <div className="flex gap-4 mb-8 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all ${method === 'card' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <CreditCard size={16} />
              <span className="text-[10px] uppercase tracking-widest">Card Payment</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod('upi')}
              className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black transition-all ${method === 'upi' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <Smartphone size={16} />
              <span className="text-[10px] uppercase tracking-widest">UPI Transfer</span>
            </button>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <AnimatePresence mode="wait">
              {method === 'card' ? (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <Input 
                    label="Card Number"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(v: string) => setFormData({ ...formData, cardNumber: formatCardNumber(v) })}
                    error={errors.cardNumber}
                    icon={<CreditCard size={16} />}
                    disabled={isSubmitting}
                    maxLength={19}
                  />
                  <Input 
                    label="Card Holder Name"
                    placeholder="JOHN DOE"
                    value={formData.cardHolder}
                    onChange={(v: string) => setFormData({ ...formData, cardHolder: v.toUpperCase() })}
                    error={errors.cardHolder}
                    icon={<User size={16} />}
                    disabled={isSubmitting}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Expiry Date" 
                      placeholder="MM/YY" 
                      value={formData.expiry} 
                      onChange={(v: string) => {
                        let val = v.replace(/\D/g, '');
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setFormData({ ...formData, expiry: val });
                      }} 
                      error={errors.expiry} 
                      centered 
                      disabled={isSubmitting}
                      maxLength={5}
                    />
                    <Input 
                      label="CVV Code" 
                      placeholder="•••" 
                      type="password" 
                      value={formData.cvv} 
                      onChange={(v: string) => setFormData({ ...formData, cvv: v.replace(/\D/g, '') })} 
                      error={errors.cvv} 
                      centered 
                      maxLength={3}
                      disabled={isSubmitting}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <Input 
                    label="UPI ID"
                    placeholder="username@bank"
                    value={formData.upiId}
                    onChange={(v: string) => setFormData({ ...formData, upiId: v })}
                    error={errors.upiId}
                    icon={<Smartphone size={16} />}
                    disabled={isSubmitting}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select UPI App</label>
                    <div className="relative group">
                      <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                      <select
                        className={`w-full pl-14 pr-10 py-3 rounded-xl border-2 transition-all font-bold text-sm appearance-none bg-white/50 cursor-pointer ${errors.upiApp ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white'}`}
                        value={formData.upiApp}
                        onChange={(e) => setFormData({ ...formData, upiApp: e.target.value })}
                        disabled={isSubmitting}
                      >
                        <option value="">Select UPI App</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM">BHIM</option>
                        <option value="Amazon Pay">Amazon Pay</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
                    </div>
                    {errors.upiApp && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.upiApp}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-emerald-50/50 p-5 rounded-2xl flex items-start gap-3 border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Bank-Grade Security</p>
                <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                  Your payment is protected with 256-bit SSL encryption. We never store your full card details or UPI credentials.
                </p>
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
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirm & Pay ₹499
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              By completing this payment, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Input = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon, 
  type = "text", 
  centered, 
  maxLength,
  disabled 
}: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        maxLength={maxLength}
        disabled={disabled}
        className={`
          w-full px-5 py-3 rounded-xl border-2 transition-all font-bold text-sm placeholder:text-slate-300
          ${icon ? 'pl-14' : ''}
          ${centered ? 'text-center' : ''}
          ${error ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white'}
          ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
        `}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export default Payment;
