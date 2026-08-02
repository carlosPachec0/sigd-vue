# Generic Components

For components whose prop/emit types depend on a caller-supplied type (select lists, tables, form fields), use the `generic` attribute on `<script setup>` — do not fall back to `any` or duplicate the component per type.

```vue
<script setup lang="ts" generic="T extends string | number">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

Multiple constrained generics and imported types are supported:

```vue
<script setup lang="ts" generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{ id: T; list: U[] }>()
</script>
```

The value of `generic` works exactly like the parameter list between `<...>` in TypeScript: multiple parameters, `extends` constraints, default types, and references to imported types are all valid.