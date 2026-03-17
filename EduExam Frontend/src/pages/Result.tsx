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
  // Add any additional fields your API returns
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
      console.log('API Result data:', data); // Debug log to see actual structure

      // Map the API response to your interface if needed
      const mappedResult: ExamResult = {
        totalQuestions: data.totalQuestions || 0,
        attempted: data.attempted || 0,
        correctAnswers: data.correctAnswers || data.correct || 0, // Handle different field names
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

  // Helper function to calculate grade if API doesn't provide it
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
        {/* Left Side - Hero Status */}
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg opacity-80 font-medium"
            >
              {isPass ? 'You passed the test with flying colors.' : 'You didn\'t reach the required score this time.'}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 w-full relative z-10"
          >
            <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mb-1">Final Score</p>
            <h3 className="text-5xl font-black">{Math.round(result.percentage)}%</h3>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.percentage}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        {/* Right Side - Details */}
        <div className="md:w-3/5 p-8 md:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Exam Summary</h3>
              <p className="text-sm text-slate-400 font-medium">Detailed performance breakdown</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">User ID</p>
              <p className="text-lg font-mono font-black text-indigo-600">{user.userId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Candidate</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold text-slate-700">
                {user.username}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</p>
              <div className={`p-4 rounded-2xl border font-black text-center ${isPass ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                {isPass ? 'QUALIFIED' : 'NOT QUALIFIED'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                <BarChart3 size={20} />
              </div>
              <p className="text-2xl font-black text-slate-800">{result.totalQuestions}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Questions</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <p className="text-2xl font-black text-slate-800">{result.attempted}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attempted</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-2xl font-black text-emerald-600">{result.correctAnswers}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Correct</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-3">
                <XCircle size={20} />
              </div>
              <p className="text-2xl font-black text-rose-600">{result.wrongAnswers}</p>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Incorrect</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
            >
              <RotateCcw size={18} />
              Retake Exam
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              <Award size={18} />
              Download Certificate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Result;
