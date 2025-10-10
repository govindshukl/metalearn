import type { AnimationScript, AnimationStep } from "../data/courses/types";

/**
 * Parse and validate animation script
 */
export class ScriptParser {
  static parse(scriptData: any): AnimationScript {
    if (!this.validate(scriptData)) {
      throw new Error("Invalid animation script format");
    }

    return scriptData as AnimationScript;
  }

  static validate(scriptData: any): boolean {
    if (!scriptData || typeof scriptData !== "object") {
      return false;
    }

    if (!scriptData.version || !scriptData.totalDuration || !scriptData.steps) {
      return false;
    }

    if (!Array.isArray(scriptData.steps)) {
      return false;
    }

    // Validate each step
    return scriptData.steps.every((step: any) => this.validateStep(step));
  }

  static validateStep(step: any): boolean {
    return (
      step.id &&
      Array.isArray(step.elementIds) &&
      typeof step.startTime === "number" &&
      typeof step.duration === "number" &&
      step.type &&
      ["fade-in", "draw-stroke", "appear", "scale", "slide"].includes(step.type)
    );
  }

  /**
   * Create a simple fade-in script for all elements
   */
  static createSimpleFadeIn(
    elementIds: string[],
    totalDuration: number,
  ): AnimationScript {
    const stepDuration = totalDuration / elementIds.length;

    const steps: AnimationStep[] = elementIds.map((id, index) => ({
      id: `step-${index}`,
      elementIds: [id],
      startTime: index * stepDuration,
      duration: stepDuration,
      type: "fade-in",
      easing: "ease-in-out",
    }));

    return {
      version: "1.0",
      totalDuration,
      steps,
    };
  }

  /**
   * Export script to JSON
   */
  static toJSON(script: AnimationScript): string {
    return JSON.stringify(script, null, 2);
  }

  /**
   * Import script from JSON
   */
  static fromJSON(jsonString: string): AnimationScript {
    const parsed = JSON.parse(jsonString);
    return this.parse(parsed);
  }
}
