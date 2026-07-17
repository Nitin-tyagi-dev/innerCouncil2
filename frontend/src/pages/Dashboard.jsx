import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

import {
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  FolderOpen,
  FileText,
  CheckCircle2,
  Clock3,
  Calendar,
  Tag
} from "lucide-react";

const statusStyles = {
  pending: {
    label: "Pending",
    classes:
      "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  },

  analyzed: {
    label: "Ready",
    classes:
      "bg-blue-500/10 text-blue-300 border border-blue-500/20",
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

const MetricCard = ({
  icon,
  title,
  value,
}) => (
  <div
    className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-xl
      p-6
    "
  >
    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          {value}
        </h2>

      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

        {icon}

      </div>

    </div>

  </div>
);

const DecisionCard = ({
  decision,
  handleDelete,
}) => (
  <Link
    to={`/decisions/${decision._id}`}
    className="group block"
  >

    <div
      className="
        rounded-[30px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        p-7
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-white/20
      "
    >

      <div className="flex items-start justify-between">

        <div className="flex flex-wrap gap-3">

          <StatusBadge
            status={decision.status}
          />

          {decision.category && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">

              <Tag size={13} />

              {decision.category}

            </span>
          )}

        </div>

        <button
          onClick={(e) =>
            handleDelete(
              decision._id,
              e
            )
          }
          className="
            rounded-xl
            p-2
            text-slate-500
            transition
            hover:bg-red-500/10
            hover:text-red-400
          "
        >
          <Trash2 size={17} />
        </button>

      </div>

      <h2 className="mt-6 text-2xl font-semibold text-white">

        {decision.title}

      </h2>

      <p className="mt-4 line-clamp-3 leading-7 text-slate-400">

        {decision.description}

      </p>

      <div className="mt-6 flex flex-wrap gap-2">

        {decision.options
          ?.slice(0, 4)
          .map((option, index) => (

            <span
              key={index}
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-3
                py-1.5
                text-xs
                text-slate-300
              "
            >
              {option}
            </span>

          ))}

      </div>

      {decision.finalRecommendation
        ?.bestOption && (

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">

          <p className="text-xs text-emerald-300">

            Recommended

          </p>

          <h3 className="mt-2 font-medium text-white">

            {
              decision.finalRecommendation
                .bestOption
            }

          </h3>

        </div>

      )}

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Calendar size={16} />

          {new Date(
            decision.createdAt
          ).toLocaleDateString()}

        </div>

        <div className="flex items-center gap-2 font-medium text-white transition group-hover:translate-x-1">

          View

          <ArrowRight size={17} />

        </div>

      </div>

    </div>

  </Link>
);

const Dashboard = () => {

  const [decisions, setDecisions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMsg, setErrorMsg] =
    useState("");

  const fetchDecisions =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            "/decisions"
          );

        setDecisions(res.data);
      } catch (err) {
        console.error(err);

        setErrorMsg(
          "Unable to load your decisions."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleDelete =
    async (id, e) => {

      e.preventDefault();

      if (
        !window.confirm(
          "Delete this decision?"
        )
      )
        return;

      try {
        await api.delete(
          `/decisions/${id}`
        );

        setDecisions(
          decisions.filter(
            (d) => d._id !== id
          )
        );
      } catch {
        alert(
          "Unable to delete decision."
        );
      }
    };

  const total =
    decisions.length;

  const completed =
    decisions.filter(
      (d) =>
        d.status === "complete"
    ).length;

  const pending =
    total - completed;

  return (

    <div className="mx-auto max-w-7xl px-6 py-10">
            {/* Hero */}

      <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="mb-3 text-sm font-medium text-slate-500">
            Welcome back
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-white">
            Decision Dashboard
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Review previous decisions, compare recommendations,
            and continue making thoughtful choices with your AI Council.
          </p>

        </div>

        <Link
          to="/create-decision"
          className="
            inline-flex
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
          <Plus size={20} />
          New Decision
        </Link>

      </div>

      {/* Stats */}

      <div className="mb-12 grid gap-6 md:grid-cols-3">

        <MetricCard
          title="Total Decisions"
          value={total}
          icon={
            <FileText
              className="text-white"
              size={26}
            />
          }
        />

        <MetricCard
          title="Completed"
          value={completed}
          icon={
            <CheckCircle2
              className="text-emerald-400"
              size={26}
            />
          }
        />

        <MetricCard
          title="Pending"
          value={pending}
          icon={
            <Clock3
              className="text-amber-300"
              size={26}
            />
          }
        />

      </div>

      {/* Error */}

      {errorMsg && (

        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">

          {errorMsg}

        </div>

      )}

      {/* Loading */}

      {loading && (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({ length: 6 }).map((_, i) => (

            <div
              key={i}
              className="
                animate-pulse
                rounded-[30px]
                border
                border-white/10
                bg-white/[0.04]
                p-7
              "
            >

              <div className="mb-6 h-6 w-28 rounded bg-white/10" />

              <div className="mb-4 h-8 w-2/3 rounded bg-white/10" />

              <div className="mb-3 h-4 rounded bg-white/10" />

              <div className="mb-3 h-4 rounded bg-white/10" />

              <div className="mb-8 h-4 w-2/3 rounded bg-white/10" />

              <div className="flex gap-2">

                <div className="h-8 w-20 rounded-xl bg-white/10" />

                <div className="h-8 w-24 rounded-xl bg-white/10" />

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Empty */}

      {!loading &&
        decisions.length === 0 && (

          <div
            className="
              rounded-[34px]
              border
              border-white/10
              bg-white/[0.04]
              py-24
              text-center
            "
          >

            <div className="mx-auto max-w-lg">

              <div
                className="
                  mx-auto
                  mb-8
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                "
              >

                <FolderOpen
                  size={40}
                  className="text-slate-400"
                />

              </div>

              <h2 className="text-3xl font-semibold text-white">

                No Decisions Yet

              </h2>

              <p className="mt-5 leading-8 text-slate-400">

                Start your first decision and let your AI
                Council analyze every option before you
                choose.

              </p>

              <Link
                to="/create-decision"
                className="
                  mt-10
                  inline-flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-6
                  py-4
                  font-semibold
                  text-black
                  transition
                  hover:bg-slate-200
                "
              >

                <Plus size={18} />

                Create First Decision

              </Link>

            </div>

          </div>

      )}

      {/* Decision Cards */}

      {!loading && decisions.length > 0 && (

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {decisions.map((decision) => (

            <DecisionCard
              key={decision._id}
              decision={decision}
              handleDelete={handleDelete}
            />

          ))}

        </div>

      )}
    </div>

  );
};

export default Dashboard;