import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import OutcomeForm from "../components/OutcomeForm";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const Outcome = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decision, setDecision] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDecisionAndOutcome = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const decisionRes = await api.get(`/decisions/${id}`);
        setDecision(decisionRes.data);

        try {
          const outcomeRes = await api.get(`/outcomes/${id}`);
          setOutcome(outcomeRes.data);
        } catch {
          setOutcome(null);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Unable to load this decision.");
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionAndOutcome();
  }, [id]);

  const handleSaveOutcome = async (data) => {
    try {
      const res = await api.post(`/outcomes/${id}`, data);
      setOutcome(res.data);
      navigate(`/decisions/${id}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />

          <p className="mt-6 text-sm text-slate-400">
            Loading outcome...
          </p>

        </div>

      </div>
    );
  }

  if (errorMsg || !decision) {
    return (
      <div className="mx-auto mt-24 max-w-lg">

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">

          <h2 className="text-xl font-semibold text-white">
            Something went wrong
          </h2>

          <p className="mt-3 text-slate-400">
            {errorMsg || "Decision not found."}
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-slate-200"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      {/* Back */}

      <Link
        to={`/decisions/${id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Decision
      </Link>

      {/* Header Card */}

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">

        <div className="flex items-start gap-5">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

            <CheckCircle2 className="h-7 w-7 text-white" />

          </div>

          <div className="flex-1">

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
              Outcome Review
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              {decision.title}
            </h1>

            <p className="mt-5 leading-8 text-slate-400">
              {decision.description}
            </p>

          </div>

        </div>

      </div>

      {/* Form */}

      <div className="mt-10">

        <OutcomeForm
          decision={decision}
          initialOutcome={outcome}
          onSave={handleSaveOutcome}
        />

      </div>

    </div>
  );
};

export default Outcome;