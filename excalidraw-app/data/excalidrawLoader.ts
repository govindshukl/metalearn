import type { ExcalidrawElement } from "@excalidraw/element/types";
import { excalidrawFiles } from "./courses/excalidrawFiles";

export interface ExcalidrawFileData {
  type: string;
  version: number;
  source: string;
  elements: ExcalidrawElement[];
  appState?: any;
  files?: any;
}

/**
 * Load Excalidraw file from URL or path
 */
export const loadExcalidrawFile = async (
  filePath: string,
): Promise<ExcalidrawFileData> => {
  try {
    // Check if file is available in the imported files map first
    if (excalidrawFiles[filePath]) {
      console.log("Loading Excalidraw file from imported data:", filePath);
      return excalidrawFiles[filePath];
    }

    // Fallback to fetching
    console.log("Fetching Excalidraw file:", filePath);
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load Excalidraw file from ${filePath}`);
    }

    const data = await response.json();

    if (!validateExcalidrawFile(data)) {
      throw new Error("Invalid Excalidraw file format");
    }

    return data;
  } catch (error) {
    console.error("Error loading Excalidraw file:", error);
    throw error;
  }
};

/**
 * Validate Excalidraw file structure
 */
export const validateExcalidrawFile = (data: any): boolean => {
  return (
    data &&
    typeof data === "object" &&
    data.type === "excalidraw" &&
    Array.isArray(data.elements)
  );
};

/**
 * Extract elements from Excalidraw file
 */
export const extractElements = (
  fileData: ExcalidrawFileData,
): ExcalidrawElement[] => {
  return fileData.elements;
};
