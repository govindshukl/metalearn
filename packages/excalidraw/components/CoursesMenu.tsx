import React, { useRef } from "react";

import { t } from "../i18n";
import { useUIAppState } from "../context/ui-appState";
import { useApp } from "./App";

import CourseMenuBrowseButton from "./CourseMenuBrowseButton";

import "./CoursesMenu.scss";

export const CoursesMenu = () => {
  const appState = useUIAppState();
  const app = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="layer-ui__courses">
      <div className="courses-menu-header">
        <h2>{t("toolBar.courses")}</h2>
      </div>
      <div className="courses-menu-content">
        <div className="courses-menu-buttons">
          <CourseMenuBrowseButton
            theme={appState.theme}
            id={app.id}
            courseReturnUrl={window.location.origin + window.location.pathname}
          />
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
        <div className="courses-menu-placeholder">
          <p>{t("labels.coursesPlaceholder")}</p>
        </div>
      </div>
    </div>
  );
};
