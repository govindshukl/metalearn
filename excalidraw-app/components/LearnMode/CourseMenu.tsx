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
import { CourseList } from "./CourseList";
import { ChapterList } from "./ChapterList";
import { ConceptList } from "./ConceptList";
import "./CourseMenu.scss";

type MenuView = "courses" | "chapters" | "concepts";

export const CourseMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isCourseMenuOpenAtom);
  const [selectedCourse, setSelectedCourse] = useAtom(selectedCourseAtom);
  const [selectedChapter, setSelectedChapter] = useAtom(selectedChapterAtom);
  const [selectedConcept, setSelectedConcept] = useAtom(selectedConceptAtom);

  const [courses, setCourses] = useState<Course[]>([]);
  const [currentView, setCurrentView] = useState<MenuView>("courses");
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
    // Update view based on selection
    if (selectedConcept) {
      setCurrentView("concepts");
    } else if (selectedChapter) {
      setCurrentView("concepts");
    } else if (selectedCourse) {
      setCurrentView("chapters");
    } else {
      setCurrentView("courses");
    }
  }, [selectedCourse, selectedChapter, selectedConcept]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedChapter(null);
    setSelectedConcept(null);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedConcept(null);
  };

  const handleConceptSelect = (concept: Concept) => {
    setSelectedConcept(concept);
    // This will trigger the ConceptPlayer in the next workflow
  };

  const handleBack = () => {
    if (currentView === "concepts") {
      setSelectedChapter(null);
      setCurrentView("chapters");
    } else if (currentView === "chapters") {
      setSelectedCourse(null);
      setCurrentView("courses");
    }
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
          title={
            currentView === "concepts" && selectedChapter
              ? selectedChapter.title
              : currentView === "chapters" && selectedCourse
                ? selectedCourse.title
                : "Courses"
          }
          onClose={handleClose}
          onBack={currentView !== "courses" ? handleBack : undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="course-menu-content">
          {currentView === "courses" && (
            <CourseList
              courses={courses}
              searchQuery={searchQuery}
              onCourseSelect={handleCourseSelect}
            />
          )}

          {currentView === "chapters" && selectedCourse && (
            <ChapterList
              chapters={selectedCourse.chapters}
              searchQuery={searchQuery}
              onChapterSelect={handleChapterSelect}
            />
          )}

          {currentView === "concepts" && selectedChapter && (
            <ConceptList
              concepts={selectedChapter.concepts}
              searchQuery={searchQuery}
              onConceptSelect={handleConceptSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};
