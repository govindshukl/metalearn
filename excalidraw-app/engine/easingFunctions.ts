/**
 * Easing functions for smooth animations
 */
export type EasingFunction = (t: number) => number;

export const easingFunctions: Record<string, EasingFunction> = {
  linear: (t: number) => t,

  easeIn: (t: number) => t * t,

  easeOut: (t: number) => t * (2 - t),

  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: (t: number) => t * t * t,

  easeOutCubic: (t: number) => --t * t * t + 1,

  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number) => t * t * t * t,

  easeOutQuart: (t: number) => 1 - --t * t * t * t,

  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
};

export const getEasingFunction = (name: string = "linear"): EasingFunction => {
  return easingFunctions[name] || easingFunctions.linear;
};
