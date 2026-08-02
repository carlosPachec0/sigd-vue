---
name: vue3-composition-typescript
description: Write, review, or refactor Vue 3 Single-File Components using the Composition API with TypeScript (`<script setup lang="ts">`). Use whenever the user works with Vue 3+, .vue files, composables, Pinia stores, or Vue Router in a TypeScript project, or asks for typed props/emits/models/slots, generic components, or composable extraction. Always assume TypeScript and Composition API unless the user explicitly requests the Options API or plain JavaScript — this project's stack defaults to Vue 3 + TS + Composition API. Trigger even if the user only says "Vue component" or ".vue file" without mentioning TypeScript.
compatibility: Vue >=3.4 for defineModel; Vue >=3.5 recommended for reactive props destructure, useTemplateRef, onWatcherCleanup, deep-1 watch, and generic components. TypeScript >=5.0. vue-router >=4 for routing guides (return-based guards; next-callback style is legacy). Current npm install resolves to v5, a no-breaking-changes transition release over v4. Requires vue-tsc for type-checking .vue files and the Volar (Vue Official) IDE extension.
metadata:
  author: sigd
  version: "1.0"
---

# Vue 3 Composition API + TypeScript

Reference for producing idiomatic, type-safe Vue 3 SFCs. Current stable line: Vue 3.5.x. Composition API with `<script setup>` is the default authoring style; Options API is legacy and only used on explicit request.

## Non-negotiable defaults

- `<script setup lang="ts">` — never Options API, never plain `<script>` without `lang="ts"`.
- `defineProps<T>()` with an inline type or an imported `interface`/`type` — never the runtime `defineProps({...})` object form when TypeScript is available.
- `<style scoped>` unless the user asks for CSS Modules or a scoping library.
- No `any`. If a type is genuinely unknown, use `unknown` and narrow it.
- Composables live in `composables/useX.ts`, return typed refs/computed, never return the internal `reactive()` object directly (loses reactivity on destructure).
- Every `interface` and `class` declaration lives in its own standalone file — never inline inside a `.vue` `<script setup>` block, and never bundled together with unrelated declarations in a shared `.ts` file. Convention: `ComponentName.types.ts` next to `ComponentName.vue`, imported with `import type { Props } from './ComponentName.types'`.
- Views are rendered through Vue Router (`<RouterView />` + route config with lazy-loaded `views/*.vue` components) — never through manual `v-if`-driven "current page" state.

## Where to look

Read the relevant reference file(s) before writing code — don't rely on memory for details covered here:

| Topic | File |
|---|---|
| Props, emits, `defineModel`, slots, `defineExpose` | `references/props-emits-slots.md` |
| `ref`/`reactive`, template refs, composables, `provide`/`inject`, watchers | `references/reactivity-composables.md` |
| Lifecycle hooks (`onMounted`, `onUnmounted`, `onErrorCaptured`, keep-alive, SSR, dev-only) | `references/lifecycle-hooks.md` |
| Vue Router — setup, `useRouter`/`useRoute`, guards, typed meta | `references/router.md` |
| Generic components (`generic="T extends ..."`) | `references/generics.md` |
| Pinia — install, Setup Stores, storeToRefs | `references/pinia.md` |
| `vue-tsc`, Volar, `tsconfig.json` | `references/tooling.md` |

Copy-ready scaffolds (use as starting point, don't retype from scratch):

| Scaffold | File |
|---|---|
| SFC component | `assets/Component.template.vue` |
| Component's Props interface (standalone file) | `assets/Component.template.types.ts` |
| Composable | `assets/composable.template.ts` |
| `tsconfig.json` block | `assets/tsconfig.snippet.json` |

## What NOT to do

- Don't mix Options API (`export default { data() {...} }`) into a `<script setup>` file.
- Don't use `defineProps({ prop: String })` runtime declarations when a TS type declaration is available — it loses compile-time checking.
- Don't manually type `emit('update:modelValue', ...)` boilerplate when `defineModel` applies.
- Don't cast with `as any` to silence a props/emit type error — fix the type or narrow it.
- Don't return a bare `reactive()` object from a composable or a Pinia store.
- Don't declare `interface Props`/`interface Emits`/any other interface or class inline in the same file that consumes it — extract it, even for a single-field type.