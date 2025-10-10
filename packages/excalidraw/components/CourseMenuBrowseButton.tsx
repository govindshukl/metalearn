import { t } from "../i18n";

import type { UIAppState } from "../types";

const CourseMenuBrowseButton = ({
  theme,
  id,
  courseReturnUrl,
}: {
  courseReturnUrl: string;
  theme: UIAppState["theme"];
  id: string;
}) => {
  const referrer = courseReturnUrl;
  // TODO: Replace with actual course browser URL when available
  const courseBrowserUrl =
    import.meta.env.VITE_APP_COURSE_URL || "https://courses.example.com";

  return (
    <a
      className="course-menu-browse-button"
      href={`${courseBrowserUrl}?target=${
        window.name || "_blank"
      }&referrer=${referrer}&useHash=true&token=${id}&theme=${theme}`}
      target="_excalidraw_courses"
    >
      {t("labels.browseCourses")}
    </a>
  );
};

export default CourseMenuBrowseButton;
