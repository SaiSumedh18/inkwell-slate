# my-website

Next.js (App Router, `src/` dir) + TypeScript + Tailwind CSS + Framer Motion.

## Conventions
- Use Framer Motion for all animations: scroll-triggered fades, staggered reveals, and smooth hover transitions on interactive elements. Respect `prefers-reduced-motion`.
- Use the frontend-design skill for UI work: a real type scale, 8px spacing grid, and named color tokens (primary, neutral, accent) defined once in `src/app/globals.css`. No one-off hex codes, no generic AI aesthetic.
- Components pasted from 21st.dev should be adapted to the project's design tokens and given Framer Motion entrance animations.
- Mobile-first and fully responsive. Lazy-load images, use `next/font`, target Lighthouse 90+.
