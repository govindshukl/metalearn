import React from "react";
import "./LearnModeBanner.scss";

interface LearnModeBannerProps {
  currentCourse?: string;
  currentChapter?: string;
  onClose?: () => void;
}

export const LearnModeBanner: React.FC<LearnModeBannerProps> = ({
  currentCourse,
  currentChapter,
  onClose,
}) => {
  return (
    <div className="learn-mode-banner">
      <div className="learn-mode-banner__content">
        <div className="learn-mode-banner__icon">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 2L2 6v6c0 5 3 9 8 10 5-1 8-5 8-10V6l-8-4z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="learn-mode-banner__text">
          <span className="learn-mode-banner__label">Learn Mode Active</span>
          {currentCourse && (
            <span className="learn-mode-banner__course">
              {currentCourse}
              {currentChapter && ` → ${currentChapter}`}
            </span>
          )}
        </div>
      </div>
      {onClose && (
        <button
          className="learn-mode-banner__close"
          onClick={onClose}
          aria-label="Close banner"
        >
          ✕
        </button>
      )}
    </div>
  );
};
