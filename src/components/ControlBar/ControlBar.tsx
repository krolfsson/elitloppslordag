import { Maximize, RotateCcw } from "lucide-react";
import { useConfirm } from "../../context/ConfirmContext";
import { PinkButton } from "../ui/PinkButton";

type ControlBarProps = {
  onReset: () => void;
  onFullscreen: () => void;
};

export function ControlBar({ onReset, onFullscreen }: ControlBarProps) {
  const { confirm } = useConfirm();

  const handleReset = async () => {
    const ok = await confirm({
      title: "Nollställ alla poäng?",
      message:
        "Alla poäng för alla grenar och lag sätts till noll. Det går inte att ångra.",
      confirmLabel: "Ja, nollställ",
      cancelLabel: "Avbryt",
      variant: "danger",
    });
    if (ok) onReset();
  };

  return (
    <footer className="shrink-0 py-3 px-5">
      <div className="elit-card p-3 flex gap-3">
        <PinkButton
          size="lg"
          variant="outline"
          icon={<RotateCcw size={22} className="text-elit-pink" />}
          onClick={handleReset}
          className="flex-[2] !text-elit-pink"
        >
          Nollställ alla poäng
        </PinkButton>
        <PinkButton
          size="lg"
          icon={<Maximize size={22} />}
          onClick={onFullscreen}
          className="flex-1"
        >
          Helskärm
        </PinkButton>
      </div>
    </footer>
  );
}
