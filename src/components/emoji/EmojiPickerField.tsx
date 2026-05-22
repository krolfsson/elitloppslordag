import { useEffect, useState } from "react";
import { normalizeEmoji } from "../../utils/emoji";
import { EmojiDisplay } from "./EmojiDisplay";

type EmojiPickerFieldProps = {
  value: string;
  fallback: string;
  suggestions?: string[];
  onChange: (emoji: string) => void;
  label?: string;
};

export function EmojiPickerField({
  value,
  fallback,
  suggestions,
  onChange,
  label,
}: EmojiPickerFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = (raw: string) => {
    const next = normalizeEmoji(raw, fallback);
    setDraft(next);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-label-pink text-[10px]">{label}</span>}
      <div className="flex items-center gap-2">
        <EmojiDisplay emoji={draft || fallback} size="md" />
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(draft);
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="Klistra in emoji…"
          className="interactive flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-[#e8e8ed] text-xl
            focus:border-elit-pink focus:outline-none focus:ring-2 focus:ring-elit-pink/20 bg-white"
          maxLength={8}
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => commit(s)}
              className={`interactive w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-colors
                ${draft === s ? "bg-elit-pink text-white ring-2 ring-elit-pink/40" : "bg-[#f5f5f7] hover:bg-elit-pink-soft"}`}
              title="Välj emoji"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
