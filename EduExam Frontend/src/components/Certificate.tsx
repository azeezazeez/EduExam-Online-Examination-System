import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface CertificateProps {
  username: string;
  userId: string;
  percentage: number;
  date: string;
  location?: string;
}

const Certificate: React.FC<CertificateProps> = ({ username, userId, percentage, date, location }) => {
  const roundedPercentage = Math.round(percentage);
  
  return (
    <div 
      id="certificate-content"
      className="w-[800px] h-[600px] bg-white p-20 relative border-[12px] border-slate-50 flex flex-col items-center justify-between text-slate-800 font-sans"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Elegant Inner Border */}
      <div className="absolute inset-4 border border-slate-200 pointer-events-none" />
      
      {/* Header */}
      <div className="text-center w-full relative z-10">
        <div className="flex justify-center mb-8">
          <Award size={48} className="text-indigo-600 opacity-80" />
        </div>
        <h1 className="text-3xl font-bold tracking-[0.1em] text-slate-900 uppercase mb-2">Certificate of Completion</h1>
        <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full" />
      </div>

      {/* Body */}
      <div className="text-center space-y-10 flex-1 flex flex-col justify-center relative z-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-400 italic">This is to certify that</p>
          <h2 className="text-5xl font-serif font-bold text-slate-900 tracking-tight">
            {username}
          </h2>
          {location && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{location}</p>
          )}
        </div>
        
        <div className="max-w-lg mx-auto">
          <p className="text-base text-slate-500 leading-relaxed">
            has successfully demonstrated proficiency and met all requirements for the
            <br />
            <span className="font-bold text-slate-800 text-lg">EduExam Professional Assessment</span>
          </p>
          <p className="mt-6 text-slate-400 text-sm">
            Achieving a final evaluation score of <span className="text-indigo-600 font-bold">{roundedPercentage}%</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full grid grid-cols-2 gap-20 pt-10 relative z-10">
        <div className="border-t border-slate-200 pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Details</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-600">ID: {userId}</span>
            <span className="text-xs text-slate-600">{date}</span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 text-right flex flex-col items-end relative">
          {/* Signature/Contribution Pic */}
          <div className="absolute -top-12 right-0 opacity-80">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 45C25 40 40 15 60 25C80 35 95 10 110 20" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 50C35 45 50 20 70 30C90 40 105 15 115 25" stroke="#4F46E5" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <ShieldCheck size={24} className="text-indigo-600 mb-1 opacity-60" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Digital Signature</p>
          <p className="text-xs font-serif italic text-slate-800 mt-1">EduExam Certification Board</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
