import type { Course } from "./types";

export const sampleCourse: Course = {
  id: "intro-to-algorithms",
  title: "Introduction to Algorithms",
  description: "Learn fundamental algorithms through visual explanations",
  thumbnail: "/courses/thumbnails/algorithms.png",
  metadata: {
    author: "Metalearn Team",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    estimatedTime: 45,
    difficulty: "beginner",
    tags: ["algorithms", "computer-science", "fundamentals"],
    version: "1.0.0",
  },
  chapters: [
    {
      id: "ch1-sorting",
      title: "Chapter 1: Sorting Algorithms",
      description: "Understanding basic sorting algorithms",
      order: 1,
      thumbnail: "/courses/thumbnails/sorting.png",
      concepts: [
        {
          id: "bubble-sort",
          title: "Bubble Sort",
          description: "Learn how bubble sort works step by step",
          excalidrawFile: "/courses/data/bubble-sort.excalidraw",
          duration: 120, // 2 minutes
          animationScript: {
            version: "1.0",
            totalDuration: 120,
            steps: [
              {
                id: "step1",
                elementIds: ["array-container"],
                startTime: 0,
                duration: 1,
                type: "fade-in",
                easing: "ease-in-out",
              },
              {
                id: "step2",
                elementIds: ["element-0", "element-1"],
                startTime: 2,
                duration: 1,
                type: "scale",
                easing: "ease-in-out",
                properties: {
                  from: { scale: 1 },
                  to: { scale: 1.2 },
                },
              },
              {
                id: "step3",
                elementIds: ["compare-arrow"],
                startTime: 3,
                duration: 0.5,
                type: "appear",
              },
            ],
          },
          narrative: [
            {
              id: "narr1",
              startTime: 0,
              endTime: 5,
              text: "Bubble sort compares adjacent elements and swaps them if they're in the wrong order.",
              position: "bottom",
            },
            {
              id: "narr2",
              startTime: 5,
              endTime: 10,
              text: "Let's start by comparing the first two elements.",
              position: "bottom",
            },
          ],
          tags: ["sorting", "comparison-based"],
        },
        {
          id: "quick-sort",
          title: "Quick Sort",
          description: "Understanding the divide and conquer approach",
          excalidrawFile: "/courses/data/quick-sort.excalidraw",
          duration: 180,
          animationScript: {
            version: "1.0",
            totalDuration: 180,
            steps: [],
          },
          narrative: [],
          tags: ["sorting", "divide-and-conquer"],
        },
      ],
    },
    {
      id: "ch2-searching",
      title: "Chapter 2: Searching Algorithms",
      description: "Learn efficient ways to find elements",
      order: 2,
      concepts: [
        {
          id: "binary-search",
          title: "Binary Search",
          description: "Efficient searching in sorted arrays",
          excalidrawFile: "/courses/data/binary-search.excalidraw",
          duration: 150,
          animationScript: {
            version: "1.0",
            totalDuration: 150,
            steps: [],
          },
          narrative: [],
          tags: ["searching", "divide-and-conquer"],
        },
      ],
    },
  ],
  prerequisites: [],
};
