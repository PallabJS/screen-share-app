# Screen Share Annotation Tool (Frontend)

A frontend-only screen sharing and annotation tool that allows users to share their screen and draw real-time annotations using a canvas overlay.  
The application focuses on **media handling**, **canvas rendering**, and **robust application architecture**, with no backend or collaboration layer.

---

## Tech Stack

- **Next.js (App Router)**
- **React**
- **Redux Toolkit**
- **Redux-Saga**
- **HTML Canvas API**
- **MediaDevices API**
- **TypeScript**
- **Tailwind CSS**

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

Open the application at:  
**http://localhost:3000/connect**

---

## Functional Overview

### Screen Sharing

- Start and stop screen sharing using `navigator.mediaDevices.getDisplayMedia`
- Handles:
  - User permission denial
  - Browser / OS “Stop sharing” action
- Screen sharing lifecycle is fully managed via **Redux-Saga**

### Canvas Annotation

- Drawing tools:
  - Pen
  - Highlighter
  - Eraser
  - Rectangle
  - Arrow
  - Text (prompt-based - experimental)
- Adjustable stroke width and color
- Toggle annotation visibility
- Undo / Redo support
- Clear all annotations (no backup)
- Export snapshot (includes both video frame and annotations)

---

## Canvas Layering & Scaling Approach

### Layering Strategy

- The **screen share video** is rendered as a `<video>` element
- A **transparent `<canvas>`** is positioned absolutely on top of the video
- Annotations are drawn **only on the canvas**, ensuring the video stream is never mutated

```
┌────────────────────────────┐
│        Video Element       │
│   (Screen Share Stream)    │
├────────────────────────────┤
│     Canvas Overlay         │
│   (Annotations Layer)      │
└────────────────────────────┘
```

### Coordinate System & Scaling

- All annotation points are stored as **normalized coordinates**
- Points are re-mapped on every redraw based on the current canvas size
- This guarantees:
  - Resize-safe rendering
  - Aspect-ratio–correct scaling
  - Pixel-perfect export

### High-DPI Handling

- Canvas internally scales using `devicePixelRatio`
- Logical drawing coordinates remain CSS-based
- Exported images match exactly what is visible on screen

---

## State Management & Data Flow

### Redux Toolkit

Manages:

- Screen sharing state
- Active drawing tool
- Stroke color and width
- Annotation visibility

### Redux-Saga

Handles:

- Screen share start / stop
- Media permission handling
- Browser-level stop events

This keeps UI logic declarative and side effects isolated.

---

## Key Architectural Decisions

- Frontend-only design (no backend or signaling)
- Normalized annotation data for resize safety
- Canvas overlay approach (video renders under the canvas)
- Redux-Saga for long-lived async processes
- Offscreen canvas used for snapshot export
