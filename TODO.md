# TODO

## Root cause fix: React Router “Maximum update depth exceeded”
- [ ] Refactor `frontend/src/App.jsx` routing to avoid nested `<Routes>`/ambiguous matching and redirect loops.
- [ ] Ensure `/app/*` routes are handled explicitly at top-level and nested `Routes` are removed or replaced with `Outlet`.
- [ ] Ensure catch-all redirects do not bounce between `/login` and `/app/*`.
- [ ] Run frontend dev server / quick sanity check in browser console.

