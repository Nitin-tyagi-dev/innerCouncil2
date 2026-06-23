import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Plus, MessageSquare, Trash2, ArrowRight, HelpCircle, CheckSquare, BarChart, FileText } from 'lucide-react';

const Dashboard = () => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/decisions');
      setDecisions(response.data);
    } catch (err) {
      console.error('Fetch decisions error:', err);
      setErrorMsg('Failed to load decisions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Stop click propagation to the card link
    if (window.confirm('Are you sure you want to delete this decision and all associated data?')) {
      try {
        await api.delete(`/decisions/${id}`);
        setDecisions(decisions.filter(d => d._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
        alert('Could not delete decision. Please try again.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-mono font-medium animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending Context
          </span>
        );
      case 'analyzed':
        return (
          <span className="flex items-center gap-1.5 text-xs text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-0.5 rounded-full font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
            Ready for Council
          </span>
        );
      case 'complete':
        return (
          <span className="flex items-center gap-1.5 text-xs text-neon-teal bg-neon-teal/10 border border-neon-teal/20 px-2.5 py-0.5 rounded-full font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-teal" />
            Deliberated
          </span>
        );
      default:
        return null;
    }
  };

  // Metrics calculations
  const total = decisions.length;
  const deliberated = decisions.filter(d => d.status === 'complete').length;
  const pending = total - deliberated;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0 mb-2">
            Decision Control Center
          </h1>
          <p className="text-slate-400 text-sm">
            Leverage AI intelligence and customized council perspectives to untangle your real-life dilemmas.
          </p>
        </div>
        <Link
          to="/create-decision"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold gradient-btn shadow-lg shadow-neon-purple/20 cursor-pointer self-start md:self-center"
        >
          <Plus className="w-5 h-5" />
          Create New Dilemma
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-tr from-white/3 to-transparent flex items-center gap-4">
          <div className="p-3 bg-neon-purple/10 text-neon-purple rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-white">{total}</span>
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Total Dilemmas</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-tr from-white/3 to-transparent flex items-center gap-4">
          <div className="p-3 bg-neon-teal/10 text-neon-teal rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-white">{deliberated}</span>
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Council Convened</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-gradient-to-tr from-white/3 to-transparent flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-white">{pending}</span>
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Awaiting Action</span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-mono rounded-xl mb-6">
          {errorMsg}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-mono">Accessing Archives...</span>
        </div>
      ) : decisions.length === 0 ? (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex p-4 bg-white/5 rounded-full border border-white/10 text-slate-500">
              <MessageSquare className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white">No dilemmas registered</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Every big decision is easier with a council. Enter your first real-life dilemma, select your options, and trigger the AI debate.
            </p>
            <Link
              to="/create-decision"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold gradient-btn shadow-lg shadow-neon-purple/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create First Dilemma
            </Link>
          </div>
        </div>
      ) : (
        /* Decisions Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decisions.map((decision) => (
            <Link
              key={decision._id}
              to={`/decisions/${decision._id}`}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:no-underline group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-neon-purple tracking-widest font-mono uppercase bg-neon-purple/10 border border-neon-purple/10 px-2 py-0.5 rounded">
                    {decision.category || 'GENERAL'}
                  </span>
                  {getStatusBadge(decision.status)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors duration-200 line-clamp-1">
                    {decision.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {decision.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider block font-mono uppercase mb-1">
                    OPTIONS UNDER CONSIDERATION
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {decision.options.map((opt, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-300"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>

                {decision.status === 'complete' && decision.finalRecommendation && (
                  <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                    <span className="text-[9px] font-bold text-yellow-400 tracking-wider block font-mono uppercase">
                      WINNING RECOMMENDATION
                    </span>
                    <span className="text-sm font-bold text-white">
                      {decision.finalRecommendation.bestOption}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{new Date(decision.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleDelete(decision._id, e)}
                    className="p-1.5 hover:bg-red-950/40 border border-transparent hover:border-red-900/40 text-slate-500 hover:text-red-400 rounded-md transition-all duration-200 cursor-pointer"
                    title="Delete Dilemma"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="flex items-center gap-1 text-neon-cyan group-hover:translate-x-1 transition-transform duration-200 font-semibold text-xs">
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
