// Measures active study time for one attempt.
// Time counts only while the tab is visible, and any stretch longer than
// IDLE_CAP_MS without a click, key press or scroll counts as IDLE_CAP_MS,
// so a tab left open overnight does not turn into a ten-hour quiz.

export const IDLE_CAP_MS = 5 * 60 * 1000;

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'] as const;

export class ActivityTimer {
  readonly startedAt = new Date();
  private activeMs = 0;
  private lastMark = Date.now();
  private visible = typeof document === 'undefined' || document.visibilityState === 'visible';
  private disposed = false;

  constructor() {
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    ACTIVITY_EVENTS.forEach(name => document.addEventListener(name, this.onActivity, { passive: true, capture: true }));
  }

  private flush() {
    const now = Date.now();
    if (this.visible && !this.disposed) {
      this.activeMs += Math.min(Math.max(0, now - this.lastMark), IDLE_CAP_MS);
    }
    this.lastMark = now;
  }

  private onActivity = () => this.flush();

  private onVisibilityChange = () => {
    this.flush();
    this.visible = document.visibilityState === 'visible';
  };

  /** Active seconds so far. */
  seconds(): number {
    this.flush();
    return Math.round(this.activeMs / 1000);
  }

  dispose() {
    if (this.disposed) return;
    this.flush();
    this.disposed = true;
    if (typeof document === 'undefined') return;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    ACTIVITY_EVENTS.forEach(name => document.removeEventListener(name, this.onActivity, { capture: true }));
  }
}
