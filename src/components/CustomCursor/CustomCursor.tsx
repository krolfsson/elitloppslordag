import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const HORSE = "🐴";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 450, damping: 32 });
  const springY = useSpring(cursorY, { stiffness: 450, damping: 32 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest(".interactive") ||
          !!target.closest("button") ||
          !!target.closest("[data-clickable]"),
      );
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [cursorX, cursorY]);

  const size = clicking ? "2rem" : hovering ? "2.75rem" : "2.25rem";

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{ x: springX, y: springY }}
    >
      <motion.span
        role="img"
        aria-hidden
        animate={{
          scale: clicking ? 0.85 : hovering ? 1.25 : 1,
          rotate: hovering ? [-8, 8, -8] : 0,
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 25 },
          rotate: hovering
            ? { repeat: Infinity, duration: 0.4, ease: "easeInOut" }
            : { duration: 0.15 },
        }}
        className="block leading-none select-none"
        style={{
          fontSize: size,
          transform: "translate(-50%, -50%)",
          filter: "drop-shadow(0 2px 4px #00000025)",
        }}
      >
        {HORSE}
      </motion.span>
    </motion.div>
  );
}
