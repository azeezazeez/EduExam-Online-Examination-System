import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuestionNavigator from '../components/QuestionNavigator';
import { ChevronLeft, ChevronRight, Send, AlertCircle, BarChart3, Loader2 } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
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
    // Show error to user (optional)
    // You could add a toast notification here
  }
};

  const handleAutoSubmit = async () => {
    try {
      await api.submitExam();
      navigate('/result');
    } catch (err) {
      console.error('Auto-submit failed:', err);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitExam();
      navigate('/result');
    } catch (error: any) {
      setError(error.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading questions...</p>
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userId={user.userId} username={user.username} timeLeft={timeLeft} />

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        />
      </div>

      <main className="flex-1 container mx-auto max-w-6xl p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Question Navigator (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart3 size={16} />
              Navigator
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q.qid}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                    w-full aspect-square rounded-xl font-bold text-sm transition-all
                    ${currentIdx === idx
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110'
                      : answers[q.qid] !== undefined
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Answered</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Remaining</span>
                <span className="font-bold text-slate-600">{questions.length - answeredCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-[500px]">
            {/* Question Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                  {currentIdx + 1}
                </div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Question
                </span>
              </div>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                Single Choice
              </div>
            </div>

            {/* Question Content */}
            <div className="p-8 md:p-12 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 leading-snug">
                    {currentQuestion.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      currentQuestion.optionA,
                      currentQuestion.optionB,
                      currentQuestion.optionC,
                      currentQuestion.optionD
                    ].filter(opt => opt && opt.trim() !== '').map((option, idx) => {
                      const optionLetter = getOptionLetter(idx);
                      return (
                        <motion.label
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`
                            group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all
                            ${answers[currentQuestion.qIi] === optionLetter
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-50'
                              : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}
                          `}
                        >
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${answers[currentQuestion.qid] === optionLetter
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-slate-300 group-hover:border-indigo-400'}
                          `}>
                            {answers[currentQuestion.qid] === optionLetter && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <input
                            type="radio"
                            name="option"
                            className="hidden"
                            checked={answers[currentQuestion.qid] === optionLetter}
                            onChange={() => handleOptionSelect(optionLetter)}
                          />
                          <span className="text-lg font-medium">{optionLetter}. {option}</span>
                        </motion.label>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-50/50 border-t border-slate-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx === 0}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden md:inline">Previous</span>
                  </button>

                  <button
                    onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                    disabled={currentIdx === questions.length - 1}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="lg:hidden w-full">
                  <QuestionNavigator
                    totalQuestions={questions.length}
                    currentQuestion={currentIdx}
                    answers={Object.keys(answers).reduce((acc, key) => {
                      const index = questions.findIndex(q => q.qid === parseInt(key));
                      if (index !== -1) {
                        acc[index] = 1;
                      }
                      return acc;
                    }, {} as Record<number, number | undefined>)}
                    onNavigate={setCurrentIdx}
                  />
                </div>

                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Finish Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Submit Exam?</h3>
              <p className="text-slate-500 mb-8">
                You have answered {answeredCount} out of {questions.length} questions. Are you sure you want to finish?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  disabled={isSubmitting}
                >
                  Review
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Yes, Submit'}
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