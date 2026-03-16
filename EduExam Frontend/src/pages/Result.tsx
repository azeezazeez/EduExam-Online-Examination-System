import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, XCircle, CheckCircle2, RotateCcw, Award, BarChart3, Download, Loader2, User, Mail, MapPin, GraduationCap, Calendar, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Certificate from '../components/Certificate';

const Result = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      const storedUser = api.getCurrentUser();
      if (!storedUser) {
        navigate('/login');
        return;
      }
      setUser(storedUser);

      try {
        const storedResult = await api.getExamResult();
        if (!storedResult) {
          navigate('/exam');
          return;
        }
        setResult(storedResult);
      } catch (error) {
        console.error('Failed to fetch result', error);
        navigate('/exam');
      }
    };

    fetchResult();
  }, []);

  const downloadCertificate = async () => {
    const element = document.getElementById('certificate-content');
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 600]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
      pdf.save(`EduExam_Certificate_${user.username.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user || !result) return null;

  const wrong = result.attempted - result.correct;
  const percentage = (result.correct / result.totalQuestions) * 100;
  const isPass = percentage >= 50;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 md:px-8">
      {/* Top Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-6xl mb-8 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${isPass ? 'bg-gradient-to-r from-indigo-600 to-violet-600' : 'bg-gradient-to-r from-rose-600 to-orange-600'} text-white`}
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
            {isPass ? <Trophy size={40} /> : <XCircle size={40} />}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">
              {isPass ? 'Congratulations, ' : 'Better luck next time, '} {user.username}!
            </h1>
            <p className="text-white/80 font-medium">
              {isPass ? 'You have successfully cleared the examination.' : 'You did not meet the minimum qualification criteria.'}
            </p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
          <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Final Score</p>
          <p className="text-4xl font-black">{percentage}%</p>
        </div>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Candidate Profile */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Candidate Profile</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{user.userId}</p>
              </div>
            </div>

            <div className="space-y-6">
              <ProfileItem icon={<Mail size={18} />} label="Email Address" value={user.email || 'N/A'} />
              <ProfileItem icon={<GraduationCap size={18} />} label="Education" value={user.education || 'N/A'} />
              <ProfileItem icon={<MapPin size={18} />} label="Location" value={`${user.district || ''}, ${user.state || ''}`} />
              <ProfileItem icon={<Calendar size={18} />} label="Exam Date" value={new Date().toLocaleDateString()} />
              <ProfileItem icon={<Clock size={18} />} label="Submission" value={new Date().toLocaleTimeString()} />
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50">
              <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl font-black text-sm uppercase tracking-widest ${isPass ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                <ShieldCheck size={20} />
                {isPass ? 'Verified Qualified' : 'Not Qualified'}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={downloadCertificate}
              disabled={isDownloading || !isPass}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${
                isPass 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isDownloading ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} />}
              {isDownloading ? 'Generating...' : 'Download Certificate'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('lastExamResult');
                navigate('/exam');
              }}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              <RotateCcw size={22} />
              Retake Examination
            </button>
          </div>
        </motion.div>

        {/* Right Column - Performance Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              icon={<BarChart3 className="text-indigo-600" />} 
              label="Total Questions" 
              value={result.totalQuestions} 
              color="indigo"
            />
            <StatCard 
              icon={<Award className="text-amber-600" />} 
              label="Attempted" 
              value={result.attempted} 
              color="amber"
            />
            <StatCard 
              icon={<CheckCircle2 className="text-emerald-600" />} 
              label="Correct Answers" 
              value={result.correct} 
              color="emerald"
            />
            <StatCard 
              icon={<XCircle className="text-rose-600" />} 
              label="Incorrect Answers" 
              value={wrong} 
              color="rose"
            />
          </div>

          {/* Performance Analysis */}
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Performance Analysis</h3>
                <p className="text-sm text-slate-400 font-medium">Topic-wise accuracy breakdown</p>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <BarChart3 size={24} />
              </div>
            </div>

            <div className="space-y-8">
              <ProgressBar label="General Knowledge" percentage={Math.min(100, percentage + 10)} color="bg-indigo-500" />
              <ProgressBar label="Mathematics & Logic" percentage={Math.max(0, percentage - 15)} color="bg-violet-500" />
              <ProgressBar label="English Language" percentage={percentage} color="bg-emerald-500" />
              <ProgressBar label="Technical Skills" percentage={Math.min(100, percentage + 5)} color="bg-amber-500" />
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Expert Recommendation</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {isPass 
                    ? "Your performance is exceptional. We recommend focusing on advanced technical modules to further enhance your professional profile."
                    : "Focus on strengthening your core concepts in Mathematics and Logic. Regular practice with mock tests will significantly improve your speed and accuracy."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Certificate for Capture */}
      <div className="fixed left-[-9999px] top-0">
        <Certificate 
          username={user.username}
          userId={user.userId}
          percentage={percentage}
          date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        />
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: 'indigo' | 'amber' | 'emerald' | 'rose' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50',
    amber: 'bg-amber-50',
    emerald: 'bg-emerald-50',
    rose: 'bg-rose-50'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-xs font-black text-slate-400">{Math.round(percentage)}%</span>
    </div>
    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

export default Result;
