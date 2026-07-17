import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import {
  Search,
  ArrowUpDown,
  Calendar,
  ChevronRight,
  Sparkles,
  Clock3,
  CheckCircle2,
  Loader2,
  FolderOpen
} from "lucide-react";

const statusStyles = {
  pending: {
    label: "Pending",
    classes:
      "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  },
  analyzed: {
    label: "Analyzed",
    classes:
      "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  },
  complete: {
    label: "Completed",
    classes:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  },
};

function relativeDate(date) {
  const today = new Date();
  const d = new Date(date);

  const diff =
    Math.floor(
      (today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) /
        86400000
    );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";

  return d.toLocaleDateString();
}

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

const DecisionCard = ({ decision }) => {
  return (
    <Link
      to={`/decisions/${decision._id}`}
      className="group block"
    >
      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        p-6
        transition-all
        duration-300
        hover:border-white/20
        hover:bg-white/[0.06]
        hover:-translate-y-1
      "
      >
        <div className="flex items-start justify-between gap-4">

          <div className="flex-1">

            <div className="flex items-center gap-3">

              <StatusBadge status={decision.status} />

              {decision.category && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                  {decision.category}
                </span>
              )}

            </div>

            <h3 className="mt-5 text-xl font-semibold text-white transition group-hover:text-slate-100">
              {decision.title}
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-400">
              {decision.description}
            </p>

          </div>

          <ChevronRight
            className="text-slate-500 transition group-hover:translate-x-1"
            size={22}
          />

        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">

          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {relativeDate(decision.createdAt)}
          </div>

          {decision.finalRecommendation?.bestOption && (
            <div className="flex items-center gap-2">

              <CheckCircle2
                size={16}
                className="text-emerald-400"
              />

              <span className="text-slate-300">
                Recommended:
              </span>

              <span className="font-medium text-white">
                {decision.finalRecommendation.bestOption}
              </span>

            </div>
          )}

        </div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6">

      <div className="mb-5 h-6 w-28 rounded bg-white/10" />

      <div className="mb-4 h-8 w-3/4 rounded bg-white/10" />

      <div className="mb-2 h-4 rounded bg-white/10" />

      <div className="mb-2 h-4 rounded bg-white/10" />

      <div className="h-4 w-2/3 rounded bg-white/10" />

      <div className="mt-8 h-4 w-40 rounded bg-white/10" />

    </div>
  );
};

const History = () => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/decisions");
        setDecisions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        decisions
          .map((d) => d.category)
          .filter(Boolean)
      ),
    ];
  }, [decisions]);

  const filteredDecisions = useMemo(() => {
    return decisions
      .filter((d) => {
        const search =
          d.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          d.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const category =
          categoryFilter === "all" ||
          d.category === categoryFilter;

        return search && category;
      })
      .sort((a, b) => {
        const da = new Date(a.createdAt);
        const db = new Date(b.createdAt);

        return sortOrder === "desc"
          ? db - da
          : da - db;
      });
  }, [
    decisions,
    searchTerm,
    categoryFilter,
    sortOrder,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-12">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

            <Clock3 className="text-white" />

          </div>

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Decision History
            </h1>

            <p className="mt-2 text-slate-400">
              Review every decision you've made with your AI council.
            </p>

          </div>

        </div>

      </div>
            {/* Toolbar */}

      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search decisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              pl-12
              pr-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition
              focus:border-indigo-500
              focus:bg-white/[0.06]
            "
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap items-center gap-3">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`
                rounded-xl
                px-4
                py-2
                text-sm
                transition-all

                ${
                  categoryFilter === category
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {category === "all"
                ? "All"
                : category}
            </button>

          ))}

          <button
            onClick={() =>
              setSortOrder(
                sortOrder === "desc"
                  ? "asc"
                  : "desc"
              )
            }
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
              text-sm
              text-slate-300
              transition
              hover:bg-white/10
            "
          >

            <ArrowUpDown size={16} />

            {sortOrder === "desc"
              ? "Newest"
              : "Oldest"}

          </button>

        </div>

      </div>

      {/* Loading */}

      {loading && (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        </div>

      )}

      {/* Empty */}

      {!loading &&
        filteredDecisions.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] py-24">

            <div className="mx-auto flex max-w-md flex-col items-center text-center">

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">

                <FolderOpen
                  size={34}
                  className="text-slate-400"
                />

              </div>

              <h2 className="text-2xl font-semibold text-white">
                No Decisions Found
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                We couldn't find any decisions
                matching your search or filter.
              </p>

            </div>

          </div>

      )}

      {/* Cards */}

      {!loading &&
        filteredDecisions.length > 0 && (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredDecisions.map((decision) => (

              <DecisionCard
                key={decision._id}
                decision={decision}
              />

            ))}

          </div>

      )}

    </div>

  );
};

export default History;