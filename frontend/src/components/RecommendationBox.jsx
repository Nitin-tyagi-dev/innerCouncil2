import React from "react";
import {
  Trophy,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const RecommendationBox = ({ recommendation }) => {
  const {
    bestOption,
    reason,
    tradeoff,
    scores,
  } = recommendation;

  const maxScore = Math.max(
    ...scores.map((s) => s.total)
  );

  return (
    <div className="space-y-8">

      {/* Recommendation */}

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
        <div className="flex items-start gap-6">

          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-white/5
          "
          >
            <Trophy
              size={30}
              className="text-amber-400"
            />
          </div>

          <div className="flex-1">

            <p className="text-sm text-slate-500">
              Recommended Option
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              {bestOption}
            </h2>

            <p className="mt-6 leading-8 text-slate-300">
              {reason}
            </p>

          </div>

        </div>

        {tradeoff && (

          <div
            className="
            mt-8
            rounded-2xl
            border
            border-amber-500/20
            bg-amber-500/10
            p-5
          "
          >

            <div className="flex gap-4">

              <AlertTriangle
                size={22}
                className="mt-0.5 text-amber-400"
              />

              <div>

                <h3 className="font-medium text-white">

                  Trade-off

                </h3>

                <p className="mt-2 leading-7 text-slate-300">

                  {tradeoff}

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

      {/* Score Comparison */}

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

        <div className="mb-8">

          <h3 className="text-2xl font-semibold text-white">

            Score Comparison

          </h3>

          <p className="mt-2 text-slate-500">

            Overall score for every option.

          </p>

        </div>

        <div className="space-y-6">

          {scores.map((item, index) => {

            const isWinner =
              item.option === bestOption ||
              item.total === maxScore;

            const width =
              Math.min(
                Math.max(
                  (item.total / 10) * 100,
                  0
                ),
                100
              );

            return (

              <div key={index}>

                <div className="mb-3 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <h4 className="font-medium text-white">

                      {item.option}

                    </h4>

                    {isWinner && (

                      <span
                        className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-3
                        py-1
                        text-xs
                        text-emerald-300
                      "
                      >

                        <CheckCircle2 size={13} />

                        Best

                      </span>

                    )}

                  </div>

                  <span className="font-semibold text-white">

                    {item.total}/10

                  </span>

                </div>

                <div
                  className="
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-white/5
                "
                >

                  <div
                    className={`
                      h-full
                      rounded-full
                      transition-all
                      duration-700
                      ${
                        isWinner
                          ? "bg-white"
                          : "bg-slate-500"
                      }
                    `}
                    style={{
                      width: `${width}%`,
                    }}
                  />

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
};

export default RecommendationBox;