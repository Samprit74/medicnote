import React from "react";
import { cn } from "@/lib/utils";

type Speed = "slow" | "slower" | "drift";

interface Props {
  children: React.ReactNode;
  speed?: Speed;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /** Pause the animation on hover (useful for interactive elements). */
  pauseOnHover?: boolean;
}

const speedClass: Record<Speed, string> = {
  slow: "motion-safe:animate-float-slow",
  slower: "motion-safe:animate-float-slower",
  drift: "motion-safe:animate-drift",
};

/**
 * Wraps children in a slowly floating container.
 * - `slow`   → 4.5s up/down by 6px  (default; hero illustrations, big avatars)
 * - `slower` → 6s   up/down by 3px  (small icons inside cards)
 * - `drift`  → 8s   tiny 2px drift with a sub-degree tilt (cards / banners)
 *
 * Uses GPU-accelerated `transform: translateY` only — cheap and accessible.
 * Respects `prefers-reduced-motion: reduce` via Tailwind's `motion-safe:` variant.
 */
export const Float: React.FC<Props> = ({
  children,
  speed = "slow",
  className,
  as: Tag = "div",
  pauseOnHover = false,
}) => {
  return (
    <Tag
      className={cn(
        speedClass[speed],
        pauseOnHover && "hover:[animation-play-state:paused]",
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Float;
