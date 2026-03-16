import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Award,
  BarChart3,
  Loader2
} from 'lucide-react';

import { api } from '../services/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Certificate from '../components/Certificate';

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

      const percentage =
        data.percentage ??
        (data.totalQuestions > 0
          ? (data.correctAnswers / data.totalQuestions) * 100
          : 0);

      const mappedResult: ExamResult = {
        totalQuestions: data.totalQuestions || 0,
        attempted: data.attempted || 0,
        correctAnswers: data.correctAnswers || data.correct || 0,
        wrongAnswers: data.wrongAnswers || data.wrong || 0,
        score: data.score || data.correctAnswers || 0,
        percentage: percentage,
        grade: data.grade || calculateGrade(percentage)
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


  const downloadCertificate = async () => {

    const element = document.getElementById("certificate-content");

    if (!element) return;

    const canvas = await html2canvas(element, { scale: 3 });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [800, 600]
    });

    pdf.addImage(imgData, "PNG", 0, 0, 800, 600);

    pdf.save(`EduExam_Certificate_${user.username}.pdf`);

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
            {error || 'Failed to load results'}
          </p>

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

        {/* LEFT PANEL */}

        <div className={`md:w-2/5 p-12 text-white flex flex-col items-center justify-center text-center relative ${isPass ? 'bg-indigo-600' : 'bg-rose-600'}`}>

          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6">

            {isPass ? <Trophy size={64}/> : <XCircle size={64}/>}

          </div>

          <h2 className="text-4xl font-black mb-3">

            {isPass ? 'EXCELLENT!' : 'KEEP TRYING'}

          </h2>

          <p className="opacity-80">

            {isPass
              ? 'You passed the test.'
              : 'You did not reach the required score.'}

          </p>


          <div className="mt-10">

            <p className="text-sm opacity-70">Final Score</p>

            <h3 className="text-5xl font-black">

              {result.percentage.toFixed(2)}%

            </h3>

          </div>

        </div>


        {/* RIGHT PANEL */}

        <div className="md:w-3/5 p-10">

          <h3 className="text-2xl font-bold mb-6">

            Exam Summary

          </h3>


          <div className="grid grid-cols-2 gap-6 mb-10">

            <Stat label="Total Questions" value={result.totalQuestions} icon={<BarChart3 size={20}/>}/>

            <Stat label="Attempted" value={result.attempted} icon={<Award size={20}/>}/>

            <Stat label="Correct" value={result.correctAnswers} icon={<CheckCircle2 size={20}/>}/>

            <Stat label="Incorrect" value={result.wrongAnswers} icon={<XCircle size={20}/>}/>

          </div>


          <div className="flex gap-4">

            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-slate-100"
            >

              <RotateCcw size={18}/>
              Retake Exam

            </button>


            <button
              onClick={downloadCertificate}
              disabled={!isPass}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-indigo-600 text-white disabled:opacity-50"
            >

              <Award size={18}/>
              Download Certificate

            </button>

          </div>

        </div>

      </motion.div>


      {/* Hidden Certificate */}

      <div id="certificate-content" className="fixed left-[-9999px] top-0">

        <Certificate
          username={user.username}
          userId={user.userId}
          percentage={result.percentage}
          date={new Date().toLocaleDateString()}
        />

      </div>

    </div>

  );

};


const Stat = ({label, value, icon}:any) => (

  <div className="bg-slate-50 p-6 rounded-2xl text-center">

    <div className="mb-2 flex justify-center">
      {icon}
    </div>

    <p className="text-2xl font-black">{value}</p>

    <p className="text-xs text-slate-400 uppercase">
      {label}
    </p>

  </div>

);

export default Result;
