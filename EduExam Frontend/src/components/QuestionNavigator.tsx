import React from 'react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, number>;
  onNavigate: (index: number) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentQuestion,
  answers,
  onNavigate,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-4 max-w-full">
      {Array.from({ length: totalQuestions }).map((_, idx) => {
        const isAnswered = answers[idx] !== undefined;
        const isCurrent = currentQuestion === idx;

        return (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            className={`
              flex-shrink-0 w-10 h-10 rounded-lg font-bold transition-all duration-200
              ${isCurrent 
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2 scale-110' 
                : isAnswered 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}
            `}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionNavigator;
