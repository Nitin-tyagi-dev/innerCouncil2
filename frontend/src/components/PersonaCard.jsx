import React from "react";
import {
  Brain,
  Coins,
  Lock,
  Hourglass,
  ShieldAlert,
  Heart,
  Star,
} from "lucide-react";

const PERSONA_ICONS = {
  "Rational Analyst": Brain,
  "Budget Guardian": Coins,
  "Privacy Guardian": Lock,
  "Long-Term Planner": Hourglass,
  "Risk Manager": ShieldAlert,
  "Emotional Check": Heart,
};

const PERSONA_DESCRIPTIONS = {
  "Rational Analyst":
    "Evaluates options using logic, efficiency and measurable outcomes.",

  "Budget Guardian":
    "Balances financial impact, long-term costs and overall value.",

  "Privacy Guardian":
    "Focuses on security, privacy and responsible data handling.",

  "Long-Term Planner":
    "Looks beyond immediate results to future sustainability.",

  "Risk Manager":
    "Identifies uncertainty, failure points and possible downsides.",

  "Emotional Check":
    "Considers personal values, happiness and emotional well-being.",
};

const PersonaCard = ({ debateData }) => {
  const { persona, evaluations } = debateData;

  const Icon =
    PERSONA_ICONS[persona] || Brain;

  return (
    <div
      className="
      rounded-[28px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-xl
      p-7
      h-full
    "
    >
      {/* Header */}

      <div className="flex items-center gap-4">

        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/5
        "
        >
          <Icon
            size={24}
            className="text-white"
          />
        </div>

        <div>

          <h2 className="text-xl font-semibold text-white">
            {persona}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {
              PERSONA_DESCRIPTIONS[
                persona
              ]
            }
          </p>

        </div>

      </div>

      {/* Options */}

      <div className="mt-8 space-y-6">

        {evaluations.map(
          (item, index) => {

            const average =
              item.scores.length === 0
                ? 0
                : (
                    item.scores.reduce(
                      (sum, score) =>
                        sum + score.score,
                      0
                    ) /
                    item.scores.length
                  ).toFixed(1);

            return (
              <div
                key={index}
                className="
                rounded-2xl
                border
                border-white/10
                bg-black/10
                p-5
              "
              >
                {/* Title */}

                <div className="flex items-center justify-between">

                  <h3 className="font-medium text-white">

                    {item.option}

                  </h3>

                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-1
                  "
                  >
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm font-medium text-white">

                      {average}

                    </span>

                  </div>

                </div>

                {/* Summary */}

                <div className="mt-5">

                  <p className="text-xs uppercase tracking-widest text-slate-500">

                    Insight

                  </p>

                  <p className="mt-2 leading-7 text-slate-300">

                    {item.summary}

                  </p>

                </div>

                {/* Concern */}

                <div className="mt-5">

                  <p className="text-xs uppercase tracking-widest text-slate-500">

                    Main Concern

                  </p>

                  <p className="mt-2 leading-7 text-slate-300">

                    {item.concerns}

                  </p>

                </div>

                {/* Scores */}

                <div className="mt-6 flex flex-wrap gap-2">

                  {item.scores.map(
                    (score, i) => (

                      <div
                        key={i}
                        className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/5
                        px-3
                        py-2
                      "
                      >
                        <div className="text-[11px] text-slate-500">

                          {score.criterion}

                        </div>

                        <div className="mt-1 font-semibold text-white">

                          {score.score}/10

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default PersonaCard;