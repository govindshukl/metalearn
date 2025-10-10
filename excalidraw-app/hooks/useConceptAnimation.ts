import { useState, useEffect } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import {
  loadExcalidrawFile,
  extractElements,
} from "../data/excalidrawLoader";
import { useAnimationEngine } from "./useAnimationEngine";
import type { Concept } from "../data/courses/types";

export const useConceptAnimation = (
  selectedConcept: Concept | null,
  excalidrawAPI: ExcalidrawImperativeAPI | null,
) => {
  const [elements, setElements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    animatedElements,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    stop,
    seekTo,
  } = useAnimationEngine(elements, selectedConcept?.animationScript || null);

  // Load Excalidraw file when concept is selected
  useEffect(() => {
    if (!selectedConcept) {
      setElements([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    loadExcalidrawFile(selectedConcept.excalidrawFile)
      .then((fileData) => {
        const loadedElements = extractElements(fileData);
        setElements(loadedElements);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Excalidraw file:", err);
        setError("Failed to load concept diagram");
        setIsLoading(false);
      });
  }, [selectedConcept]);

  // Update Excalidraw canvas with animated elements
  useEffect(() => {
    if (excalidrawAPI && animatedElements.length > 0) {
      console.log(
        "useConceptAnimation: Updating scene with",
        animatedElements.length,
        "elements",
      );
      excalidrawAPI.updateScene({
        elements: animatedElements,
      });
    }
  }, [excalidrawAPI, animatedElements]);

  return {
    isLoading,
    error,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    stop,
    seekTo,
  };
};
