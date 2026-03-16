import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface CertificateProps {
  username: string;
  userId: string;
  percentage: number;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({ username, userId, percentage, date }) => {
  return (
    <div 
      id="certificate-content"
      className="w-[800px] h-[600px] bg-white p-12 relative border-[16px] border-double border-indigo-600 flex flex-col items-center justify-between text-slate-800 font-serif"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-indigo-300" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-indigo-300" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-indigo-300" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-indigo-300" />

      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Award size={64} className="text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black tracking-widest uppercase mb-2 text-indigo-900">Certificate</h1>
        <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-slate-500">of Achievement</h2>
      </div>

      {/* Body */}
      <div className="text-center space-y-6">
        <p className="text-lg italic text-slate-600">This is to certify that</p>
        <h3 className="text-4xl font-black text-slate-900 border-b-2 border-slate-200 pb-2 px-12 inline-block">
          {username}
        </h3>
        <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
          has successfully completed the <span className="font-bold text-indigo-600">EduExam Online Examination</span> with an outstanding performance score of
        </p>
        <div className="text-5xl font-black text-indigo-600">
          {percentage}%
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex justify-between items-end px-8">
        <div className="text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
          <p className="text-sm font-bold">{date}</p>
          <div className="w-32 h-px bg-slate-300 mt-1" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border-2 border-indigo-100 mb-2">
            <ShieldCheck size={40} className="text-indigo-600" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Official EduExam Seal</p>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certificate ID</p>
          <p className="text-sm font-mono font-bold text-indigo-600">{userId}</p>
          <div className="w-32 h-px bg-slate-300 mt-1" />
        </div>
      </div>

      {/* Signature Placeholder */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
        <p className="font-serif italic text-2xl text-slate-400 mb-1">EduExam Board</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</p>
      </div>
    </div>
  );
};

export default Certificate;
