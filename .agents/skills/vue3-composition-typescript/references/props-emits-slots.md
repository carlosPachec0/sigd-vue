# Props, Emits, defineModel, Slots, defineExpose

## Props

- Any named `interface Props` is a standalone-file declaration — never inline in the `.vue` file. Convention: `ComponentName.types.ts` next to `ComponentName.vue`.
- Inline anonymous object types passed directly to `defineProps<{ ... }>()` are acceptable only for a single trivial field with no reuse potential; anything named or reused becomes an `interface` in its own file.
- Optional props: mark with `?` and supply defaults via `withDefaults`, not `default:` runtime options.
- **Vue 3.5+ Reactive Props Destructure** is stable — destructuring `defineProps` keeps reactivity and lets defaults live inline:

```ts
const { foo = 'hello', bar } = defineProps<{ foo?: string; bar: string }>()
```

Use this in new code instead of `withDefaults` when the project targets Vue ≥3.5. Keep `withDefaults` for compatibility with <3.5 or when the team already uses it consistently.

```ts
// Component.types.ts
export interface Props {
  title: string
  count?: number
}
```

```vue
<!-- Component.vue -->
<script setup lang="ts">
import type { Props } from './Component.types'

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

- Never use `PropType<T>` casts (Options API idiom) inside `<script setup>`.
- Don't use the runtime `defineProps({ prop: String })` object form when TypeScript is available — it loses compile-time checking.

## Emits

Type emits as a call-signature object, not an array of strings:

```ts
const emit = defineEmits<{
  update: [value: number]
  'change-status': [status: 'idle' | 'loading' | 'error']
}>()
```

## defineModel (v-model)

Stable since Vue 3.4, refined in 3.5. Replaces the manual `props.modelValue` + `emit('update:modelValue')` pair — don't hand-roll that boilerplate when `defineModel` covers the case.

```ts
// Vue 3.5+: passing { required: true } removes `undefined` from the inferred type
const modelValue = defineModel<string>({ required: true })
// Ref<string>, not Ref<string | undefined>

// Named model with default
const open = defineModel<boolean>('open', { default: false })
```

## Slots

```ts
defineSlots<{
  default?: (props: { msg: string }) => any
  item?: (props: { id: number }) => any
}>()
```

## defineExpose

Only expose what the parent genuinely needs via template ref; keep the surface minimal.

```ts
defineExpose({
  focus: () => inputRef.value?.focus()
})
```