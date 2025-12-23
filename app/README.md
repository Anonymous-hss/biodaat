# Frontend App Directory

This directory will contain the static export of the Next.js frontend.

## Setup (during Level 4+)

1. Build the Next.js app with `next build && next export`
2. Copy the contents of the `out/` directory here
3. The static HTML/JS/CSS will be served directly by Apache

## Notes

- The frontend is a static React app (no SSR)
- Real-time preview works entirely client-side
- API calls go to `/biodaat/api/` endpoints
