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
  Download,
  Loader2,
  User,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Clock,
  ShieldCheck
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { api } from "../services/api";
import Certificate from "../components/Certificate";

const Result = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      const storedUser = api.getCurrentUser();

      if (!storedUser) {
        navigate("/login");
        return;
      }

      setUser(storedUser);

      try {
        const storedResult = await api.getExamResult();

        if (!storedResult) {
          navigate("/exam");
          return;
        }

        setResult(storedResult);
      } catch (error) {
        console.error(error);
        navigate("/exam");
      }
    };

    fetchResult();
  }, [navigate]);

  const downloadCertificate = async () => {
    const element = document.getElementById("certificate-content");

    if (!element) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [800, 600]
      });

      pdf.addImage(imgData, "PNG", 0, 0, 800, 600);

      pdf.save(`EduExam_Certificate_${user.username}.pdf`);
    } catch (error) {
      console.error("PDF generation error", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user || !result) return null;

  const wrong = (result.attempted || 0) - (result.correct || 0);

  const percentage =
    result.totalQuestions > 0
      ? Math.round((result.correct / result.totalQuestions) * 100)
      : 0;

  const isPass = percentage >= 50;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">

      {/* Status Banner */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-6xl mb-8 rounded-3xl p-8 flex items-center justify-between shadow-xl ${
          isPass
            ? "bg-gradient-to-r from-indigo-600 to-violet-600"
            : "bg-gradient-to-r from-rose-600 to-orange-600"
        } text-white`}
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
            {isPass ? <Trophy size={40} /> : <XCircle size={40} />}
          </div>

          <div>
            <h1 className="text-3xl font-black">
              {isPass ? "Congratulations" : "Better Luck Next Time"},{" "}
              {user.username}
            </h1>
            <p className="text-white/80">
              {isPass
                ? "You successfully cleared the exam."
                : "You did not meet the required score."}
            </p>
          </div>
        </div>

        <div className="bg-white/10 px-8 py-4 rounded-2xl text-center">
          <p className="text-xs uppercase opacity-60">Final Score</p>
          <p className="text-4xl font-black">{percentage}%</p>
        </div>
      </motion.div>

      {/* Stats */}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <StatCard icon={<BarChart3 />} label="Total Questions" value={result.totalQuestions} />
        <StatCard icon={<Award />} label="Attempted" value={result.attempted} />
        <StatCard icon={<CheckCircle2 />} label="Correct" value={result.correct} />
        <StatCard icon={<XCircle />} label="Incorrect" value={wrong} />

      </div>

      {/* Actions */}

      <div className="mt-10 flex gap-4">

        <button
          onClick={() => navigate("/exam")}
          className="flex items-center gap-2 px-6 py-3 bg-slate-200 rounded-xl font-bold"
        >
          <RotateCcw size={18} />
          Retake
        </button>

        <button
          disabled={!isPass}
          onClick={downloadCertificate}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:bg-gray-400"
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          Download Certificate
        </button>

      </div>

      {/* Hidden certificate for PDF */}

      <div className="fixed -left-[9999px] top-0">

        <Certificate
          username={user.username}
          userId={user.userId}
          percentage={percentage}
          location={`${user.district || ""}, ${user.state || ""}`}
          date={new Date().toLocaleDateString()}
        />

      </div>

    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
    {icon}
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);

export default Result;
