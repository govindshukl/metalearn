import type { AnimationScript, AnimationStep } from "../data/courses/types";

export interface TimelineEvent {
  step: AnimationStep;
  startTime: number;
  endTime: number;
}

export type TimelineCallback = (
  step: AnimationStep,
  progress: number,
  isComplete: boolean,
) => void;

export class TimelineController {
  private events: TimelineEvent[] = [];
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private animationFrameId: number | null = null;
  private startTimestamp: number | null = null;
  private callbacks: TimelineCallback[] = [];

  constructor(private script: AnimationScript) {
    this.buildTimeline();
  }

  /**
   * Build timeline events from animation script
   */
  private buildTimeline(): void {
    this.events = this.script.steps.map((step) => ({
      step,
      startTime: step.startTime,
      endTime: step.startTime + step.duration,
    }));

    // Sort events by start time
    this.events.sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Register callback for timeline updates
   */
  onUpdate(callback: TimelineCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Start playback
   */
  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.startTimestamp = null;
    this.animate();
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Stop and reset playback
   */
  stop(): void {
    this.pause();
    this.currentTime = 0;
    this.startTimestamp = null;
  }

  /**
   * Seek to specific time
   */
  seekTo(time: number): void {
    const wasPlaying = this.isPlaying;
    this.pause();

    this.currentTime = Math.max(0, Math.min(time, this.script.totalDuration));
    this.updateActiveSteps();

    if (wasPlaying) {
      this.play();
    }
  }

  /**
   * Animation loop
   */
  private animate = (timestamp?: number): void => {
    if (!this.isPlaying) {
      return;
    }

    if (this.startTimestamp === null) {
      this.startTimestamp = timestamp || performance.now();
      console.log("TimelineController: Animation started");
    }

    const elapsed = (timestamp || performance.now()) - this.startTimestamp;
    this.currentTime = elapsed / 1000; // Convert to seconds

    // Log every second
    if (Math.floor(this.currentTime) !== Math.floor(this.currentTime - 0.016)) {
      console.log("TimelineController: currentTime =", this.currentTime.toFixed(2), "s");
    }

    // Check if we've reached the end
    if (this.currentTime >= this.script.totalDuration) {
      console.log("TimelineController: Animation complete at", this.currentTime.toFixed(2), "s");
      this.currentTime = this.script.totalDuration;
      this.updateActiveSteps();
      this.stop();
      return;
    }

    this.updateActiveSteps();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Update and notify about active steps
   */
  private updateActiveSteps(): void {
    this.events.forEach((event) => {
      const { step, startTime, endTime } = event;

      // Check if step is currently active
      if (this.currentTime >= startTime && this.currentTime <= endTime) {
        const stepProgress = (this.currentTime - startTime) / step.duration;
        const isComplete = stepProgress >= 1;

        // Log only at the start and end of each step
        if (stepProgress < 0.05 || stepProgress > 0.95) {
          console.log(`TimelineController: Step ${step.id} at progress=${stepProgress.toFixed(3)}`);
        }

        this.callbacks.forEach((callback) => {
          callback(step, Math.min(stepProgress, 1), isComplete);
        });
      }

      // Check if step just started
      if (
        this.currentTime >= startTime &&
        this.currentTime < startTime + 0.016 // ~1 frame at 60fps
      ) {
        this.callbacks.forEach((callback) => {
          callback(step, 0, false);
        });
      }
    });
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * Get total duration
   */
  getTotalDuration(): number {
    return this.script.totalDuration;
  }

  /**
   * Check if playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
