import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

import RecommendationBox from "../components/RecommendationBox";
import PersonaCard from "../components/PersonaCard";
import OutcomeForm from "../components/OutcomeForm";

import {
  ArrowLeft,
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Calendar,
  Tag,
  Play,
} from "lucide-react";

const LOADING_MESSAGES = [
  "Collecting perspectives...",
  "Analyzing every option...",
  "Evaluating trade-offs...",
  "Comparing long-term outcomes...",
  "Estimating possible risks...",
  "Building recommendation...",
  "Finalizing decision..."
];

const statusStyles = {
  pending: {
    label: "Pending",
    classes:
      "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  },

  complete: {
    label: "Completed",
    classes:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  },
};

const StatusBadge = ({ status }) => {
  const style =
    statusStyles[status] ||
    statusStyles.pending;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${style.classes}`}
    >
      {style.label}
    </span>
  );
};

const DecisionDetail = () => {
  const { id } = useParams();

  const [decision, setDecision] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [outcome, setOutcome] = useState(null);

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [msgIndex, setMsgIndex] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    fetchDetails();

    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (!evaluating) {
      if (intervalRef.current)
        clearInterval(intervalRef.current);

      return;
    }

    setMsgIndex(0);

    intervalRef.current = setInterval(() => {
      setMsgIndex((prev) =>
        (prev + 1) % LOADING_MESSAGES.length
      );
    }, 1800);

    return () => clearInterval(intervalRef.current);
  }, [evaluating]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const decisionRes = await api.get(
        `/decisions/${id}`
      );

      setDecision(decisionRes.data);

      if (
        decisionRes.data.status === "complete"
      ) {
        try {
          const evalRes = await api.get(
            `/evaluations/${id}`
          );

          setEvaluation(evalRes.data);
        } catch {}

        try {
          const outcomeRes = await api.get(
            `/outcomes/${id}`
          );

          setOutcome(outcomeRes.data);
        } catch {
          setOutcome(null);
        }
      }
    } catch (err) {
      console.error(err);

      setErrorMsg(
        "Unable to load this decision."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRunCouncil = async () => {
    setEvaluating(true);
    setErrorMsg("");

    try {
      const res = await api.post(
        `/evaluations/${id}`
      );

      setDecision(res.data.decision);
      setEvaluation(res.data.evaluation);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to evaluate decision."
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveOutcome = async (
    outcomeData
  ) => {
    const res = await api.post(
      `/outcomes/${id}`,
      outcomeData
    );

    setOutcome(res.data);

    return res.data;
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <Loader2 className="mx-auto h-10 w-10 animate-spin text-white" />

          <p className="mt-6 text-slate-400">
            Loading decision...
          </p>

        </div>

      </div>
    );
  }

  if (!decision) {
    return (
      <div className="mx-auto mt-24 max-w-lg rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center">

        <h2 className="text-2xl font-semibold text-white">
          Decision not found
        </h2>

        <p className="mt-4 text-slate-400">
          {errorMsg}
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-slate-200"
        >
          Back to Dashboard
        </Link>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {evaluating && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">

          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#111111] p-10 text-center">

            <Loader2 className="mx-auto h-14 w-14 animate-spin text-white" />

            <h2 className="mt-8 text-2xl font-semibold text-white">
              AI Council is thinking
            </h2>

            <p className="mt-5 text-slate-400">
              {LOADING_MESSAGES[msgIndex]}
            </p>

          </div>

        </div>

      )}

      <Link
        to="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
            {errorMsg && (
        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Hero Card */}

      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          {/* Left */}

          <div className="flex-1">

            <div className="mb-6 flex flex-wrap items-center gap-3">

              <StatusBadge status={decision.status} />

              {decision.category && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  <Tag size={14} />
                  {decision.category}
                </span>
              )}

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                <Calendar size={14} />
                {new Date(
                  decision.createdAt
                ).toLocaleDateString()}
              </span>

            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white">

              {decision.title}

            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400">

              {decision.description}

            </p>

          </div>

          {/* Right */}

          {decision.status !== "complete" && (

            <button
              onClick={handleRunCouncil}
              className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-white
              px-6
              py-4
              font-semibold
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-slate-200
            "
            >

              <Play size={18} />

              Run AI Council

            </button>

          )}

        </div>

        {/* Divider */}

        <div className="my-10 border-t border-white/10" />

        {/* Bottom */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Criteria */}

          <div>

            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-slate-500">

              Evaluation Criteria

            </h3>

            <div className="flex flex-wrap gap-3">

              {decision.generatedCriteria?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-2
                    text-sm
                    text-slate-300
                  "
                  >
                    {item}
                  </div>

                )
              )}

            </div>

          </div>

          {/* Personas */}

          <div>

            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-slate-500">

              AI Council Members

            </h3>

            <div className="flex flex-wrap gap-3">

              {decision.selectedPersonas?.map(
                (persona, index) => (

                  <div
                    key={index}
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-2
                  "
                  >

                    <BrainCircuit
                      size={15}
                      className="text-slate-400"
                    />

                    <span className="text-sm text-slate-300">

                      {persona}

                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Results */}

      {decision.status === "complete" && (

        <div className="mt-12 space-y-12">

          {/* Recommendation */}

          {decision.finalRecommendation && (

            <section>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

                  <CheckCircle2
                    className="text-emerald-400"
                    size={22}
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-semibold text-white">

                    Final Recommendation

                  </h2>

                  <p className="text-slate-500">

                    Generated by your AI Council

                  </p>

                </div>

              </div>

              <RecommendationBox
                recommendation={
                  decision.finalRecommendation
                }
              />

            </section>

          )}
                    {/* Persona Opinions */}

          {evaluation?.personaDebate && (
            <section>

              <div className="mb-8 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

                  <Sparkles
                    size={20}
                    className="text-white"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-semibold text-white">
                    AI Council Perspectives
                  </h2>

                  <p className="text-slate-500">
                    Individual reasoning from every council member.
                  </p>

                </div>

              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {evaluation.personaDebate.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        backdrop-blur-xl
                        p-1
                      "
                    >

                      <PersonaCard debateData={item} />

                    </div>

                  )
                )}

              </div>

            </section>
          )}

          {/* Outcome */}

          <section>

            <div className="mb-8 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

                <CheckCircle2
                  size={20}
                  className="text-white"
                />

              </div>

              <div>

                <h2 className="text-2xl font-semibold text-white">
                  Record Outcome
                </h2>

                <p className="text-slate-500">
                  Compare your final decision with the AI recommendation.
                </p>

              </div>

            </div>

            <div
              className="
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.04]
                backdrop-blur-xl
                p-8
              "
            >

              <OutcomeForm
                decision={decision}
                initialOutcome={outcome}
                onSave={handleSaveOutcome}
              />

            </div>

          </section>

        </div>

      )}

    </div>

  );
};

export default DecisionDetail;