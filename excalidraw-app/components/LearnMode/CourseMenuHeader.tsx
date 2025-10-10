import React from "react";
import "./CourseMenuHeader.scss";

interface CourseMenuHeaderProps {
  title: string;
  breadcrumb?: string;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CourseMenuHeader: React.FC<CourseMenuHeaderProps> = ({
  title,
  breadcrumb,
  onClose,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="course-menu-header">
      <div className="course-menu-header__top">
        <div className="course-menu-header__title-container">
          {breadcrumb && (
            <div className="course-menu-header__breadcrumb">{breadcrumb}</div>
          )}
          <h2 className="course-menu-header__title">{title}</h2>
        </div>
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
