import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, XCircle, CheckCircle2, RotateCcw, Award, BarChart3, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface ExamResult {
  totalQuestions: number;
  attempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  percentage: number;
  grade: string;
}

const Result = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = api.getCurrentUser();
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      setLoading(true);
      const data = await api.getExamResult();

      const mappedResult: ExamResult = {
        totalQuestions: data.totalQuestions || 0,
        attempted: data.attempted || 0,
        correctAnswers: data.correctAnswers || data.correct || 0,
        wrongAnswers: data.wrongAnswers || data.wrong || 0,
        score: data.score || data.correctAnswers || 0,
        percentage: data.percentage || ((data.correctAnswers / data.totalQuestions) * 100) || 0,
        grade: data.grade || calculateGrade(data.percentage || ((data.correctAnswers / data.totalQuestions) * 100))
      };

      setResult(mappedResult);
    } catch (err: any) {
      console.error('Error loading result:', err);
      setError(err.message || 'Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 35) return 'D';
    return 'F';
  };

  const handleRetake = () => {
    api.logout();
    navigate('/register');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md">
          <XCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <p className="text-rose-600 font-bold mb-4">{error || 'Failed to load results'}</p>
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

  const isPass = result.percentage >= 50;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
      >

        {/* Left Side */}
        <div className={`md:w-2/5 p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden ${isPass ? 'bg-indigo-600' : 'bg-rose-600'}`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl border border-white/30 shadow-2xl relative z-10"
          >
            {isPass ? <Trophy size={64} className="text-white" /> : <XCircle size={64} className="text-white" />}
          </motion.div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-black mb-2 tracking-tight"
            >
              {isPass ? 'EXCELLENT!' : 'KEEP TRYING'}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 w-full relative z-10"
          >
            <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mb-1">Final Score</p>
            <h3 className="text-5xl font-black">{Math.round(result.percentage)}%</h3>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="md:w-3/5 p-8 md:p-12">

          <div className="grid grid-cols-2 gap-4 mb-12">

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <BarChart3 size={20} />
              <p className="text-2xl font-black">{result.totalQuestions}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Questions</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <Award size={20} />
              <p className="text-2xl font-black">{result.attempted}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attempted</p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
              <CheckCircle2 size={20} />
              <p className="text-2xl font-black">{result.correctAnswers}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Correct</p>
            </div>

            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex flex-col items-center text-center">
              <XCircle size={20} />
              <p className="text-2xl font-black">{result.wrongAnswers}</p>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Incorrect</p>
            </div>

          </div>

          <button
            onClick={handleRetake}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <RotateCcw size={18} />
            Retake Exam
          </button>

        </div>

      </motion.div>
    </div>
  );
};

export default Result;
