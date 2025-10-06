import React from "react";
import type { Concept } from "../../data/courses/types";
import "./ConceptList.scss";

interface ConceptListProps {
  concepts: Concept[];
  searchQuery: string;
  onConceptSelect: (concept: Concept) => void;
}

export const ConceptList: React.FC<ConceptListProps> = ({
  concepts,
  searchQuery,
  onConceptSelect,
}) => {
  const filteredConcepts = concepts.filter((concept) =>
    concept.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="concept-list">
      {filteredConcepts.map((concept) => (
        <div
          key={concept.id}
          className="concept-card"
          onClick={() => onConceptSelect(concept)}
        >
          <div className="concept-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </div>
          <div className="concept-card__content">
            <h4 className="concept-card__title">{concept.title}</h4>
            {concept.description && (
              <p className="concept-card__description">{concept.description}</p>
            )}
            <div className="concept-card__meta">
              <span className="concept-card__duration">
                {formatDuration(concept.duration)}
              </span>
              {concept.tags && concept.tags.length > 0 && (
                <div className="concept-card__tags">
                  {concept.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="concept-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
