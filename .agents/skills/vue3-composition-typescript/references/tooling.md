# Tooling

- `vue-tsc` for type-checking `.vue` files in CI — regular `tsc` does not understand SFCs.
- Volar / "Vue - Official" IDE extension, not the deprecated Vetur.
- `tsconfig.json`: `"moduleResolution": "bundler"` for Vite-based projects; include `.vue` in `include`. See `assets/tsconfig.snippet.json` for a copy-ready block.
- Enable `strict: true`; do not weaken this to accommodate untyped legacy code — isolate legacy code instead (e.g. a separate `tsconfig` for a `legacy/` folder rather than relaxing the whole project).