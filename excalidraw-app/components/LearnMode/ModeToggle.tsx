import type React from "react";
import "./ModeToggle.scss";

interface ModeToggleProps {
  isLearnMode: boolean;
  onToggle: (isLearnMode: boolean) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  isLearnMode,
  onToggle,
}) => {
  const handleToggle = () => {
    const newMode = !isLearnMode;
    onToggle(newMode);
    // Persist to localStorage
    localStorage.setItem("metalearn-mode", newMode ? "learn" : "design");
  };

  return (
    <div className="mode-toggle-container">
      <span className="mode-toggle-label">Design</span>
      <label className="mode-toggle-switch">
        <input
          type="checkbox"
          checked={isLearnMode}
          onChange={handleToggle}
          aria-label={isLearnMode ? "Switch to Design Mode" : "Switch to Learn Mode"}
        />
        <span className="mode-toggle-slider"></span>
      </label>
      <span className="mode-toggle-label">Learn</span>
    </div>
  );
};
