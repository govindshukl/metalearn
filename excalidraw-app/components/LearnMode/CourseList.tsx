import React from "react";
import type { Course } from "../../data/courses/types";
import "./CourseList.scss";

interface CourseListProps {
  courses: Course[];
  searchQuery: string;
  onCourseSelect: (course: Course) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  searchQuery,
  onCourseSelect,
}) => {
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="course-list">
      {filteredCourses.length === 0 ? (
        <div className="course-list-empty">
          <p>No courses found</p>
        </div>
      ) : (
        filteredCourses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => onCourseSelect(course)}
          >
            <div className="course-card__thumbnail">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="course-card__placeholder">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <path
                      d="M20 4L4 12v12c0 10 6 18 16 20 10-2 16-10 16-20V12L20 4z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="course-card__content">
              <h3 className="course-card__title">{course.title}</h3>
              <p className="course-card__description">{course.description}</p>
              <div className="course-card__meta">
                <span className="course-card__chapters">
                  {course.chapters.length} chapters
                </span>
                <span className="course-card__difficulty">
                  {course.metadata.difficulty}
                </span>
                <span className="course-card__time">
                  {course.metadata.estimatedTime} min
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
