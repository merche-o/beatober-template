import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
};

type State = { failed: boolean };

/**
 * Three.js / WebGL can fail in headless or no-GPU environments.
 * Fall back to the 2D procedural visualizer instead of crashing the render.
 */
export class WebGLSafeBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[Beatober] WebGL unavailable, using 2D visualizer:", error.message);
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
