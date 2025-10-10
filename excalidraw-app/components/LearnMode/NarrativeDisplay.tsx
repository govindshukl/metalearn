import React, { useEffect, useState } from "react";
import type { NarrativeSegment } from "../../data/courses/types";
import "./NarrativeDisplay.scss";

interface NarrativeDisplayProps {
  narratives: NarrativeSegment[];
  currentTime: number;
}

export const NarrativeDisplay: React.FC<NarrativeDisplayProps> = ({
  narratives,
  currentTime,
}) => {
  const [currentNarrative, setCurrentNarrative] =
    useState<NarrativeSegment | null>(null);

  useEffect(() => {
    // Find narrative segment that matches current time
    const active = narratives.find(
      (narr) => currentTime >= narr.startTime && currentTime <= narr.endTime,
    );

    setCurrentNarrative(active || null);
  }, [currentTime, narratives]);

  if (!currentNarrative) {
    return null;
  }

  return (
    <div
      className={`narrative-display narrative-display--${currentNarrative.position || "bottom"}`}
    >
      <div className="narrative-display__content">
        {currentNarrative.speaker && (
          <div className="narrative-display__speaker">
            {currentNarrative.speaker}
          </div>
        )}
        <p className="narrative-display__text">{currentNarrative.text}</p>
      </div>
    </div>
  );
};
