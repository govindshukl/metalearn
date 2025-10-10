import { useEffect, useRef, useState } from "react";
import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AnimationScript } from "../data/courses/types";
import { AnimationEngine } from "../engine/AnimationEngine";

export const useAnimationEngine = (
  elements: ExcalidrawElement[],
  script: AnimationScript | null,
) => {
  const engineRef = useRef<AnimationEngine | null>(null);
  const [animatedElements, setAnimatedElements] =
    useState<ExcalidrawElement[]>(elements);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!script || elements.length === 0) {
      return;
    }

    // Create animation engine
    const engine = new AnimationEngine(elements, script);

    // Subscribe to updates
    engine.onUpdate((updatedElements) => {
      console.log("useAnimationEngine: Engine update received with", updatedElements.length, "elements");
      setAnimatedElements(updatedElements);
      setCurrentTime(engine.getCurrentTime());
      setIsPlaying(engine.isPlaying());
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [elements, script]);

  const play = () => {
    engineRef.current?.play();
  };

  const pause = () => {
    engineRef.current?.pause();
  };

  const stop = () => {
    engineRef.current?.stop();
  };

  const seekTo = (time: number) => {
    engineRef.current?.seekTo(time);
  };

  return {
    animatedElements,
    currentTime,
    duration: script?.totalDuration || 0,
    isPlaying,
    play,
    pause,
    stop,
    seekTo,
  };
};
