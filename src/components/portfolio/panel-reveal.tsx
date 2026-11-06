"use client";

import { useEffect, useState, type ReactNode } from "react";

type PanelRevealProps = {
  active: boolean;
  className?: string;
  children: ReactNode;
};

export function PanelReveal({ active, className = "", children }: PanelRevealProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (active) setRevealed(true);
  }, [active]);

  return (
    <div className={`panel-reveal ${className}`} data-revealed={revealed ? "true" : "false"}>
      {children}
    </div>
  );
}
