import React, { useState, useEffect } from "react";
import { useAtom } from "../../app-jotai";
import {
  isCourseMenuOpenAtom,
  selectedCourseAtom,
  selectedChapterAtom,
  selectedConceptAtom,
} from "../../app-jotai";
import { loadCourseLibrary } from "../../data/courses/courseLoader";
import type { Course, Chapter, Concept } from "../../data/courses/types";
import { CourseMenuHeader } from "./CourseMenuHeader";
import "./CourseMenu.scss";

export const CourseMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isCourseMenuOpenAtom);
  const [selectedCourse, setSelectedCourse] = useAtom(selectedCourseAtom);
  const [selectedChapter, setSelectedChapter] = useAtom(selectedChapterAtom);
  const [selectedConcept, setSelectedConcept] = useAtom(selectedConceptAtom);

  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(),
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load courses when menu opens
    if (isOpen) {
      loadCourseLibrary().then((library) => {
        setCourses(library.courses);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for course selection from sidebar
    const handleCourseSelected = (event: CustomEvent) => {
      const { course } = event.detail;
      console.log("Course selected from sidebar:", course);

      // Load the full course if we only have basic info
      if (course && course.id) {
        loadCourseLibrary().then((library) => {
          const fullCourse = library.courses.find((c) => c.id === course.id);
          if (fullCourse) {
            toggleCourse(fullCourse.id);
            setIsOpen(true); // Open the course menu
          }
        });
      }
    };

    // Listen for concept selection from sidebar
    const handleConceptSelected = (event: CustomEvent) => {
      const { concept, course, chapter } = event.detail;
      console.log("Concept selected from sidebar:", concept, course, chapter);

      if (concept && course && chapter) {
        setSelectedCourse(course);
        setSelectedChapter(chapter);
        setSelectedConcept(concept);
      }
    };

    window.addEventListener(
      "excalidraw:course-selected" as any,
      handleCourseSelected as EventListener,
    );

    window.addEventListener(
      "excalidraw:concept-selected" as any,
      handleConceptSelected as EventListener,
    );

    return () => {
      window.removeEventListener(
        "excalidraw:course-selected" as any,
        handleCourseSelected as EventListener,
      );
      window.removeEventListener(
        "excalidraw:concept-selected" as any,
        handleConceptSelected as EventListener,
      );
    };
  }, []);

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

  const handleConceptSelect = (concept: Concept, course: Course, chapter: Chapter) => {
    console.log("handleConceptSelect called with:", concept);
    setSelectedCourse(course);
    setSelectedChapter(chapter);
    setSelectedConcept(concept);
    console.log("selectedConceptAtom updated");
    // Drawer stays open - animation plays in main canvas
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="course-menu-wrapper">
      <div className="course-menu-overlay" onClick={handleClose} />
      <div className="course-menu">
        <CourseMenuHeader
          title="Courses"
          breadcrumb={
            selectedConcept && selectedCourse && selectedChapter
              ? `${selectedCourse.title} > ${selectedChapter.title} > ${selectedConcept.title}`
              : undefined
          }
          onClose={handleClose}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="course-menu-content">
          <div className="course-list">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div
                  className="course-card-header"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="course-card-info">
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-description">
                      {course.description}
                    </p>
                    <div className="course-card-meta">
                      <span className="course-badge">{course.level}</span>
                      <span className="course-duration">
                        {course.totalDuration} min
                      </span>
                    </div>
                  </div>
                  <svg
                    className={`course-expand-icon ${expandedCourses.has(course.id) ? "expanded" : ""}`}
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

                {expandedCourses.has(course.id) && (
                  <div className="course-content">
                    {course.chapters.map((chapter) => (
                      <div key={chapter.id} className="chapter-item">
                        <div
                          className={`chapter-header ${expandedChapters.has(chapter.id) ? "expanded" : ""}`}
                          onClick={() => toggleChapter(chapter.id)}
                        >
                          <svg
                            className="chapter-expand-icon"
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

                        {expandedChapters.has(chapter.id) && (
                          <div className="concepts-list">
                            {chapter.concepts.map((concept) => (
                              <div
                                key={concept.id}
                                className={`concept-item ${selectedConcept?.id === concept.id ? "active" : ""}`}
                                onClick={() =>
                                  handleConceptSelect(concept, course, chapter)
                                }
                              >
                                <span className="concept-icon">▸</span>
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
        </div>
      </div>
    </div>
  );
};
