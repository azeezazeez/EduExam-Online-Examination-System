import React from 'react';
import { ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

interface CertificateProps {
  username: string;
  userId: string;
  percentage: number;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({
  username,
  userId,
  percentage,
  date
}) => {

  return (
    <div
      className="w-[800px] h-[600px] bg-white p-20 relative border-[12px] border-slate-50 flex flex-col items-center justify-between text-slate-800 font-sans"
      style={{ boxSizing: 'border-box' }}
    >

      {/* Inner Border */}
      <div className="absolute inset-4 border border-slate-200 pointer-events-none" />

      {/* Header */}
      <div className="text-center">

        {/* Organization Logo */}
        <img
          src={logo}
          alt="Organization Logo"
          className="w-20 h-20 mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold tracking-[0.1em] text-slate-900 uppercase mb-3">
          Certificate of Completion
        </h1>

        <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full mb-6" />

      </div>

      {/* Body */}
      <div className="text-center space-y-8 flex-1 flex flex-col justify-center">

        <p className="text-sm font-medium text-slate-400 italic">
          This Certificate is Awarded To
        </p>

        {/* Candidate Name */}
        <h2 className="text-5xl font-serif font-bold text-slate-900 tracking-tight">
          {username}
        </h2>

        <p className="text-base text-slate-500 leading-relaxed max-w-lg mx-auto">
          for successfully completing the
          <br />
          <span className="font-bold text-slate-800 text-lg">
            EduExam Professional Assessment
          </span>
        </p>

        <p className="text-slate-500 text-sm">
          Final Score:
          <span className="text-indigo-600 font-bold ml-2">
            {percentage.toFixed(2)}%
          </span>
        </p>

      </div>

      {/* Footer */}
      <div className="w-full grid grid-cols-2 gap-20 pt-10">

        <div className="border-t border-slate-200 pt-4">

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Certificate Details
          </p>

          <div className="flex justify-between items-center">

            <span className="text-xs font-mono text-slate-600">
              ID: {userId}
            </span>

            <span className="text-xs text-slate-600">
              {date}
            </span>

          </div>

        </div>


        <div className="border-t border-slate-200 pt-4 text-right flex flex-col items-end">

          <ShieldCheck size={24} className="text-indigo-600 mb-1 opacity-60" />

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Authorized Signature
          </p>

          <p className="text-xs font-serif italic text-slate-800 mt-1">
            EduExam Certification Board
          </p>

        </div>

      </div>

    </div>
  );
};

export default Certificate;
