import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import OutcomeForm from '../components/OutcomeForm';
import { ArrowLeft, CheckSquare } from 'lucide-react';

const Outcome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDecisionAndOutcome = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        
        const decisionRes = await api.get(`/decisions/${id}`);
        setDecision(decisionRes.data);

        try {
          const outcomeRes = await api.get(`/outcomes/${id}`);
          setOutcome(outcomeRes.data);
        } catch (e) {
          // Outcome might not be recorded yet
          setOutcome(null);
        }
      } catch (err) {
        console.error('Fetch error in outcome page:', err);
        setErrorMsg('Failed to load decision detail.');
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionAndOutcome();
  }, [id]);

  const handleSaveOutcome = async (outcomeData) => {
    try {
      const response = await api.post(`/outcomes/${id}`, outcomeData);
      setOutcome(response.data);
      // Redirect back to decision details
      navigate(`/decisions/${id}`);
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
        <span className="text-slate-400 text-sm font-mono font-medium">Loading outcome profile...</span>
      </div>
    );
  }

  if (errorMsg || !decision) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl">
          {errorMsg || 'Decision not found or access denied.'}
        </div>
        <Link to="/dashboard" className="text-neon-cyan hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">
      {/* Back Link */}
      <Link
        to={`/decisions/${id}`}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors hover:no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Decision Details
      </Link>

      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-neon-teal/10 text-neon-teal rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider block font-mono uppercase">
              RECORD OUTCOME FOR
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">
              {decision.title}
            </h2>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          {decision.description}
        </p>
      </div>

      <OutcomeForm
        decision={decision}
        initialOutcome={outcome}
        onSave={handleSaveOutcome}
      />
    </div>
  );
};

export default Outcome;
