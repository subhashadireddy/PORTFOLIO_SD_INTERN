import { gsap, ScrollTrigger } from './gsapConfig';

const DEFAULT_EASE = 'power3.out';
const EDITORIAL_DURATION = 0.85;

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reusable scroll reveal wrapper that creates a ScrollTrigger and returns a cleanup function
 */
function createScrollAnimation(target, animationVars, triggerVars = {}) {
  if (!target || prefersReducedMotion()) {
    if (target) {
      gsap.set(target, { opacity: 1, x: 0, y: 0, scale: 1 });
    }
    return () => {};
  }

  const trigger = ScrollTrigger.create({
    trigger: triggerVars.trigger || target,
    start: triggerVars.start || 'top 88%',
    end: triggerVars.end,
    toggleActions: triggerVars.toggleActions || 'play none none reverse',
    once: triggerVars.once ?? false,
    ...triggerVars,
    animation: gsap.from(target, {
      duration: EDITORIAL_DURATION,
      ease: DEFAULT_EASE,
      ...animationVars
    })
  });

  return () => {
    if (trigger) trigger.kill();
  };
}

/**
 * Fade Up: Opacity 0 -> 1, translateY 28px -> 0
 */
export function animFadeUp(target, options = {}) {
  const { delay = 0, distance = 28, triggerOptions = {}, ...rest } = options;
  return createScrollAnimation(
    target,
    {
      opacity: 0,
      y: distance,
      delay,
      ...rest
    },
    triggerOptions
  );
}

/**
 * Fade In: Simple subtle opacity reveal
 */
export function animFadeIn(target, options = {}) {
  const { delay = 0, triggerOptions = {}, ...rest } = options;
  return createScrollAnimation(
    target,
    {
      opacity: 0,
      delay,
      ...rest
    },
    triggerOptions
  );
}

/**
 * Slide Left: From right to left (positive X to 0)
 */
export function animSlideLeft(target, options = {}) {
  const { delay = 0, distance = 36, triggerOptions = {}, ...rest } = options;
  return createScrollAnimation(
    target,
    {
      opacity: 0,
      x: distance,
      delay,
      ...rest
    },
    triggerOptions
  );
}

/**
 * Slide Right: From left to right (negative X to 0)
 */
export function animSlideRight(target, options = {}) {
  const { delay = 0, distance = 36, triggerOptions = {}, ...rest } = options;
  return createScrollAnimation(
    target,
    {
      opacity: 0,
      x: -distance,
      delay,
      ...rest
    },
    triggerOptions
  );
}

/**
 * Scale In: Scale 0.96 -> 1 with opacity
 */
export function animScaleIn(target, options = {}) {
  const { delay = 0, fromScale = 0.96, triggerOptions = {}, ...rest } = options;
  return createScrollAnimation(
    target,
    {
      opacity: 0,
      scale: fromScale,
      delay,
      ...rest
    },
    triggerOptions
  );
}

/**
 * Line Draw: ScaleX 0 -> 1 for horizontal lines or scaleY for vertical
 */
export function animLineDraw(target, options = {}) {
  const { direction = 'horizontal', delay = 0, triggerOptions = {}, ...rest } = options;
  if (!target || prefersReducedMotion()) {
    if (target) gsap.set(target, { scaleX: 1, scaleY: 1 });
    return () => {};
  }

  const isHoriz = direction === 'horizontal';
  gsap.set(target, {
    transformOrigin: isHoriz ? 'left center' : 'top center',
    [isHoriz ? 'scaleX' : 'scaleY']: 0
  });

  const trigger = ScrollTrigger.create({
    trigger: triggerOptions.trigger || target,
    start: triggerOptions.start || 'top 90%',
    toggleActions: triggerOptions.toggleActions || 'play none none reverse',
    ...triggerOptions,
    animation: gsap.to(target, {
      [isHoriz ? 'scaleX' : 'scaleY']: 1,
      duration: EDITORIAL_DURATION * 1.2,
      ease: DEFAULT_EASE,
      delay,
      ...rest
    })
  });

  return () => trigger && trigger.kill();
}

/**
 * Stagger Reveal: Animates a collection of sibling elements
 */
export function animStaggerReveal(targets, options = {}) {
  if (!targets || prefersReducedMotion()) {
    if (targets) gsap.set(targets, { opacity: 1, y: 0 });
    return () => {};
  }

  const {
    stagger = 0.08,
    distance = 24,
    triggerOptions = {},
    delay = 0,
    ...rest
  } = options;

  const trigger = ScrollTrigger.create({
    trigger: triggerOptions.trigger || targets[0],
    start: triggerOptions.start || 'top 85%',
    toggleActions: triggerOptions.toggleActions || 'play none none reverse',
    ...triggerOptions,
    animation: gsap.from(targets, {
      opacity: 0,
      y: distance,
      duration: EDITORIAL_DURATION,
      ease: DEFAULT_EASE,
      stagger,
      delay,
      ...rest
    })
  });

  return () => trigger && trigger.kill();
}
