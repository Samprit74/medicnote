import React from "react";

export type EmptyKind = "prescription" | "patient" | "record" | "queue" | "doctor";

interface Props {
  kind: EmptyKind;
  className?: string;
}

/**
 * Small flat illustration used in empty states.
 * Style matches the existing doctor-illustration.png — soft pastels,
 * rounded shapes, no harsh outlines.
 */
export const EmptyIllustration: React.FC<Props> = ({ kind, className }) => {
  const cls = className ?? "h-12 w-12";

  switch (kind) {
    case "prescription":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden="true">
          <rect x="14" y="8" width="36" height="48" rx="4" fill="#fff" stroke="#E0E7FF" strokeWidth="2" />
          <path d="M22 22 H 42" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 30 H 38" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 38 H 42" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
          <circle cx="22" cy="46" r="2.5" fill="#6366F1" />
          <path d="M28 46 H 42" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" />
          {/* rx symbol top-right */}
          <text x="44" y="20" textAnchor="end" fontFamily="ui-sans-serif" fontSize="8" fontWeight="700" fill="#6366F1">℞</text>
        </svg>
      );
    case "patient":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden="true">
          <circle cx="32" cy="22" r="10" fill="#FBCFE8" stroke="#F9A8D4" strokeWidth="1.5" />
          <path d="M12 56 C 14 44, 22 38, 32 38 C 42 38, 50 44, 52 56 Z" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="1.5" />
          <path d="M32 32 v 6 M 29 35 h 6" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "record":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden="true">
          {/* folder */}
          <path d="M8 20 L 8 52 C 8 54, 9 56, 11 56 L 53 56 C 55 56, 56 54, 56 52 L 56 24 C 56 22, 55 20, 53 20 L 30 20 L 26 14 L 11 14 C 9 14, 8 16, 8 18 Z"
            fill="#FEF3C7" stroke="#FBBF24" strokeWidth="1.5" />
          {/* sheet */}
          <rect x="16" y="28" width="32" height="20" rx="2" fill="#fff" stroke="#FCD34D" strokeWidth="1.2" />
          <path d="M20 34 H 44 M 20 40 H 40" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "queue":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden="true">
          {/* clipboard with checkmark */}
          <rect x="14" y="10" width="36" height="46" rx="4" fill="#ECFDF5" stroke="#34D399" strokeWidth="1.5" />
          <rect x="22" y="6" width="20" height="8" rx="2" fill="#10B981" />
          <path d="M22 32 L 28 38 L 42 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 46 H 42" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "doctor":
      return (
        <svg viewBox="0 0 64 64" className={cls} aria-hidden="true">
          {/* doctor head + coat + stethoscope */}
          <circle cx="32" cy="24" r="11" fill="#FDE8CF" stroke="#F59E0B" strokeWidth="1.2" />
          <path d="M18 22 C 18 12, 46 12, 46 22 C 46 18, 40 14, 32 14 C 24 14, 18 18, 18 22 Z" fill="#1E293B" opacity="0.9" />
          <path d="M8 64 C 14 46, 22 42, 32 42 C 42 42, 50 46, 56 64 Z" fill="#3B82F6" />
          <path d="M22 50 C 22 56, 30 60, 32 60 C 34 60, 42 56, 42 50" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="60" r="3" fill="#0EA5E9" />
        </svg>
      );
  }
};

export default EmptyIllustration;
