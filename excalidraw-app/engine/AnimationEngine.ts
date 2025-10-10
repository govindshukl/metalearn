import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AnimationScript } from "../data/courses/types";
import { ElementAnimator } from "./ElementAnimator";
import { TimelineController } from "./TimelineController";

export type AnimationUpdateCallback = (elements: ExcalidrawElement[]) => void;

export class AnimationEngine {
  private elementAnimator: ElementAnimator;
  private timelineController: TimelineController;
  private updateCallbacks: AnimationUpdateCallback[] = [];

  constructor(
    private elements: ExcalidrawElement[],
    private script: AnimationScript,
  ) {
    // Collect all element IDs that will be animated with fade-in or appear
    const fadeInElementIds = new Set<string>();
    script.steps.forEach((step) => {
      if (step.type === "fade-in" || step.type === "appear") {
        step.elementIds.forEach((id) => fadeInElementIds.add(id));
      }
    });

    // Initialize: hide only elements that will fade in
    const initialElements = elements.map((el) => {
      if (fadeInElementIds.has(el.id)) {
        return { ...el, opacity: 0 };
      }
      return el;
    });

    this.elementAnimator = new ElementAnimator(initialElements);
    this.timelineController = new TimelineController(script);

    // Subscribe to timeline updates
    this.timelineController.onUpdate((step, progress, isComplete) => {
      const animatedElements = this.elementAnimator.applyAnimationStep(
        step,
        progress,
      );

      // Get all current elements
      const allElements = this.elementAnimator.getCurrentElements();

      // Notify subscribers
      this.notifyUpdate(allElements);
    });
  }

  /**
   * Register callback for animation updates
   */
  onUpdate(callback: AnimationUpdateCallback): void {
    this.updateCallbacks.push(callback);
  }

  /**
   * Notify all subscribers of element updates
   */
  private notifyUpdate(elements: ExcalidrawElement[]): void {
    this.updateCallbacks.forEach((callback) => {
      callback(elements);
    });
  }

  /**
   * Start animation playback
   */
  play(): void {
    this.timelineController.play();
  }

  /**
   * Pause animation playback
   */
  pause(): void {
    this.timelineController.pause();
  }

  /**
   * Stop and reset animation
   */
  stop(): void {
    this.timelineController.stop();
    this.elementAnimator.reset();
    this.notifyUpdate(this.elementAnimator.getCurrentElements());
  }

  /**
   * Seek to specific time in seconds
   */
  seekTo(time: number): void {
    this.timelineController.seekTo(time);
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    return this.timelineController.getCurrentTime();
  }

  /**
   * Get total animation duration
   */
  getDuration(): number {
    return this.timelineController.getTotalDuration();
  }

  /**
   * Check if animation is playing
   */
  isPlaying(): boolean {
    return this.timelineController.getIsPlaying();
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    this.updateCallbacks = [];
  }
}
