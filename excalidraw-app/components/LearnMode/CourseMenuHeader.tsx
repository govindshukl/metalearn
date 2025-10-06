import React from "react";
import "./CourseMenuHeader.scss";

interface CourseMenuHeaderProps {
  title: string;
  onClose: () => void;
  onBack?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CourseMenuHeader: React.FC<CourseMenuHeaderProps> = ({
  title,
  onClose,
  onBack,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="course-menu-header">
      <div className="course-menu-header__top">
        {onBack && (
          <button
            className="course-menu-header__back"
            onClick={onBack}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M12 4l-8 6 8 6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </button>
        )}
        <h2 className="course-menu-header__title">{title}</h2>
        <button
          className="course-menu-header__close"
          onClick={onClose}
          aria-label="Close course menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M4 4l12 12M16 4L4 16"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <div className="course-menu-header__search">
        <input
          type="text"
          className="course-menu-header__search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
