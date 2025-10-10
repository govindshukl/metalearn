import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AnimationStep } from "../data/courses/types";
import { getEasingFunction } from "./easingFunctions";

export interface AnimationState {
  element: ExcalidrawElement;
  originalElement: ExcalidrawElement;
  currentStep: AnimationStep | null;
  progress: number; // 0 to 1
}

export class ElementAnimator {
  private animationStates: Map<string, AnimationState> = new Map();

  constructor(private elements: ExcalidrawElement[]) {
    // Store original element states
    elements.forEach((element) => {
      this.animationStates.set(element.id, {
        element: { ...element },
        originalElement: { ...element },
        currentStep: null,
        progress: 0,
      });
    });
  }

  /**
   * Apply animation step to elements
   */
  applyAnimationStep(
    step: AnimationStep,
    progress: number, // 0 to 1
  ): ExcalidrawElement[] {
    const easingFn = getEasingFunction(step.easing || "linear");
    const easedProgress = easingFn(progress);

    const updatedElements: ExcalidrawElement[] = [];

    step.elementIds.forEach((elementId) => {
      const state = this.animationStates.get(elementId);
      if (!state) return;

      // Use current element state as base, not original
      // This allows animations to accumulate
      const animatedElement = this.animateElement(
        state.element,
        step,
        easedProgress,
      );

      state.element = animatedElement;
      state.currentStep = step;
      state.progress = progress;

      updatedElements.push(animatedElement);
    });

    return updatedElements;
  }

  /**
   * Animate a single element based on animation type
   */
  private animateElement(
    element: ExcalidrawElement,
    step: AnimationStep,
    progress: number,
  ): ExcalidrawElement {
    const animated = { ...element };
    const original = this.animationStates.get(element.id)?.originalElement;
    if (!original) return animated;

    switch (step.type) {
      case "fade-in":
        animated.opacity = this.interpolate(0, 100, progress);
        break;

      case "appear":
        animated.opacity = progress >= 1 ? 100 : 0;
        break;

      case "scale":
        const fromScale = step.properties?.from?.scale || 0;
        const toScale = step.properties?.to?.scale || 1;
        const scale = this.interpolate(fromScale, toScale, progress);

        // Apply scale transformation relative to original size
        animated.width = original.width * scale;
        animated.height = original.height * scale;
        break;

      case "slide":
        const fromX = step.properties?.from?.x || original.x;
        const toX = step.properties?.to?.x || original.x;
        const fromY = step.properties?.from?.y || original.y;
        const toY = step.properties?.to?.y || original.y;

        animated.x = this.interpolate(fromX, toX, progress);
        animated.y = this.interpolate(fromY, toY, progress);
        break;

      case "draw-stroke":
        // For draw-stroke, we'll use strokeSharpness to simulate drawing
        animated.opacity = this.interpolate(0, 100, progress);
        break;
    }

    return animated;
  }

  /**
   * Linear interpolation
   */
  private interpolate(from: number, to: number, progress: number): number {
    return from + (to - from) * progress;
  }

  /**
   * Get current state of all elements
   */
  getCurrentElements(): ExcalidrawElement[] {
    return Array.from(this.animationStates.values()).map(
      (state) => state.element,
    );
  }

  /**
   * Reset all elements to original state
   */
  reset(): void {
    this.animationStates.forEach((state) => {
      state.element = { ...state.originalElement };
      state.currentStep = null;
      state.progress = 0;
    });
  }

  /**
   * Get elements by IDs
   */
  getElementsByIds(ids: string[]): ExcalidrawElement[] {
    return ids
      .map((id) => this.animationStates.get(id)?.element)
      .filter((el): el is ExcalidrawElement => el !== undefined);
  }
}
