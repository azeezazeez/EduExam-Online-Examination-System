import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Award,
  BarChart3,
  Loader2
} from "lucide-react";

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

      const correct = data.correctAnswers ?? data.correct ?? 0;
      const total = data.totalQuestions ?? 0;

      const percentage =
        data.percentage ??
        (total > 0 ? (correct / total) * 100 : 0);

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
      setError(err?.message || "Failed to load result");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md">
          <XCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <p className="text-rose-600 font-bold mb-4">
            {error || "Failed to load results"}
          </p>

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
      >

        {/* LEFT SIDE */}

        <div
          className={`md:w-2/5 p-12 text-white flex flex-col items-center justify-center text-center ${
            isPass ? "bg-indigo-600" : "bg-rose-600"
          }`}
        >

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6"
          >
            {isPass ? (
              <Trophy size={64} />
            ) : (
              <XCircle size={64} />
            )}
          </motion.div>

          <h2 className="text-4xl font-black mb-4">
            {isPass ? "EXCELLENT!" : "KEEP TRYING"}
          </h2>

          <div className="bg-white/10 rounded-3xl p-6 w-full">
            <p className="text-xs uppercase opacity-60">
              Final Score
            </p>

            <h3 className="text-5xl font-black">
              {Math.round(result.percentage)}%
            </h3>
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="md:w-3/5 p-8 md:p-12">

          <div className="grid grid-cols-2 gap-4 mb-12">

            <StatCard
              icon={<BarChart3 size={20} />}
              value={result.totalQuestions}
              label="Total Questions"
            />

            <StatCard
              icon={<Award size={20} />}
              value={result.attempted}
              label="Attempted"
            />

            <StatCard
              icon={<CheckCircle2 size={20} />}
              value={result.correctAnswers}
              label="Correct"
            />

            <StatCard
              icon={<XCircle size={20} />}
              value={result.wrongAnswers}
              label="Incorrect"
            />

          </div>

          <button
            onClick={handleRetake}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200"
          >
            <RotateCcw size={18} />
            Retake Exam
          </button>

        </div>

      </motion.div>
    </div>
  );
};

const StatCard = ({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => (
  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
    {icon}
    <p className="text-2xl font-black">{value}</p>
    <p className="text-xs uppercase text-slate-400">{label}</p>
  </div>
);

export default Result;
