import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  ListChecks,
  Sparkles,
} from "lucide-react";

const CreateDecision = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const [errorMsg, setErrorMsg] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleOptionChange = (
    index,
    value
  ) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionField = (
    index
  ) => {
    if (options.length <= 2) {
      setErrorMsg(
        "At least two options are required."
      );
      return;
    }

    setOptions(
      options.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (
      !title.trim() ||
      !description.trim()
    ) {
      setErrorMsg(
        "Please complete all required fields."
      );
      return;
    }

    const filteredOptions =
      options
        .map((o) => o.trim())
        .filter(Boolean);

    if (
      filteredOptions.length < 2
    ) {
      setErrorMsg(
        "Please provide at least two options."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post(
        "/decisions",
        {
          title,
          description,
          options:
            filteredOptions,
        }
      );

      navigate(
        `/decisions/${res.data._id}`
      );
    } catch (err) {
      setErrorMsg(
        err.response?.data
          ?.message ||
          "Unable to create decision."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      <button
        onClick={() =>
          navigate("/dashboard")
        }
        className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>

      {/* Hero */}

      <div className="mb-12">

        <div className="flex items-center gap-4">

          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-3xl
            border
            border-white/10
            bg-white/5
          "
          >
            <Sparkles
              className="text-white"
              size={30}
            />
          </div>

          <div>

            <h1 className="text-5xl font-bold tracking-tight text-white">
              Create Decision
            </h1>

            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-400">
              Give your AI Council the
              context it needs to
              evaluate every option and
              recommend the best path.
            </p>

          </div>

        </div>

      </div>

      {errorMsg && (

        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">

          {errorMsg}

        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-10"
      >

        {/* Details */}

        <section
          className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.04]
          backdrop-blur-xl
          p-8
        "
        >

          <div className="mb-8 flex items-center gap-3">

            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-white/5
            "
            >

              <FileText
                size={22}
                className="text-white"
              />

            </div>

            <div>

              <h2 className="text-2xl font-semibold text-white">

                Decision Details

              </h2>

              <p className="text-slate-500">

                Explain your situation.

              </p>

            </div>

          </div>

          <div className="space-y-7">

            <div>

              <label className="mb-3 block text-sm font-medium text-slate-300">

                Decision Title

              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Should I buy a MacBook Pro or Dell XPS?"
                className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                px-5
                text-white
                placeholder:text-slate-500
                outline-none
                transition
                focus:border-indigo-500
              "
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-slate-300">

                Context

              </label>

              <textarea
                rows={7}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Explain your situation, priorities, constraints and anything your AI Council should know..."
                className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-5
                text-white
                placeholder:text-slate-500
                outline-none
                resize-none
                transition
                focus:border-indigo-500
              "
              />

            </div>

          </div>

        </section>
                {/* Options */}

        <section
          className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.04]
          backdrop-blur-xl
          p-8
        "
        >

          <div className="mb-8 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/5
              "
              >
                <ListChecks
                  size={22}
                  className="text-white"
                />
              </div>

              <div>

                <h2 className="text-2xl font-semibold text-white">
                  Decision Options
                </h2>

                <p className="text-slate-500">
                  Add every option you want the AI Council to evaluate.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={addOptionField}
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/10
              "
            >

              <Plus size={18} />

              Add Option

            </button>

          </div>

          <div className="space-y-5">

            {options.map((option, index) => (

              <div
                key={index}
                className="flex items-center gap-4"
              >

                <div
                  className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  font-semibold
                  text-slate-400
                "
                >
                  {index + 1}
                </div>

                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Option ${index + 1}`}
                  className="
                    h-14
                    flex-1
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition
                    focus:border-indigo-500
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    removeOptionField(index)
                  }
                  disabled={options.length <= 2}
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    text-red-400
                    transition
                    hover:bg-red-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >

                  <Trash2 size={18} />

                </button>

              </div>

            ))}

          </div>

        </section>

        {/* Footer */}

        <div className="sticky bottom-6">

          <div
            className="
            flex
            flex-col
            gap-4
            rounded-[28px]
            border
            border-white/10
            bg-[#0f0f11]/90
            p-6
            backdrop-blur-2xl
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
          >

            <div>

              <h3 className="font-semibold text-white">
                Ready to analyze?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your AI Council will evaluate every option and generate a recommendation.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                className="
                  rounded-2xl
                  border
                  border-white/10
                  px-6
                  py-3
                  font-medium
                  text-slate-300
                  transition
                  hover:bg-white/5
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-7
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
                  ? "Creating..."
                  : "Create Decision"}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default CreateDecision;