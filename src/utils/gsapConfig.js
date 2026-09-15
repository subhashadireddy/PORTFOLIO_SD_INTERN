import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export const EDITORIAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export { gsap, ScrollTrigger, MotionPathPlugin };
