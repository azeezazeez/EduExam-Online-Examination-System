import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuestionNavigator from '../components/QuestionNavigator';
import { ChevronLeft, ChevronRight, Send, AlertCircle, BarChart3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

const Exam = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initExam = async () => {
      const storedUser = api.getCurrentUser();
      if (!storedUser) {
        navigate('/login');
        return;
      }
      setUser(storedUser);

      try {
        const fetchedQuestions = await api.getQuestions();
        setQuestions(fetchedQuestions);
        
        // Also fetch existing answers if any
        const existingAnswers = await api.getAnswers();
        const answersMap: Record<number, any> = {};
        existingAnswers.forEach((ans: any) => {
          // Find the index of the question in the fetched questions
          const qIdx = fetchedQuestions.findIndex((q: any) => q.id === ans.questionId);
          if (qIdx !== -1) {
            answersMap[qIdx] = ans.selectedOption;
          }
        });
        setAnswers(answersMap);
      } catch (error) {
        console.error('Failed to fetch questions', error);
      } finally {
        setIsLoading(false);
      }
    };

    initExam();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = async (option: string) => {
    const question = questions[currentIdx];
    setAnswers({ ...answers, [currentIdx]: option });
    
    try {
      await api.saveAnswer(question.id, option);
    } catch (error) {
      console.error('Failed to save answer', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitExam();
      navigate('/result');
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
          <p className="text-slate-500 font-medium">Loading your exam...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];
  const progress = (Object.keys(answers).length / questions.length) * 100;

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

      <main className="flex-1 container mx-auto max-w-6xl p-2 md:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar - Question Navigator (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sticky top-20">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 size={16} />
              Navigator
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                    w-full aspect-square rounded-xl font-bold text-sm transition-all
                    ${currentIdx === idx 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                      : answers[idx] !== undefined 
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
                <span className="font-bold text-emerald-600">{Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Remaining</span>
                <span className="font-bold text-slate-600">{questions.length - Object.keys(answers).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-[400px]">
            {/* Question Header */}
            <div className="px-6 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
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
            <div className="p-6 md:p-8 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-snug">
                    {currentQuestion.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, idx) => (
                      <motion.label
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`
                          group flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                          ${answers[currentIdx] === option 
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-50' 
                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}
                        `}
                      >
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                          ${answers[currentIdx] === option 
                            ? 'border-indigo-600 bg-indigo-600' 
                            : 'border-slate-300 group-hover:border-indigo-400'}
                        `}>
                          {answers[currentIdx] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <input
                          type="radio"
                          name="option"
                          className="hidden"
                          checked={answers[currentIdx] === option}
                          onChange={() => handleOptionSelect(option)}
                        />
                        <span className="text-lg font-medium">{option}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-50/50 border-t border-slate-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx === 0}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden md:inline">Previous</span>
                  </button>

                  <button
                    onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                    disabled={currentIdx === questions.length - 1}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="lg:hidden w-full">
                  <QuestionNavigator
                    totalQuestions={questions.length}
                    currentQuestion={currentIdx}
                    answers={answers}
                    onNavigate={setCurrentIdx}
                  />
                </div>

                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
                >
                  <Send size={18} />
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
                You have answered {Object.keys(answers).length} out of {questions.length} questions. Are you sure you want to finish?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
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
