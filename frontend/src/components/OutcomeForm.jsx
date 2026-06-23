import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Save, CheckCircle } from 'lucide-react';

const OutcomeForm = ({ decision, initialOutcome, onSave }) => {
  const [chosenOption, setChosenOption] = useState('');
  const [satisfactionScore, setSatisfactionScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

  useEffect(() => {
    if (initialOutcome) {
      setChosenOption(initialOutcome.chosenOption || '');
      setSatisfactionScore(initialOutcome.satisfactionScore || 5);
      setNotes(initialOutcome.notes || '');
    } else if (decision && decision.options.length > 0) {
      setChosenOption(decision.options[0]);
    }
  }, [initialOutcome, decision]);

  const getSmileIcon = (score) => {
    const props = { className: 'w-8 h-8 transition-colors duration-200' };
    if (score >= 8) return <Smile {...props} className={`${props.className} text-neon-teal`} />;
    if (score >= 5) return <Meh {...props} className={`${props.className} text-yellow-400`} />;
    return <Frown {...props} className={`${props.className} text-rose-500`} />;
  };

  const getSatisfactionLabel = (score) => {
    if (score >= 9) return 'Extremely Satisfied — Best choice!';
    if (score >= 7) return 'Satisfied — Good decision.';
    if (score >= 5) return 'Neutral — Mixed results.';
    if (score >= 3) return 'Dissatisfied — Regretful decision.';
    return 'Highly Regretful — Bad choice.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveStatus(null);
    try {
      await onSave({ chosenOption, satisfactionScore, notes });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Journal the Outcome</h3>
        <p className="text-xs text-slate-400">
          Reflect back on your decision. Which path did you actually take, and how did it work out?
        </p>
      </div>

      {/* Chosen Option Dropdown */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
          Which Option Did You Select?
        </label>
        <select
          value={chosenOption}
          onChange={(e) => setChosenOption(e.target.value)}
          className="w-full cyber-input text-sm cursor-pointer"
          required
        >
          {decision.options.map((opt, idx) => (
            <option key={idx} value={opt} className="bg-panel-dark text-white">
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Satisfaction Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
            Satisfaction Score ({satisfactionScore}/10)
          </label>
          {getSmileIcon(satisfactionScore)}
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={satisfactionScore}
          onChange={(e) => setSatisfactionScore(Number(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-neon-purple"
        />

        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/3 rounded-lg text-xs font-medium text-slate-300 font-mono">
            {getSatisfactionLabel(satisfactionScore)}
          </span>
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
          Outcome Notes / Reflections
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          placeholder="E.g., It was more expensive than I planned but totally worth it. The premium features are stellar..."
          className="w-full cyber-input text-sm resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold gradient-btn shadow-lg shadow-neon-purple/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Log Entry'}
        </button>

        {saveStatus === 'success' && (
          <div className="flex items-center gap-1.5 text-xs text-neon-teal font-mono">
            <CheckCircle className="w-4 h-4" /> Log entry saved successfully!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="text-xs text-rose-400 font-mono">
            Error saving log entry.
          </div>
        )}
      </div>
    </form>
  );
};

export default OutcomeForm;
