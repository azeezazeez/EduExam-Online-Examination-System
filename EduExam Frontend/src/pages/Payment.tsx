import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle2, ShieldCheck, User, ArrowRight, Lock, Loader2 } from 'lucide-react';
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
          cvv: formData.cvv,
          upiId: formData.upiId,
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[650px]"
      >
        {/* Left Side - Hero & Summary */}
        <div className="bg-indigo-600 md:w-2/5 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-white" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest opacity-80">Secure Checkout</span>
            </div>
            
            <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Complete Your Enrollment</h2>
            <p className="opacity-70 text-lg font-medium leading-relaxed">Securely pay your examination fee to finalize your registration and start your journey.</p>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-14 h-10 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 rounded-lg shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]" />
                  <div className="absolute top-1/2 left-0 w-full h-px bg-black/10" />
                </div>
                <CreditCard size={32} className="opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
              </div>
              
              <div className="space-y-8">
                <p className="font-mono text-2xl tracking-[0.2em] h-8 drop-shadow-md">
                  {formData.cardNumber || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end">
                  <div className="flex-1 mr-4">
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">Card Holder</p>
                    <p className="font-bold tracking-wide uppercase truncate text-lg">
                      {formData.cardHolder || 'Your Name'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">Expires</p>
                    <p className="font-bold text-lg">{formData.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              {/* Card decoration */}
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
              <div className="absolute -left-12 -top-12 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl" />
            </motion.div>
          </div>

          <div className="mt-12 relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 font-medium">Examination Fee</span>
                <span className="font-bold">₹499.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 font-medium">Processing Fee</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
            </div>
            <div className="h-px bg-white/20 mb-4" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-50">Total Payable</p>
                <span className="text-3xl font-black text-white drop-shadow-lg">₹499</span>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="text-emerald-400" size={24} />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side - Payment Methods */}
        <div className="p-8 md:p-12 md:w-3/5 overflow-y-auto bg-white">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Payment Method</h3>
            <p className="text-slate-500 font-medium">Choose how you'd like to pay for your exam.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl">
              <p className="text-rose-600 text-sm font-medium text-center">{serverError}</p>
            </div>
          )}

          <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-200 shadow-inner">
            <button
              onClick={() => setMethod('card')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all duration-300 ${method === 'card' ? 'bg-white text-indigo-600 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}
            >
              <CreditCard size={20} />
              <span className="text-xs uppercase tracking-widest">Card Payment</span>
            </button>
            <button
              onClick={() => setMethod('upi')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all duration-300 ${method === 'upi' ? 'bg-white text-indigo-600 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}
            >
              <Smartphone size={20} />
              <span className="text-xs uppercase tracking-widest">UPI Transfer</span>
            </button>
          </div>

          <form onSubmit={handlePayment} className="space-y-8">
            <AnimatePresence mode="wait">
              {method === 'card' ? (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        type="text"
                        maxLength={19}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${errors.cardNumber ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-lg tracking-widest placeholder:text-slate-300`}
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Holder Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        type="text"
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${errors.cardHolder ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold uppercase placeholder:text-slate-300`}
                        placeholder="JOHN DOE"
                        value={formData.cardHolder}
                        onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.cardHolder && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.cardHolder}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${errors.expiry ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-center placeholder:text-slate-300`}
                        value={formData.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          setFormData({ ...formData, expiry: val });
                        }}
                        disabled={isSubmitting}
                      />
                      {errors.expiry && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.expiry}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV Code</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${errors.cvv ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-center placeholder:text-slate-300`}
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                        disabled={isSubmitting}
                      />
                      {errors.cvv && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UPI ID</label>
                    <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        type="text"
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${errors.upiId ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold placeholder:text-slate-300`}
                        placeholder="username@bank"
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.upiId && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.upiId}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select UPI App</label>
                    <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <select
                        className={`w-full pl-12 pr-10 py-4 rounded-2xl border-2 ${errors.upiApp ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold appearance-none bg-white/50 cursor-pointer`}
                        value={formData.upiApp}
                        onChange={(e) => setFormData({ ...formData, upiApp: e.target.value })}
                        disabled={isSubmitting}
                      >
                        <option value="">Select App</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM">BHIM</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRight size={18} className="rotate-90" />
                      </div>
                    </div>
                    {errors.upiApp && <p className="text-rose-500 text-[10px] font-bold ml-1">{errors.upiApp}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-emerald-50/50 p-6 rounded-[2rem] flex items-start gap-4 border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">Bank-Grade Security</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                  Your payment is protected with 256-bit SSL encryption. We never store your full card details or UPI credentials.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-[0.98] mt-4 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                  Confirm & Pay ₹499
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;