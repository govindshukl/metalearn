import type { Course, CourseLibrary } from "./types";
import { sampleCourse } from "./sampleCourse";

/**
 * Load course from JSON file
 */
export const loadCourseFromFile = async (filePath: string): Promise<Course> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load course from ${filePath}`);
    }
    const courseData = await response.json();
    return courseData as Course;
  } catch (error) {
    console.error("Error loading course:", error);
    throw error;
  }
};

/**
 * Load all courses from library
 */
export const loadCourseLibrary = async (): Promise<CourseLibrary> => {
  try {
    // For now, return sample course
    // In production, fetch from API or file system
    return {
      courses: [sampleCourse],
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error loading course library:", error);
    return {
      courses: [],
      lastUpdated: new Date().toISOString(),
    };
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  const library = await loadCourseLibrary();
  return library.courses.find((course) => course.id === courseId) || null;
};

/**
 * Validate course structure
 */
export const validateCourse = (course: Course): boolean => {
  if (!course.id || !course.title || !course.chapters) {
    return false;
  }

  for (const chapter of course.chapters) {
    if (!chapter.id || !chapter.concepts || chapter.concepts.length === 0) {
      return false;
    }

    for (const concept of chapter.concepts) {
      if (!concept.id || !concept.excalidrawFile || !concept.animationScript) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Export course to JSON
 */
export const exportCourseToJSON = (course: Course): string => {
  return JSON.stringify(course, null, 2);
};

/**
 * Import course from JSON string
 */
export const importCourseFromJSON = (jsonString: string): Course => {
  try {
    const course = JSON.parse(jsonString) as Course;
    if (!validateCourse(course)) {
      throw new Error("Invalid course structure");
    }
    return course;
  } catch (error) {
    console.error("Error importing course:", error);
    throw new Error("Failed to import course from JSON");
  }
};
