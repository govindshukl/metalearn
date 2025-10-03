# Excalidraw Core Design & Architecture

## Overview

Excalidraw is a virtual hand-drawn style whiteboard application built with React and TypeScript. It features an infinite canvas where users can create diagrams, sketches, and collaborate in real-time. The architecture is designed around immutable elements, functional rendering, and collaborative state synchronization.

## High-Level Architecture

```
┌─────────────────────────────────────────┐
│              Excalidraw App             │
├─────────────────────────────────────────┤
│  React Components & UI Layer            │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ Toolbars    │  │ Canvas Layers   │   │
│  │ Sidebars    │  │ - Static        │   │
│  │ Dialogs     │  │ - Interactive   │   │
│  └─────────────┘  │ - NewElement    │   │
│                   └─────────────────┘   │
├─────────────────────────────────────────┤
│  State Management (Jotai)               │
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ AppState        │ │ Elements Array  │ │
│  │ - Current tool  │ │ - Scene objects │ │
│  │ - UI mode       │ │ - Versioned     │ │
│  │ - Collaboration │ │ - Immutable     │ │
│  └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────┤
│  Core Engine                            │
│  ┌──────────────┐ ┌───────────────────┐  │
│  │ Element      │ │ Rendering Engine  │  │
│  │ System       │ │ - Canvas2D        │  │
│  │ - Types      │ │ - SVG Export      │  │
│  │ - Mutations  │ │ - RoughJS         │  │
│  │ - Geometry   │ │ - Hit Detection   │  │
│  └──────────────┘ └───────────────────┘  │
├─────────────────────────────────────────┤
│  Collaboration Layer                    │
│  ┌──────────────┐ ┌───────────────────┐  │
│  │ WebSocket    │ │ Conflict          │  │
│  │ Portal       │ │ Resolution        │  │
│  │ - Real-time  │ │ - Version-based   │  │
│  │ - Encrypted  │ │ - CRDT-like       │  │
│  └──────────────┘ └───────────────────┘  │
└─────────────────────────────────────────┘
```

## Core Design Principles

### 1. **Immutable Element System**
- Every drawing element is immutable
- Changes create new element versions with incremented `version` and `versionNonce`
- Elements have unique IDs and maintain history through versioning
- Enables efficient collaboration, undo/redo, and change tracking

### 2. **Functional Rendering Pipeline**
- Render functions are pure - same input always produces same output
- Multiple canvas layers for performance optimization
- RoughJS integration for hand-drawn aesthetic
- Efficient hit detection and bounds calculation

### 3. **Decentralized State Management**
- Jotai atoms for granular reactivity
- AppState tracks UI and interaction state
- Elements array maintains scene content
- Clean separation of concerns

### 4. **Real-time Collaboration**
- WebSocket-based with end-to-end encryption
- Version-based conflict resolution
- Operational transformation for concurrent edits
- User presence and cursor tracking

## Element System

### Element Types & Hierarchy

```typescript
ExcalidrawElement (Base)
├── ExcalidrawSelectionElement
├── ExcalidrawRectangleElement
├── ExcalidrawDiamondElement
├── ExcalidrawEllipseElement
├── ExcalidrawImageElement
├── ExcalidrawTextElement
├── ExcalidrawLinearElement
│   ├── ExcalidrawArrowElement
│   └── ExcalidrawLineElement
├── ExcalidrawFreeDrawElement
├── ExcalidrawFrameElement
├── ExcalidrawMagicFrameElement
├── ExcalidrawEmbeddableElement
│   └── ExcalidrawIframeLikeElement
└── ExcalidrawIframeElement
```

### Element Properties

Every element contains:

```typescript
interface ExcalidrawElementBase {
  id: string;                    // Unique identifier
  x: number; y: number;          // Position coordinates
  width: number; height: number; // Dimensions
  angle: Radians;                // Rotation angle
  strokeColor: string;           // Border color
  backgroundColor: string;        // Fill color
  fillStyle: FillStyle;          // Fill pattern
  strokeWidth: number;           // Border thickness
  strokeStyle: StrokeStyle;      // Border pattern
  roughness: number;             // Hand-drawn effect intensity
  opacity: number;               // Transparency
  version: number;               // Incremental version
  versionNonce: number;          // Random reconciliation ID
  index: FractionalIndex;        // Z-order positioning
  isDeleted: boolean;            // Soft deletion flag
  groupIds: GroupId[];           // Group membership
  frameId: string | null;        // Parent frame
  boundElements: BoundElement[]; // Connected elements
  updated: number;               // Last modification timestamp
  link: string | null;           // Hyperlink URL
  locked: boolean;               // Edit protection
  seed: number;                  // RoughJS deterministic seed
  roundness: Roundness;          // Corner rounding
}
```

