import React, { useRef, useState, useEffect } from "react";

import { t } from "../i18n";
import { useUIAppState } from "../context/ui-appState";
import { useApp } from "./App";

import "./CoursesMenu.scss";

// Import course data with full structure
const loadCourseLibrary = async () => {
  try {
    // Try to dynamically import from excalidraw-app
    // @ts-ignore - This path exists in excalidraw-app
    const courseLoader = await import("../../../excalidraw-app/data/courses/courseLoader");
    return await courseLoader.loadCourseLibrary();
  } catch (e) {
    console.log("Could not load courses from excalidraw-app:", e);
  }

  // Fallback: return empty courses
  return {
    courses: [],
    lastUpdated: new Date().toISOString(),
  };
};

export const CoursesMenu = () => {
  const appState = useUIAppState();
  const app = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  useEffect(() => {
    loadCourseLibrary().then((library) => {
      setCourses(library.courses);
      setIsLoading(false);
    });
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const courseData = JSON.parse(text);

      // TODO: Handle course data (load into Learn Mode)
      console.log("Course data loaded:", courseData);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error loading course file:", error);
    }
  };

  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(),
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(),
  );

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const handleConceptClick = (concept: any, course: any, chapter: any) => {
    console.log("Concept selected:", concept);

    // Store the course, chapter, and concept for the animation
    setSelectedCourse(course);
    setSelectedChapter(chapter);

    // Dispatch event with full context to trigger animation in Learn Mode
    const event = new CustomEvent("excalidraw:concept-selected", {
      detail: {
        concept,
        course,
        chapter,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="layer-ui__courses">
      <div className="courses-menu-header">
        <h2>{t("toolBar.courses")}</h2>
      </div>
      <div className="courses-menu-content">
        <div className="courses-menu-buttons">
          <button
            className="course-menu-upload-button"
            onClick={handleUploadClick}
          >
            {t("labels.uploadCourse")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>
        {isLoading ? (
          <div className="courses-menu-loading">
            <p>Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="courses-menu-list">
            {courses.map((course: any) => (
              <div key={course.id} className="course-card-expandable">
                <div
                  className="course-card-header"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="course-card-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-metadata">
                      <span className="course-difficulty">{course.level}</span>
                      <span className="course-time">
                        {course.totalDuration} min
                      </span>
                    </div>
                  </div>
                  <svg
                    className={`expand-icon ${expandedCourses.has(course.id) ? "expanded" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                {expandedCourses.has(course.id) && course.chapters && (
                  <div className="course-chapters">
                    {course.chapters.map((chapter: any) => (
                      <div key={chapter.id} className="chapter-expandable">
                        <div
                          className={`chapter-header ${expandedChapters.has(chapter.id) ? "expanded" : ""}`}
                          onClick={() => toggleChapter(chapter.id)}
                        >
                          <svg
                            className="chapter-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M6 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                          <h4>{chapter.title}</h4>
                        </div>

                        {expandedChapters.has(chapter.id) &&
                          chapter.concepts && (
                            <div className="chapter-concepts">
                              {chapter.concepts.map((concept: any) => (
                                <div
                                  key={concept.id}
                                  className="concept-item"
                                  onClick={() =>
                                    handleConceptClick(concept, course, chapter)
                                  }
                                >
                                  <span className="concept-bullet">▸</span>
                                  <span className="concept-title">
                                    {concept.title}
                                  </span>
                                  {concept.duration && (
                                    <span className="concept-duration">
                                      {concept.duration}s
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="courses-menu-placeholder">
            <p>{t("labels.coursesPlaceholder")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
