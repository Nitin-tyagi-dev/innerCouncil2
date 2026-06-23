import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Plus, Trash2, HelpCircle, Save, FileText, List } from 'lucide-react';

const CreateDecision = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOptionField = () => {
    setOptions([...options, '']);
  };

  const removeOptionField = (index) => {
    if (options.length <= 2) {
      setErrorMsg('You must provide at least 2 options.');
      return;
    }
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Title and description are required.');
      return;
    }

    const filteredOptions = options.map((opt) => opt.trim()).filter((opt) => opt !== '');
    if (filteredOptions.length < 2) {
      setErrorMsg('Please specify at least 2 non-empty options for the council to evaluate.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/decisions', {
        title,
        description,
        options: filteredOptions,
      });
      // Redirect to the newly created decision page
      navigate(`/decisions/${response.data._id}`);
    } catch (err) {
      console.error('Submit dilemma error:', err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while creating the decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight m-0 mb-2">
          State Your Dilemma
        </h1>
        <p className="text-slate-400 text-sm">
          Define the context, explanation, and potential paths. The AI will parse this to generate custom evaluation criteria.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-mono rounded-xl mb-6">
          {errorMsg}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Info */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
            <FileText className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-bold text-white">Dilemma Parameters</h3>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
              Decision Title / Dilemma
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full cyber-input text-sm"
              placeholder="e.g., Which smartphone should I purchase next?"
              required
            />
            <span className="text-[10px] text-slate-500 block">Keep it concise and clear.</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
              Detailed Description / Context
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="w-full cyber-input text-sm resize-none"
              placeholder="e.g., I'm stuck between getting an iPhone 15 Pro and a Google Pixel 8 Pro. I care heavily about photo quality, data privacy, long-term battery health, and price since I plan to keep the device for at least 4 years..."
              required
            />
            <span className="text-[10px] text-slate-500 block">
              Provide extra background details like what factors you care about, budget constraints, or usage style.
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <List className="w-5 h-5 text-neon-cyan" />
              <h3 className="text-lg font-bold text-white">Options to Evaluate</h3>
            </div>
            <button
              type="button"
              onClick={addOptionField}
              className="flex items-center gap-1.5 text-xs font-bold text-neon-cyan hover:text-neon-teal px-3 py-1.5 bg-neon-cyan/5 hover:bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex gap-3 items-center">
                <span className="text-xs font-mono font-bold text-slate-500 w-6">
                  #{index + 1}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 cyber-input text-sm"
                  placeholder={`Option e.g., Apple iPhone 15 Pro`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOptionField(index)}
                  disabled={options.length <= 2}
                  className="p-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-700/50 text-red-400 rounded-lg disabled:opacity-30 disabled:hover:bg-red-950/20 disabled:hover:border-red-900/30 disabled:cursor-not-allowed cursor-pointer"
                  title="Remove Option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold gradient-btn shadow-lg shadow-neon-purple/20 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Summoning AI...' : 'Create & Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDecision;
