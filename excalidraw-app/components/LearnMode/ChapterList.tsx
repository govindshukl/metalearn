import React from "react";
import type { Chapter } from "../../data/courses/types";
import "./ChapterList.scss";

interface ChapterListProps {
  chapters: Chapter[];
  searchQuery: string;
  onChapterSelect: (chapter: Chapter) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  searchQuery,
  onChapterSelect,
}) => {
  const filteredChapters = chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedChapters = [...filteredChapters].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="chapter-list">
      {sortedChapters.map((chapter) => (
        <div
          key={chapter.id}
          className="chapter-card"
          onClick={() => onChapterSelect(chapter)}
        >
          <div className="chapter-card__number">{chapter.order}</div>
          <div className="chapter-card__content">
            <h3 className="chapter-card__title">{chapter.title}</h3>
            <p className="chapter-card__description">{chapter.description}</p>
            <span className="chapter-card__concepts">
              {chapter.concepts.length} concepts
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
