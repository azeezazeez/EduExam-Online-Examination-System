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
  const [timeLeft, setTimeLeft] = useState(60 * 60);
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
        const rawQuestions = await api.getQuestions();

        // ✅ FIX: normalize backend response
        const formattedQuestions = rawQuestions.map((q: any) => ({
          ...q,
          question: q.question || q.questionText,
          options:
            q.options ||
            [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
        }));

        setQuestions(formattedQuestions);

        // fetch existing answers
        const existingAnswers = await api.getAnswers();
        const answersMap: Record<number, any> = {};

        existingAnswers.forEach((ans: any) => {
          const qIdx = formattedQuestions.findIndex(
            (q: any) => q.id === ans.questionId
          );
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
      
      <div className="w-full h-1 bg-slate-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        />
      </div>

      <main className="flex-1 container mx-auto max-w-6xl p-2 md:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        
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
                <span className="font-bold text-slate-600">
                  {questions.length - Object.keys(answers).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-[400px]">
            
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

            <div className="p-6 md:p-8 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-snug">
                    {currentQuestion.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option: any, idx: number) => (
                      <motion.label
                        key={idx}
                        className={`
                          group flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                          ${answers[currentIdx] === option 
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-50' 
                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}
                        `}
                      >
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${answers[currentIdx] === option 
                            ? 'border-indigo-600 bg-indigo-600' 
                            : 'border-slate-300'}
                        `}>
                          {answers[currentIdx] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>

                        <input
                          type="radio"
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

            <div className="bg-slate-50/50 border-t border-slate-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}>
                    <ChevronLeft />
                  </button>
                  <button onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}>
                    <ChevronRight />
                  </button>
                </div>

                <button onClick={() => setShowConfirm(true)}>
                  <Send /> Finish Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center">
            <motion.div className="bg-white p-6 rounded-xl">
              <p>
                You answered {Object.keys(answers).length}/{questions.length}
              </p>
              <button onClick={handleSubmit}>Submit</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exam;
