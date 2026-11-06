/**
 * Pure helper functions for horizontal track math, scroll clamping, and panel indexing.
 */

export function clampProgress(currentX: number, maxX: number): number {
  if (maxX <= 0) return 0;
  return Math.max(0, Math.min(1, currentX / maxX));
}

export function calculateTargetIndex(
  currentX: number,
  viewportWidth: number,
  totalPanels: number,
): number {
  if (totalPanels <= 1 || viewportWidth <= 0) return 0;
  const index = Math.round(currentX / viewportWidth);
  return Math.max(0, Math.min(totalPanels - 1, index));
}

export function calculateImpulse(
  delta: number,
  viewportWidth: number,
  isDeltaModePixel = true,
): number {
  if (!isDeltaModePixel) {
    return Math.sign(delta) * viewportWidth;
  }
  // Moderated impulse scaling with higher tolerance for silky, controlled navigation
  const maxStep = viewportWidth * 0.4;
  const scaled = delta * (viewportWidth * 0.0012);
  return Math.max(-maxStep, Math.min(maxStep, scaled));
}

export function calculateTrackOffset(targetIndex: number, viewportWidth: number): number {
  return Math.max(0, targetIndex * Math.max(1, viewportWidth));
}
