import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuestionNavigator from '../components/QuestionNavigator';
import { ChevronLeft, ChevronRight, Send, AlertCircle, BarChart3, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

interface Question {
  qid: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answered: boolean;
  selectedOption?: string;
}

const Exam = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = api.getCurrentUser();
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    loadQuestions();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions();
      setQuestions(data);

      // Load saved answers
      const savedAnswers = await api.getAnswers();
      if (savedAnswers && Object.keys(savedAnswers).length > 0) {
        setAnswers(savedAnswers);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (optionLetter: string) => {
    const currentQuestion = questions[currentIdx];

    // Update UI immediately
    setAnswers({ ...answers, [currentQuestion.qid]: optionLetter });

    try {
      console.log('Saving answer:', {
        questionId: currentQuestion.qid,
        selectedOption: optionLetter
      });

      await api.saveAnswer(currentQuestion.qid, optionLetter);
      console.log('Answer saved successfully');
    } catch (err: any) {
      console.error('Failed to save answer:', err);
      // Optionally show error toast here
    }
  };

  const handleAutoSubmit = async () => {
    try {
      await api.submitExam();
      navigate('/result');
    } catch (err) {
      console.error('Auto-submit failed:', err);
      setError('Failed to auto-submit exam. Please contact support.');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitExam();
      navigate('/result');
    } catch (error: any) {
      setError(error.message || 'Submission failed');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-12">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-8" 
          />
          <h2 className="text-white text-2xl font-black uppercase tracking-widest italic">Initializing Secure Environment...</h2>
          <p className="text-slate-400 mt-4">Loading examination questions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <p className="text-rose-600 font-bold mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user || questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // 0->A, 1->B, 2->C, 3->D
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
      <Navbar userId={user.userId} username={user.username} timeLeft={timeLeft} />
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-200">
        <motion.div 
          className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-5xl flex gap-6 p-6 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="hidden lg:flex w-72 flex-col gap-4 overflow-y-auto custom-scrollbar">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
               <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-indigo-600" size={18} />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Question Navigator</h3>
               </div>

               <div className="grid grid-cols-5 gap-2">
                 {questions.map((q, idx) => (
                   <button 
                    key={q.qid}
                    onClick={() => setCurrentIdx(idx)}
                    className={`
                      aspect-square rounded-xl font-bold text-[10px] transition-all relative
                      ${currentIdx === idx 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110 z-10' 
                        : answers[q.qid] 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200' 
                          : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}
                    `}
                   >
                     {idx + 1}
                     {answers[q.qid] && (
                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                     )}
                   </button>
                 ))}
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Answered</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600">{answeredCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-500 shadow-sm border border-amber-100">
                        <AlertCircle size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Remaining</span>
                    </div>
                    <span className="text-lg font-black text-slate-600">{questions.length - answeredCount}</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Session Status</p>
               <p className="text-[11px] text-white/80 font-medium">Active & Monitoring</p>
               <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
               </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex-1 flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                      {currentIdx + 1}
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Question ID</p>
                       <p className="text-[10px] font-bold text-slate-600">#{currentQuestion.qid}</p>
                    </div>
                 </div>
                 <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                   Single Choice
                 </div>
              </div>

              {/* Content */}
              <div className="p-8 sm:p-12 overflow-y-auto flex-1 custom-scrollbar">
                 <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-10">
                   {currentQuestion.question}
                 </h2>

                 <div className="grid grid-cols-1 gap-4">
                   {[
                     currentQuestion.optionA,
                     currentQuestion.optionB,
                     currentQuestion.optionC,
                     currentQuestion.optionD
                   ].filter(opt => opt && opt.trim() !== '').map((option, idx) => {
                     const optionLetter = getOptionLetter(idx);
                     const isSelected = answers[currentQuestion.qid] === optionLetter;
                     return (
                       <motion.button
                         key={idx}
                         whileHover={{ scale: 1.01 }}
                         whileTap={{ scale: 0.99 }}
                         onClick={() => handleOptionSelect(optionLetter)}
                         className={`
                           flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left
                           ${isSelected 
                             ? 'bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-50' 
                             : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'
                           }
                         `}
                       >
                          <div className={`
                            w-8 h-8 rounded-lg font-black text-[11px] flex items-center justify-center transition-all
                            ${isSelected 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100'
                            }
                          `}>
                            {optionLetter}
                          </div>
                          <span className={`text-[13px] font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {option}
                          </span>
                          {isSelected && <CheckCircle2 size={18} className="ml-auto text-indigo-600" />}
                       </motion.button>
                     );
                   })}
                 </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between">
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentIdx(p => Math.max(0, p - 1))} 
                      disabled={currentIdx === 0 || isSubmitting}
                      className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <button 
                      onClick={() => setCurrentIdx(p => Math.min(questions.length - 1, p + 1))} 
                      disabled={currentIdx === questions.length - 1 || isSubmitting}
                      className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronRight size={20} className="text-slate-600" />
                    </button>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setShowConfirm(true)}
                   disabled={isSubmitting}
                   className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-black transition-all disabled:opacity-50"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                   Submit Exam
                 </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center shadow-[0_48px_120px_-24px_rgba(0,0,0,0.25)] border-4 border-slate-50"
             >
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                   <AlertCircle size={48} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Submit Exam?</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  You have answered <span className="text-indigo-600 font-black text-xl">{answeredCount}</span> out of <span className="font-black">{questions.length} questions</span>.
                </p>
                <p className="text-slate-400 text-sm mb-12">
                  Are you sure you want to submit your examination?
                </p>
                <div className="flex gap-4">
                   <button 
                    onClick={() => setShowConfirm(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                   >
                     Review Answers
                   </button>
                   <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Yes, Submit'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exam;
