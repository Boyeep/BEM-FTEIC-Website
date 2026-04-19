"use client";

import ScrollReveal from "@/components/ScrollReveal";

type SwipeSideHintProps = {
  delay?: number;
  text?: string;
  className?: string;
  tone?: "dark" | "light";
};

export default function SwipeSideHint({
  delay = 55,
  text = "Geser ke samping",
  className = "",
  tone = "dark",
}: SwipeSideHintProps) {
  const isLight = tone === "light";

  return (
    <ScrollReveal delay={delay} className={["md:hidden", className].join(" ")}>
      <div className="mt-5 flex items-center justify-center">
        <div
          className={[
            "inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-sm",
            isLight
              ? "border border-black/10 bg-white/90 text-black/75"
              : "border border-white/15 bg-black/20 text-white/85",
          ].join(" ")}
        >
          <span
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-full",
              isLight
                ? "bg-[#1D4ED8]/10 text-[#1D4ED8]"
                : "bg-white/10 text-[#FCD704]",
            ].join(" ")}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 11.5V6.8a1.6 1.6 0 1 1 3.2 0v3.1" />
              <path d="M11.7 9.4a1.6 1.6 0 1 1 3.2 0v2.1" />
              <path d="M14.9 10.5a1.6 1.6 0 1 1 3.2 0v3.2c0 4-2.5 6.8-6.1 6.8-2.2 0-4-.9-5.2-2.7l-2.1-3.3a1.5 1.5 0 0 1 2.4-1.8l1.4 1.5V11.5a1.6 1.6 0 1 1 3.2 0v3.1" />
              <path d="M4.2 7.5H2.5" />
              <path d="M21.5 7.5h-1.7" />
            </svg>
          </span>

          <div className="flex items-center gap-2">
            <span>{text}</span>
            <span
              aria-hidden="true"
              className={[
                "inline-flex items-center gap-1",
                isLight ? "text-[#1D4ED8]" : "text-[#FCD704]",
              ].join(" ")}
            >
              <span className="animate-pulse">{">"}</span>
              <span className="animate-pulse [animation-delay:180ms]">
                {">"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