### Element Operations

**Creation:**
- `newElement()` - Creates new element with defaults
- `newElementWith()` - Creates element with specific properties
- Automatic ID generation, versioning, and indexing

**Mutation:**
- `mutateElement()` - Immutable element updates
- `bumpVersion()` - Increments version for collaboration
- All changes create new element instances

**Queries:**
- `getElementAbsoluteCoords()` - Bounding box calculation
- `hitTest()` - Point-in-element detection
- `isElementInViewport()` - Visibility checking

## Rendering Architecture

### Multi-Layer Canvas System

```
┌─────────────────────────────────────┐
│          Interactive Canvas         │  ← Active tool interactions
├─────────────────────────────────────┤
│           Static Canvas             │  ← Main scene content
├─────────────────────────────────────┤
│         Background Canvas           │  ← Grid, background
└─────────────────────────────────────┘
```

**Static Canvas:**
- Renders finalized elements
- Only updates when scene changes
- Optimized for large scenes
- Exports and screenshots

**Interactive Canvas:**
- Renders active drawing operations
- Selection highlights and handles
- Real-time tool feedback
- Collaborative cursors

**NewElement Canvas:**
- Renders element being created
- Temporary visual feedback
- Cleared after element completion

### Rendering Pipeline

1. **Scene Preparation**
   - Filter visible elements in viewport
   - Sort by z-index (fractional indices)
   - Apply frame clipping

2. **Element Rendering**
   - Transform coordinates (scene → canvas)
   - Apply element transformations
   - Render via RoughJS or native canvas
   - Handle text metrics and wrapping

3. **Post-processing**
   - Link indicators and handles
   - Selection outlines
   - Grid overlay

### Performance Optimizations

- **Viewport Culling:** Only render visible elements
- **Layer Separation:** Static vs interactive content
- **Throttled Updates:** Limit render frequency during interactions
- **Canvas Recycling:** Reuse canvases between renders
- **Dirty Region Tracking:** Update only changed areas

## State Management

### AppState Structure

```typescript
interface AppState {
  // Tool state
  activeTool: ToolType;
  currentItemStrokeColor: string;
  currentItemBackgroundColor: string;
  currentItemStrokeWidth: number;

  // UI state
  viewModeEnabled: boolean;
  zenModeEnabled: boolean;
  gridModeEnabled: boolean;
  showStats: boolean;

  // Interaction state
  cursorButton: "up" | "down";
  editingElement: string | null;
  resizingElement: string | null;
  selectedElementIds: Record<string, true>;
  selectedGroupIds: Record<string, true>;

  // Canvas state
  scrollX: number; scrollY: number;
  zoom: NormalizedZoomValue;

  // Collaboration state
  collaborators: Map<string, Collaborator>;
  userToFollow: UserId | null;
}
```

### Jotai Integration

- **Isolated Store:** Custom Jotai isolation prevents conflicts
- **Granular Atoms:** Individual atoms for different state slices
- **Derived State:** Computed values using atom combinations
- **Time Travel:** Undo/redo through state snapshots

### State Flow

```
User Input → Action → State Update → Re-render
     ↓
Element Mutation → Version Increment → Collaboration Sync
     ↓
History Recording → Undo Stack Update
```

## Collaboration System

### Real-time Architecture

**Portal Class:**
- WebSocket connection management
- Message queuing and throttling
- Connection recovery and reconnection
- Room-based collaboration

**Conflict Resolution:**
- Version-based reconciliation
- Last-writer-wins with timestamp tiebreaking
- Element-level granularity
- Operational transformation for concurrent edits

### Collaboration Flow

1. **Connection Establishment**
   ```
   Client A ──join-room──→ Server ──room-created──→ Client A
   Client B ──join-room──→ Server ──new-user─────→ Client A
                                 └─user-joined───→ Client B
   ```

