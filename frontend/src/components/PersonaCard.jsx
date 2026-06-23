import React from 'react';
import { Brain, Coins, Lock, Hourglass, ShieldAlert, Heart, Star } from 'lucide-react';

const PERSONA_THEMES = {
  'Rational Analyst': {
    color: 'text-neon-cyan',
    border: 'border-neon-cyan/20 hover:border-neon-cyan/40',
    bg: 'bg-neon-cyan/5',
    glow: 'hover:shadow-neon-cyan/10',
    gradient: 'from-neon-cyan/20 to-transparent',
    iconColor: 'bg-neon-cyan/10 text-neon-cyan',
    icon: Brain,
    desc: 'Analyzes parameters logically and values performance, efficacy, and utility.'
  },
  'Budget Guardian': {
    color: 'text-neon-teal',
    border: 'border-neon-teal/20 hover:border-neon-teal/40',
    bg: 'bg-neon-teal/5',
    glow: 'hover:shadow-neon-teal/10',
    gradient: 'from-neon-teal/20 to-transparent',
    iconColor: 'bg-neon-teal/10 text-neon-teal',
    icon: Coins,
    desc: 'Evaluates cost efficiency, ROI, ongoing maintenance, and budget boundaries.'
  },
  'Privacy Guardian': {
    color: 'text-yellow-400',
    border: 'border-yellow-400/20 hover:border-yellow-400/40',
    bg: 'bg-yellow-400/5',
    glow: 'hover:shadow-yellow-400/10',
    gradient: 'from-yellow-400/20 to-transparent',
    iconColor: 'bg-yellow-400/10 text-yellow-400',
    icon: Lock,
    desc: 'Assesses information safety, vendor privacy guidelines, and digital footprints.'
  },
  'Long-Term Planner': {
    color: 'text-neon-purple',
    border: 'border-neon-purple/20 hover:border-neon-purple/40',
    bg: 'bg-neon-purple/5',
    glow: 'hover:shadow-neon-purple/10',
    gradient: 'from-neon-purple/20 to-transparent',
    iconColor: 'bg-neon-purple/10 text-neon-purple',
    icon: Hourglass,
    desc: 'Stresses scalability, structural longevity, and future adaptation capabilities.'
  },
  'Risk Manager': {
    color: 'text-red-400',
    border: 'border-red-400/20 hover:border-red-400/40',
    bg: 'bg-red-400/5',
    glow: 'hover:shadow-red-400/10',
    gradient: 'from-red-400/20 to-transparent',
    iconColor: 'bg-red-400/10 text-red-400',
    icon: ShieldAlert,
    desc: 'Focuses on critical downside risks, points of failure, and safety margins.'
  },
  'Emotional Check': {
    color: 'text-neon-pink',
    border: 'border-neon-pink/20 hover:border-neon-pink/40',
    bg: 'bg-neon-pink/5',
    glow: 'hover:shadow-neon-pink/10',
    gradient: 'from-neon-pink/20 to-transparent',
    iconColor: 'bg-neon-pink/10 text-neon-pink',
    icon: Heart,
    desc: 'Appraises subjective contentment, value alignment, stress factors, and gut feelings.'
  }
};

const PersonaCard = ({ debateData }) => {
  const { persona, evaluations } = debateData;
  const theme = PERSONA_THEMES[persona] || {
    color: 'text-white',
    border: 'border-white/10 hover:border-white/20',
    bg: 'bg-white/5',
    glow: 'hover:shadow-white/10',
    gradient: 'from-white/10 to-transparent',
    iconColor: 'bg-white/10 text-white',
    icon: Brain,
    desc: 'AI Council Member.'
  };

  const IconComponent = theme.icon;

  return (
    <div className={`glass-panel rounded-2xl overflow-hidden p-6 border transition-all duration-300 shadow-xl ${theme.border} ${theme.glow} flex flex-col justify-between h-full bg-gradient-to-b ${theme.gradient}`}>
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl ${theme.iconColor} shadow-md`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg leading-tight ${theme.color}`}>{persona}</h3>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">COUNCIL MEMBER</span>
          </div>
        </div>

        {/* Persona Role Description */}
        <p className="text-xs text-slate-400 italic mb-5 leading-relaxed">
          {theme.desc}
        </p>

        {/* Evaluations */}
        <div className="space-y-5">
          {evaluations.map((evalItem, index) => {
            // Calculate option average score from this persona
            const totalScore = evalItem.scores.reduce((sum, s) => sum + s.score, 0);
            const avgScore = evalItem.scores.length > 0 ? (totalScore / evalItem.scores.length).toFixed(1) : 0;

            return (
              <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-100">{evalItem.option}</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-white/10">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-slate-200">{avgScore}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider block uppercase">Insight</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{evalItem.summary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider block uppercase">Key Concern</span>
                    <p className="text-xs text-rose-300/90 leading-relaxed font-medium">⚠️ {evalItem.concerns}</p>
                  </div>
                </div>

                {/* Score breakdown per criterion */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase mb-1.5">Criteria Breakdown</span>
                  <div className="flex flex-wrap gap-1.5">
                    {evalItem.scores.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/3 border border-white/5 text-slate-400 font-mono"
                      >
                        {s.criterion}: <strong className="text-slate-200">{s.score}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonaCard;
