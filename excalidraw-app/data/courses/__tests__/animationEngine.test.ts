import { describe, it, expect } from "vitest";
import { AnimationEngine } from "../../../engine/AnimationEngine";
import { ScriptParser } from "../../../engine/ScriptParser";
import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AnimationScript } from "../types";

describe("Animation Engine", () => {
  const mockElements: ExcalidrawElement[] = [
    {
      id: "elem1",
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      opacity: 100,
      angle: 0,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 0,
      roundness: null,
      seed: 1,
      version: 1,
      versionNonce: 1,
      isDeleted: false,
      boundElements: null,
      updated: 1,
      link: null,
      locked: false,
    } as ExcalidrawElement,
  ];

  const mockScript: AnimationScript = {
    version: "1.0",
    totalDuration: 2,
    steps: [
      {
        id: "step1",
        elementIds: ["elem1"],
        startTime: 0,
        duration: 1,
        type: "fade-in",
        easing: "linear",
      },
    ],
  };

  it("should create animation engine", () => {
    const engine = new AnimationEngine(mockElements, mockScript);
    expect(engine).toBeDefined();
    expect(engine.getDuration()).toBe(2);
  });

  it("should parse animation script", () => {
    const parsed = ScriptParser.parse(mockScript);
    expect(parsed.version).toBe("1.0");
    expect(parsed.steps.length).toBe(1);
  });

  it("should create simple fade-in script", () => {
    const script = ScriptParser.createSimpleFadeIn(["elem1", "elem2"], 4);
    expect(script.steps.length).toBe(2);
    expect(script.totalDuration).toBe(4);
  });

  it("should validate correct animation script", () => {
    const isValid = ScriptParser.validate(mockScript);
    expect(isValid).toBe(true);
  });

  it("should reject invalid animation script", () => {
    const invalidScript = {
      version: "1.0",
      // missing totalDuration
      steps: [],
    };
    const isValid = ScriptParser.validate(invalidScript);
    expect(isValid).toBe(false);
  });

  it("should export and import script as JSON", () => {
    const json = ScriptParser.toJSON(mockScript);
    const imported = ScriptParser.fromJSON(json);
    expect(imported.version).toBe(mockScript.version);
    expect(imported.totalDuration).toBe(mockScript.totalDuration);
    expect(imported.steps.length).toBe(mockScript.steps.length);
  });

  it("should initialize with stopped state", () => {
    const engine = new AnimationEngine(mockElements, mockScript);
    expect(engine.isPlaying()).toBe(false);
    expect(engine.getCurrentTime()).toBe(0);
  });

  it("should cleanup on dispose", () => {
    const engine = new AnimationEngine(mockElements, mockScript);
    engine.dispose();
    expect(engine.isPlaying()).toBe(false);
  });
});
