import React from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useAtom, useSetAtom } from "../../app-jotai";
import {
  selectedConceptAtom,
  isCourseMenuOpenAtom,
} from "../../app-jotai";
import { useConceptAnimation } from "../../hooks/useConceptAnimation";
import { NarrativeDisplay } from "./NarrativeDisplay";
import { PlaybackControls } from "./PlaybackControls";
import "./ConceptPlayer.scss";

interface ConceptPlayerProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}

export const ConceptPlayer: React.FC<ConceptPlayerProps> = ({
  excalidrawAPI,
}) => {
  const [selectedConcept] = useAtom(selectedConceptAtom);
  const setSelectedConcept = useSetAtom(selectedConceptAtom);
  const setIsCourseMenuOpen = useSetAtom(isCourseMenuOpenAtom);

  const {
    isLoading,
    error,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    stop,
    seekTo,
  } = useConceptAnimation(selectedConcept, excalidrawAPI);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleClose = () => {
    stop();
    setSelectedConcept(null);
    setIsCourseMenuOpen(true);
  };

  if (!selectedConcept) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="concept-player-overlay">
        <div className="concept-player-loader">
          <div className="spinner" />
          <p>Loading concept...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="concept-player-overlay">
        <div className="concept-player-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={handleClose}>Back to Courses</button>
        </div>
      </div>
    );
  }

  return (
    <div className="concept-player-overlay">
      <NarrativeDisplay
        narratives={selectedConcept.narrative}
        currentTime={currentTime}
      />

      <div className="concept-player-controls">
        <PlaybackControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSeek={seekTo}
          onSpeedChange={(speed) => {
            console.log("Speed changed to:", speed);
          }}
        />
      </div>
    </div>
  );
};
