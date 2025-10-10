/**
 * Animation instruction for a single element or group of elements
 */
export interface AnimationStep {
  /** Unique identifier for this animation step */
  id: string;

  /** Element IDs to animate */
  elementIds: string[];

  /** Start time in seconds from concept beginning */
  startTime: number;

  /** Duration of animation in seconds */
  duration: number;

  /** Animation type */
  type: "fade-in" | "draw-stroke" | "appear" | "scale" | "slide";

  /** Animation easing function */
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";

  /** Additional animation properties */
  properties?: {
    from?: { x?: number; y?: number; opacity?: number; scale?: number };
    to?: { x?: number; y?: number; opacity?: number; scale?: number };
  };
}

/**
 * Narrative text displayed during concept playback
 */
export interface NarrativeSegment {
  /** Unique identifier */
  id: string;

  /** Start time in seconds */
  startTime: number;

  /** End time in seconds */
  endTime: number;

  /** Text content to display */
  text: string;

  /** Optional speaker/narrator name */
  speaker?: string;

  /** Position on screen */
  position?: "top" | "bottom" | "left" | "right" | "center";
}

/**
 * Complete animation script for a concept
 */
export interface AnimationScript {
  /** Script version for compatibility */
  version: string;

  /** Total duration in seconds */
  totalDuration: number;

  /** Animation steps in chronological order */
  steps: AnimationStep[];

  /** Background music or audio (optional) */
  audio?: {
    url: string;
    volume: number;
  };
}

/**
 * A single concept (lesson) within a chapter
 */
export interface Concept {
  /** Unique identifier */
  id: string;

  /** Concept title */
  title: string;

  /** Brief description */
  description?: string;

  /** Path to Excalidraw file containing the diagram */
  excalidrawFile: string;

  /** Animation script for progressive rendering */
  animationScript: AnimationScript;

  /** Narrative segments for this concept */
  narrative: NarrativeSegment[];

  /** Total duration in seconds */
  duration: number;

  /** Optional tags for categorization */
  tags?: string[];
}

/**
 * A chapter containing multiple concepts
 */
export interface Chapter {
  /** Unique identifier */
  id: string;

  /** Chapter title */
  title: string;

  /** Chapter description */
  description: string;

  /** Concepts in this chapter */
  concepts: Concept[];

  /** Display order within course */
  order: number;

  /** Optional thumbnail image */
  thumbnail?: string;
}

/**
 * Course metadata
 */
export interface CourseMetadata {
  /** Author name */
  author: string;

  /** Creation date */
  createdAt: string;

  /** Last updated date */
  updatedAt: string;

  /** Estimated completion time in minutes */
  estimatedTime: number;

  /** Difficulty level */
  difficulty: "beginner" | "intermediate" | "advanced";

  /** Course tags */
  tags: string[];

  /** Course version */
  version: string;
}

/**
 * Complete course structure
 */
export interface Course {
  /** Unique identifier */
  id: string;

  /** Course title */
  title: string;

  /** Course description */
  description: string;

  /** Thumbnail image URL or path */
  thumbnail: string;

  /** Chapters in this course */
  chapters: Chapter[];

  /** Course metadata */
  metadata: CourseMetadata;

  /** Optional prerequisites */
  prerequisites?: string[];

  /** Difficulty level (convenience accessor) */
  level?: "beginner" | "intermediate" | "advanced";

  /** Total duration in minutes (convenience accessor) */
  totalDuration?: number;
}

/**
 * Course library containing multiple courses
 */
export interface CourseLibrary {
  courses: Course[];
  lastUpdated: string;
}
