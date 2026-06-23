import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Search, Eye, Filter, ArrowUpDown } from 'lucide-react';

const History = () => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // desc or asc

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/decisions');
        setDecisions(response.data);
      } catch (err) {
        console.error('Fetch history error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case 'analyzed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">Analyzed</span>;
      case 'complete':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-neon-teal/10 text-neon-teal border border-neon-teal/20">Evaluated</span>;
      default:
        return null;
    }
  };

  // Filter & Search Logic
  const filteredDecisions = decisions
    .filter((d) => {
      const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Extract unique categories for filter dropdown
  const categories = ['all', ...new Set(decisions.map((d) => d.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight m-0 mb-2">
          Decision History
        </h1>
        <p className="text-slate-400 text-sm">
          Browse through all past AI deliberations, outcomes, and satisfaction ratings.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/5 shadow-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dilemmas..."
            className="w-full cyber-input pl-9 text-xs py-2"
          />
        </div>

        {/* Category Filter & Sort */}
        <div className="flex w-full md:w-auto items-center gap-4 justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="cyber-input text-xs py-1.5 px-3 bg-panel-dark border-white/10"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-mono">Loading decision logs...</span>
        </div>
      ) : filteredDecisions.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/5">
          <span className="text-slate-500 text-sm font-mono block">No decisions found.</span>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/3 border-b border-white/5 text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase">
                  <th className="px-6 py-4">Title / Dilemma</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date Created</th>
                  <th className="px-6 py-4">Suggested Best</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredDecisions.map((decision) => (
                  <tr key={decision._id} className="hover:bg-white/1 transition-colors duration-150">
                    <td className="px-6 py-4 max-w-xs md:max-w-sm">
                      <div className="font-semibold text-white truncate">{decision.title}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{decision.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {decision.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {new Date(decision.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {decision.finalRecommendation?.bestOption ? (
                        <span className="font-bold text-yellow-400">{decision.finalRecommendation.bestOption}</span>
                      ) : (
                        <span className="text-xs italic text-slate-500">Not Evaluated</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(decision.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/decisions/${decision._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neon-cyan/5 hover:bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20 rounded-lg text-xs font-semibold tracking-wider font-mono hover:no-underline transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
