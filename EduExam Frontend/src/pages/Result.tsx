import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, XCircle, CheckCircle2, RotateCcw, Award, BarChart3, Loader2, Sparkles, Download, ArrowRight, Share2 } from "lucide-react";
import { api } from "../services/api";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = api.getCurrentUser();
    
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    setUser(storedUser);
    loadResult();
  }, [navigate]);

  const loadResult = async () => {
    try {
      setLoading(true);
      
      const data = await api.getExamResult();
      
      // Map the API response to the expected format
      const correct = data.correctAnswers ?? data.correct ?? 0;
      const total = data.totalQuestions ?? 0;
      
      const percentage = data.percentage ?? (total > 0 ? (correct / total) * 100 : 0);
      
      const mappedResult: ExamResult = {
        totalQuestions: total,
        attempted: data.attempted ?? 0,
        correctAnswers: correct,
        wrongAnswers: data.wrongAnswers ?? data.wrong ?? 0,
        score: data.score ?? correct,
        percentage: percentage,
        grade: data.grade ?? calculateGrade(percentage)
      };
      
      setResult(mappedResult);
    } catch (err: any) {
      console.error("Error loading result:", err);
      setError(err?.message || "Failed to load your exam results");
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 35) return "D";
    return "F";
  };

  const handleRetake = () => {
    api.logout();
    navigate("/register");
  };

  const handleTerminate = () => {
    api.logout();
    navigate("/login");
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md">
          <XCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <p className="text-rose-600 font-bold mb-4">{error || "Failed to load results"}</p>
          <button
            onClick={() => navigate("/login")}
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
      >
        <div className={`p-10 text-center ${isPass ? 'bg-slate-900' : 'bg-rose-900'} text-white relative overflow-hidden`}>
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20"
          >
            {isPass ? <Trophy size={40} /> : <XCircle size={40} />}
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight mb-2">
            {isPass ? 'EXCELLENT!' : 'KEEP TRYING'}
          </h2>
          <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            {isPass ? 'Session Record Finalized' : 'Assessment Complete'}
          </p>
          
          {/* Score Badge */}
          <div className="mt-6 inline-block mx-auto bg-white/10 rounded-2xl px-6 py-3 backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-wider opacity-60">Final Score</p>
            <h3 className="text-3xl font-black">
              {Math.round(result.percentage)}%
            </h3>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full" />
        </div>

        <div className="p-8 md:p-10">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatItem 
              label="Total Questions" 
              value={result.totalQuestions} 
              icon={<BarChart3 size={14} className="text-indigo-500" />} 
            />
            <StatItem 
              label="Attempted" 
              value={result.attempted} 
              icon={<Award size={14} className="text-emerald-500" />} 
            />
          </div>

          <div className="space-y-3 mb-10">
            <DetailRow 
              label="Correct Answers" 
              value={result.correctAnswers} 
              color="text-emerald-600" 
              icon={<CheckCircle2 size={14} />}
            />
            <DetailRow 
              label="Wrong Answers" 
              value={result.wrongAnswers} 
              color="text-rose-600" 
              icon={<XCircle size={14} />}
            />
            <DetailRow 
              label="Grade" 
              value={result.grade} 
              color="text-indigo-600" 
              icon={<Trophy size={14} />}
            />
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleRetake}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-[0.98]"
            >
              <RotateCcw size={14} />
              Retake Exam
            </button>
            <button 
              onClick={handleTerminate}
              className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
            >
              Terminate Session
            </button>
          </div>
          
          <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-8 pt-6 border-t border-slate-100">
            Thank you for completing the examination
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const StatItem = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
    <div className="flex items-center justify-center gap-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
      {icon}
      {label}
    </div>
    <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
  </div>
);

const DetailRow = ({ label, value, color = "text-slate-900", icon }: { label: string; value: number | string; color?: string; icon?: React.ReactNode }) => (
  <div className="flex justify-between items-center px-4 py-3 bg-slate-50/50 rounded-xl">
    <div className="flex items-center gap-2">
      {icon && <span className="text-slate-400">{icon}</span>}
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-sm font-black ${color}`}>{value}</span>
  </div>
);

export default Result;