2. **Element Synchronization**
   ```
   Client A: Create Element v1
   Client A ──element-update──→ Server ──broadcast──→ Client B
   Client B: Apply Element v1
   ```

3. **Conflict Handling**
   ```
   Client A: Edit Element v1 → v2
   Client B: Edit Element v1 → v2 (concurrent)

   Server receives both updates:
   - Compare timestamps
   - Apply last-writer-wins
   - Broadcast resolved state
   ```

### Security & Privacy

- **End-to-End Encryption:** All element data encrypted before transmission
- **Room Keys:** Cryptographic room access control
- **No Server Storage:** Server only relays encrypted messages
- **Ephemeral Rooms:** Rooms destroyed when empty

## Data Persistence

### Local Storage
- **Scene Autosave:** Periodic saves to browser storage
- **Library Items:** Reusable element collections
- **User Preferences:** Tool settings and UI state
- **Version Migration:** Handle schema changes

### Export Formats
- **Native JSON:** `.excalidraw` format with full fidelity
- **PNG Export:** Raster graphics with transparency
- **SVG Export:** Vector graphics with text preservation
- **Clipboard:** Multi-format clipboard integration

### Import Handling
- **Drag & Drop:** Image and file import
- **Paste Operations:** Clipboard content parsing
- **Library Integration:** Reusable component system
- **Version Compatibility:** Backward/forward compatibility

## Performance Characteristics

### Scalability Limits
- **Elements:** Thousands of elements with good performance
- **Collaborators:** Designed for small team collaboration (< 20 users)
- **Canvas Size:** Virtually infinite canvas with viewport culling
- **Memory Usage:** Linear with visible element count

### Optimization Strategies
- **Lazy Loading:** Load elements as needed
- **Spatial Indexing:** Quick hit detection and queries
- **Debounced Updates:** Batch rapid changes
- **Canvas Pooling:** Reuse render contexts
- **Worker Threads:** Offload heavy computations

## Extension Points

### Plugin Architecture
- **Custom Elements:** New element types via interfaces
- **Tool Extensions:** Custom drawing tools
- **Export Plugins:** Additional export formats
- **Import Handlers:** Custom import logic
- **UI Components:** Custom sidebars and panels

### API Integration
- **ExcalidrawAPI:** Programmatic control interface
- **Event Hooks:** Lifecycle and interaction callbacks
- **State Access:** Read/write application state
- **Collaboration Events:** Multi-user interaction handling

## Testing Strategy

### Unit Testing (Vitest)
- **Element Operations:** Creation, mutation, queries
- **State Management:** Reducers and atom behavior
- **Geometry Calculations:** Bounds, hit detection, transformations
- **Utility Functions:** Serialization, validation, helpers

### Integration Testing
- **Collaboration:** Multi-client scenarios
- **Import/Export:** File format compatibility
- **Canvas Rendering:** Visual regression testing
- **Performance:** Benchmark critical paths

### End-to-End Testing
- **User Workflows:** Complete drawing scenarios
- **Cross-browser:** Compatibility testing
- **Mobile Devices:** Touch interaction testing
- **Accessibility:** Screen reader and keyboard navigation

## Security Considerations

### Input Validation
- **Element Properties:** Sanitize all user inputs
- **File Uploads:** Validate image formats and sizes
- **URL Handling:** Prevent XSS in links and embeds
- **Collaborative Data:** Validate remote updates

### Privacy Protection
- **No Tracking:** Minimal analytics, user privacy focus
- **Local-First:** Data stays on device by default
- **Encrypted Collaboration:** End-to-end encryption
- **Content Security:** Prevent malicious element injection

## Future Architecture Considerations

### Scalability Improvements
- **Web Workers:** Move heavy operations off main thread
- **IndexedDB:** Local database for large scenes
- **Server Persistence:** Optional cloud storage
- **CDN Integration:** Asset delivery optimization

### Feature Expansions
- **Version Control:** Git-like branching for scenes
- **Advanced Collaboration:** Commenting, suggestions, reviews
- **Plugin Marketplace:** Third-party extension ecosystem
- **Mobile Apps:** Native iOS/Android applications

This design document captures the current architecture and provides a foundation for understanding Excalidraw's core systems, enabling effective development and future enhancements.