import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// GSAP is for scroll-linked scenes only, and only lazy-loaded modules may import this file,
// so GSAP never lands in the main bundle. Component animation uses `motion` instead.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
