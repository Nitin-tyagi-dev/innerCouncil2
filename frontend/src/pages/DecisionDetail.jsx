import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import RecommendationBox from '../components/RecommendationBox';
import PersonaCard from '../components/PersonaCard';
import OutcomeForm from '../components/OutcomeForm';
import { ArrowLeft, Cpu, ShieldAlert, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';

const LOADING_MESSAGES = [
  "Opening AI Council chambers...",
  "Rational Analyst is calculating utility scores...",
  "Budget Guardian is auditing price parameters...",
  "Privacy Guardian is checking security and data footprints...",
  "Long-Term Planner is estimating long-term lifespan...",
  "Risk Manager is scouting for single points of failure...",
  "Emotional Check is weighing stress levels and gut feelings...",
  "Consolidation algorithms resolving conflicting arguments...",
  "Drafting consensus statement and tradeoff logs..."
];

const DecisionDetail = () => {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Loading screen text cycle state
  const [msgIndex, setMsgIndex] = useState(0);
  const cycleInterval = useRef(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const decisionRes = await api.get(`/decisions/${id}`);
      setDecision(decisionRes.data);

      if (decisionRes.data.status === 'complete') {
        // Fetch evaluation
        try {
          const evalRes = await api.get(`/evaluations/${id}`);
          setEvaluation(evalRes.data);
        } catch (e) {
          console.warn('Evaluation not found for complete decision', e);
        }

        // Fetch outcome (if exists)
        try {
          const outcomeRes = await api.get(`/outcomes/${id}`);
          setOutcome(outcomeRes.data);
        } catch (e) {
          // Outcome might not be recorded yet
          setOutcome(null);
        }
      }
    } catch (err) {
      console.error('Fetch decision detail error:', err);
      setErrorMsg('Failed to load decision details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    return () => {
      if (cycleInterval.current) clearInterval(cycleInterval.current);
    };
  }, [id]);

  // Handle cycling through messages during evaluation
  useEffect(() => {
    if (evaluating) {
      setMsgIndex(0);
      cycleInterval.current = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2200);
    } else {
      if (cycleInterval.current) {
        clearInterval(cycleInterval.current);
        cycleInterval.current = null;
      }
    }
  }, [evaluating]);

  const handleRunCouncil = async () => {
    setEvaluating(true);
    setErrorMsg('');
    try {
      const response = await api.post(`/evaluations/${id}`);
      setDecision(response.data.decision);
      setEvaluation(response.data.evaluation);
    } catch (err) {
      console.error('Run evaluation error:', err);
      setErrorMsg(err.response?.data?.message || 'The council failed to complete deliberations. Check Gemini API configuration.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveOutcome = async (outcomeData) => {
    try {
      const response = await api.post(`/outcomes/${id}`, outcomeData);
      setOutcome(response.data);
      return response.data;
    } catch (err) {
      console.error('Save outcome error:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm font-mono">Unlocking Council Vaults...</span>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl">
          Dilemma not found or access denied.
        </div>
        <Link to="/dashboard" className="text-neon-cyan hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
      {/* Deciding Chamber Spinner Overlay */}
      {evaluating && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 mb-8">
            {/* Nested spin circles simulating AI portal */}
            <div className="absolute inset-0 border-4 border-neon-purple/20 border-t-neon-purple rounded-full spin-vortex" />
            <div className="absolute inset-4 border-4 border-neon-cyan/20 border-b-neon-cyan rounded-full spin-vortex-reverse" />
            <div className="absolute inset-8 border-4 border-neon-pink/20 border-l-neon-pink rounded-full spin-vortex" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          
          <div className="text-center max-w-md space-y-3">
            <h3 className="text-2xl font-extrabold text-white tracking-wider">
              Council is Deliberating...
            </h3>
            
            <div className="h-10 flex items-center justify-center">
              <p className="text-neon-cyan text-sm font-mono font-medium transition-opacity duration-300">
                {LOADING_MESSAGES[msgIndex]}
              </p>
            </div>
            
            <p className="text-xs text-slate-500">
              Gemini AI is executing concurrent persona simulations. This can take 5 to 15 seconds.
            </p>
          </div>
        </div>
      )}

      {/* Detail Content */}
      <div className="space-y-8">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {errorMsg && (
          <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-mono rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Top Header Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-neon-purple tracking-widest font-mono uppercase bg-neon-purple/10 border border-neon-purple/10 px-2.5 py-0.5 rounded">
                  {decision.category || 'General'}
                </span>
                {decision.status === 'complete' ? (
                  <span className="flex items-center gap-1 text-xs text-neon-teal bg-neon-teal/10 border border-neon-teal/20 px-2.5 py-0.5 rounded-full font-mono">
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-0.5 rounded-full font-mono">
                    Ready to Convene
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">
                {decision.title}
              </h1>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {decision.description}
              </p>
            </div>

            {decision.status !== 'complete' && (
              <button
                onClick={handleRunCouncil}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold gradient-btn-cyan shadow-lg shadow-neon-cyan/20 cursor-pointer self-start"
              >
                <Sparkles className="w-4 h-4" />
                Run Inner Council
              </button>
            )}
          </div>

          {/* Criteria & Personas Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5">
            <div>
              <span className="text-xs font-bold text-slate-500 tracking-wider block font-mono uppercase mb-3">
                Extracted Criteria
              </span>
              <div className="flex flex-wrap gap-2">
                {decision.generatedCriteria.map((c, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-white/3 border border-white/5 text-slate-300 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 tracking-wider block font-mono uppercase mb-3">
                Assigned AI Personas
              </span>
              <div className="flex flex-wrap gap-2">
                {decision.selectedPersonas.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-cyan font-mono"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deliberated View (Recommendations & Debates) */}
        {decision.status === 'complete' && (
          <div className="space-y-12">
            {/* 1. Recommendation Result */}
            {decision.finalRecommendation && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  Final Verdict
                </h3>
                <RecommendationBox recommendation={decision.finalRecommendation} />
              </div>
            )}

            {/* 2. Persona Debate Cards */}
            {evaluation && evaluation.personaDebate && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-neon-purple" />
                  Council Member Perspectives
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {evaluation.personaDebate.map((item, idx) => (
                    <PersonaCard key={idx} debateData={item} />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Outcome Logger */}
            <div className="max-w-3xl">
              <OutcomeForm
                decision={decision}
                initialOutcome={outcome}
                onSave={handleSaveOutcome}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionDetail;
