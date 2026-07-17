import React, { useState, useEffect } from "react";
import {
  Smile,
  Meh,
  Frown,
  Save,
  CheckCircle2,
} from "lucide-react";

const OutcomeForm = ({
  decision,
  initialOutcome,
  onSave,
}) => {
  const [chosenOption, setChosenOption] =
    useState("");

  const [satisfactionScore, setSatisfactionScore] =
    useState(5);

  const [notes, setNotes] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState(null);

  useEffect(() => {
    if (initialOutcome) {
      setChosenOption(
        initialOutcome.chosenOption || ""
      );

      setSatisfactionScore(
        initialOutcome.satisfactionScore || 5
      );

      setNotes(
        initialOutcome.notes || ""
      );
    } else if (
      decision?.options?.length
    ) {
      setChosenOption(
        decision.options[0]
      );
    }
  }, [initialOutcome, decision]);

  const getIcon = () => {
    if (satisfactionScore >= 8)
      return (
        <Smile
          className="text-emerald-400"
          size={28}
        />
      );

    if (satisfactionScore >= 5)
      return (
        <Meh
          className="text-yellow-400"
          size={28}
        />
      );

    return (
      <Frown
        className="text-red-400"
        size={28}
      />
    );
  };

  const getLabel = () => {
    if (satisfactionScore >= 9)
      return "Excellent decision";

    if (satisfactionScore >= 7)
      return "Good outcome";

    if (satisfactionScore >= 5)
      return "Mixed outcome";

    if (satisfactionScore >= 3)
      return "Poor outcome";

    return "Regretful decision";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSaveStatus(null);

    try {
      await onSave({
        chosenOption,
        satisfactionScore,
        notes,
      });

      setSaveStatus("success");

      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);

    } catch {
      setSaveStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      rounded-[32px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-xl
      p-8
      space-y-8
    "
    >
      {/* Header */}

      <div>

        <h2 className="text-2xl font-semibold text-white">
          Record Outcome
        </h2>

        <p className="mt-2 text-slate-400 leading-7">
          Compare the actual outcome with
          your AI Council recommendation.
        </p>

      </div>

      {/* Option */}

      <div>

        <label className="mb-3 block text-sm font-medium text-slate-300">
          Selected Option
        </label>

        <select
          value={chosenOption}
          onChange={(e) =>
            setChosenOption(e.target.value)
          }
          className="
          h-14
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/[0.04]
          px-4
          text-white
          outline-none
          transition
          focus:border-indigo-500
        "
        >
          {decision.options.map(
            (option, index) => (
              <option
                key={index}
                value={option}
                className="bg-[#111111]"
              >
                {option}
              </option>
            )
          )}
        </select>

      </div>

      {/* Satisfaction */}

      <div>

        <div className="mb-5 flex items-center justify-between">

          <label className="text-sm font-medium text-slate-300">

            Satisfaction

          </label>

          <div className="flex items-center gap-3">

            {getIcon()}

            <span className="font-medium text-white">

              {satisfactionScore}/10

            </span>

          </div>

        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={satisfactionScore}
          onChange={(e) =>
            setSatisfactionScore(
              Number(e.target.value)
            )
          }
          className="
            h-2
            w-full
            cursor-pointer
            accent-white
          "
        />

        <p className="mt-4 text-center text-sm text-slate-400">

          {getLabel()}

        </p>

      </div>

      {/* Notes */}

      <div>

        <label className="mb-3 block text-sm font-medium text-slate-300">

          Notes

        </label>

        <textarea
          rows={5}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Describe what happened after making your decision..."
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-4
            text-white
            placeholder:text-slate-500
            outline-none
            transition
            resize-none
            focus:border-indigo-500
          "
        />

      </div>

      {/* Footer */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        <button
          disabled={isSubmitting}
          className="
            inline-flex
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-white
            px-6
            py-3
            font-semibold
            text-black
            transition
            hover:bg-slate-200
            disabled:opacity-60
          "
        >

          <Save size={18} />

          {isSubmitting
            ? "Saving..."
            : "Save Outcome"}

        </button>

        {saveStatus ===
          "success" && (
          <div className="flex items-center gap-2 text-emerald-400">

            <CheckCircle2 size={18} />

            <span>
              Outcome saved successfully.
            </span>

          </div>
        )}

        {saveStatus ===
          "error" && (
          <div className="text-red-400">
            Failed to save outcome.
          </div>
        )}

      </div>

    </form>
  );
};

export default OutcomeForm;