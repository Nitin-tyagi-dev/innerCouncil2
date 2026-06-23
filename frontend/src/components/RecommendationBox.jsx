import React from 'react';
import { Award, AlertCircle, CheckCircle2 } from 'lucide-react';

const RecommendationBox = ({ recommendation }) => {
  const { bestOption, reason, tradeoff, scores } = recommendation;

  // Find max score to style best option bar specifically if needed
  const maxScore = Math.max(...scores.map((s) => s.total));

  return (
    <div className="space-y-6">
      {/* Golden Highlight Card for the Winning Option */}
      <div className="glass-panel border-yellow-500/30 glow-purple rounded-3xl p-6 md:p-8 bg-gradient-to-r from-yellow-500/5 via-neon-purple/5 to-transparent relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-40 h-40 text-yellow-400" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          <div className="p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-xl shadow-yellow-500/20 self-start md:self-center">
            <Award className="w-8 h-8 text-slate-950" />
          </div>

          <div className="space-y-2 flex-1">
            <span className="text-xs font-bold text-yellow-400 tracking-widest font-mono uppercase">
              COUNCIL RECOMMENDATION
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {bestOption}
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed pt-2">
              {reason}
            </p>
          </div>
        </div>

        {/* Tradeoff Alert Box */}
        {tradeoff && (
          <div className="mt-6 flex gap-3 p-4 bg-white/3 rounded-2xl border border-white/5 items-start">
            <AlertCircle className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-neon-cyan tracking-wider block font-mono uppercase">
                CRITICAL TRADEOFF / CAVEAT
              </span>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                {tradeoff}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Score Comparison Bars */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-400 tracking-wider font-mono uppercase mb-5">
          Option Score Comparison (Out of 10)
        </h3>

        <div className="space-y-4">
          {scores.map((item, index) => {
            const isWinner = item.option === bestOption || item.total === maxScore;
            // Percent out of 10 points
            const percentage = Math.min(Math.max((item.total / 10) * 100, 0), 100);

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{item.option}</span>
                    {isWinner && (
                      <span className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Best
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-slate-400 font-mono">
                    <strong className="text-white text-base">{item.total}</strong> / 10
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-3 bg-slate-950/80 rounded-full border border-white/5 overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isWinner
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md shadow-yellow-500/20'
                        : 'bg-gradient-to-r from-neon-purple to-neon-blue'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendationBox;
