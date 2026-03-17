import { Award, ShieldCheck } from "lucide-react";

interface CertificateProps {
  username: string;
  userId: string;
  percentage: number;
  date: string;
  location?: string;
}

export default function Certificate({
  username,
  userId,
  percentage,
  date,
  location
}: CertificateProps) {

  const score = Math.round(percentage);

  return (
    <div
      id="certificate-content"
      className="w-[800px] h-[600px] bg-white p-20 relative border-[12px] border-slate-100 flex flex-col items-center justify-between text-slate-800"
    >

      <div className="absolute inset-4 border border-slate-200"></div>

      <div className="text-center">
        <Award className="mx-auto text-indigo-600 mb-4" size={48} />
        <h1 className="text-3xl font-bold uppercase">
          Certificate of Completion
        </h1>
      </div>

      <div className="text-center space-y-4">
        <p>This certificate is proudly presented to</p>

        <h2 className="text-5xl font-bold">{username}</h2>

        {location && (
          <p className="text-sm text-gray-400">{location}</p>
        )}

        <p>
          for successfully completing the
          <br />
          <b>EduExam Professional Assessment</b>
        </p>

        <p className="text-indigo-600 font-bold">
          Score: {score}%
        </p>
      </div>

      <div className="w-full flex justify-between border-t pt-4">

        <span className="text-sm font-mono">
          ID: {userId}
        </span>

        <span className="text-sm">
          {date}
        </span>

        <div className="text-right">
          <ShieldCheck className="text-indigo-600 ml-auto" />
          <p className="text-xs">EduExam Board</p>
        </div>

      </div>

    </div>
  );
}
