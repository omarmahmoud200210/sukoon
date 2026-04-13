/**
 * Sukoon Animation System
 * ─────────────────────────────────────────────
 * "Still Water" — animations that feel like ripples on a calm surface.
 * Calm, purposeful, never performative.
 *
 * All motion variants are centralized here so every page uses
 * the exact same physics and timing. Import what you need.
 */

import type { Variants, Transition } from "framer-motion";

// ─── Easing Curves ───────────────────────────────────────────────────────────

/** Smooth deceleration — feels natural on entrance */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Smooth acceleration — feels natural on exit */
export const easeIn = [0.64, 0, 0.78, 0] as const;

// ─── Base Transitions ─────────────────────────────────────────────────────────

/** Standard entrance/exit timing */
export const defaultTransition: Transition = {
  duration: 0.4,
  ease: easeOut,
};

/** Quick exit — exits should always be faster than entrances */
export const exitTransition: Transition = {
  duration: 0.2,
  ease: easeIn,
};

/** Spring — for panels, drawers, dialogs */
export const springTransition: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 280,
  mass: 0.8,
};

// ─── Page Variants ────────────────────────────────────────────────────────────

/**
 * pageVariants — used on every top-level page (<main>).
 * Soft fade up from 10px. No scale — full-page scales feel jarring.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: exitTransition,
  },
};

/**
 * headerVariants — subtle top-down entrance for page headers.
 * Slightly delayed to let the page background settle first.
 */
export const headerVariants: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...defaultTransition, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: exitTransition,
  },
};

// ─── List / Stagger Variants ──────────────────────────────────────────────────

/**
 * listContainer — wrap your <ul> or list root with this.
 * It orchestrates the stagger of all child listItem elements.
 */
export const listContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.1,
    },
  },
  exit: {},
};

/**
 * listItem — each individual task row / list row.
 * MUST be a child of a listContainer to get stagger timing.
 */
export const listItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: exitTransition,
  },
};

// ─── Grid / Card Variants ─────────────────────────────────────────────────────

/**
 * gridContainer — wrap your grid root with this.
 * Same stagger logic as listContainer but tuned for multi-column grids.
 */
export const gridContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/**
 * cardItem — each card in a grid.
 * Slightly larger y offset than listItem for grid aesthetics.
 */
export const cardItem: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: exitTransition,
  },
};

// ─── Panel Variants ───────────────────────────────────────────────────────────

/**
 * panelVariants — side panels that slide in from the right.
 * Uses spring for a more tactile, physical feel.
 */
export const panelVariants: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: exitTransition,
  },
};

// ─── Fade-only Variants ───────────────────────────────────────────────────────

/**
 * fadeVariants — simple opacity in/out, no movement.
 * Use for overlays, empty states, status messages.
 */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: exitTransition,
  },
};

// ─── Reduced Motion Safe Wrapper ──────────────────────────────────────────────

/**
 * getReducedVariants — returns flat fade-only variants when the user
 * has enabled "prefers-reduced-motion" on their OS.
 *
 * Usage:
 *   const shouldReduce = useReducedMotion();
 *   const variants = getReducedVariants(shouldReduce, pageVariants);
 */
export function getReducedVariants(
  shouldReduce: boolean | null,
  variants: Variants,
): Variants {
  if (!shouldReduce) return variants;
  // Collapse all motion to a simple fade — no y, x, or scale
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };
}
