"use client";

import { Component, type ReactNode } from "react";

interface Props {
  /** Called once if the 3D scene throws (e.g. shader or context errors). */
  onError: () => void;
  children: ReactNode;
}

/** Catches errors from the 3D room so the page can show its no-WebGL message. */
export class SceneErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV === "development") console.warn("3D room failed.", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
