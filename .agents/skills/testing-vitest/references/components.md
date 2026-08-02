# Component testing (SFCs)

Requires `@vue/test-utils` (installed as part of the skill's setup baseline — see main SKILL.md). Mount the component and interact with it the way a user would — do not reach into the component instance for internal state.

```ts
// Stepper.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Stepper from './Stepper.vue'

describe('Stepper', () => {
  it('increments up to max and stops', async () => {
    const wrapper = mount(Stepper, { props: { max: 1 } })

    expect(wrapper.find('[data-testid=value]').text()).toBe('0')

    await wrapper.find('[data-testid=increment]').trigger('click')
    expect(wrapper.find('[data-testid=value]').text()).toBe('1')

    await wrapper.find('[data-testid=increment]').trigger('click')
    expect(wrapper.find('[data-testid=value]').text()).toBe('1') // capped at max
  })
})
```

## What to assert

A component's public interface is: **props in, events/slots/rendered DOM out**. Test that surface.

| DO | DON'T |
|---|---|
| Assert rendered text/DOM based on props and slots | Assert `wrapper.vm.someInternalState` |
| Trigger real DOM events (`.trigger('click')`) and assert emitted events or DOM updates | Call internal methods directly (`wrapper.vm.someMethod()`) |
| Test the component as a black box (mount children for real) | Mock every child component by default |
| Use `data-testid` selectors over CSS classes, which are style-coupled | Rely exclusively on snapshot tests for correctness |

## Mocking dependencies

```ts
import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: { get: vi.fn(() => Promise.resolve({ data: 'mocked' })) },
}))
```

Use this for HTTP clients, API modules, and anything crossing the module boundary the test isn't meant to exercise (e.g. the Axios instance calling the SIGD Laravel API) — not for child components, which should render for real in a component test.

## Props, emits, slots

```ts
it('accepts an initial message via props', () => {
  const wrapper = mount(Greeting, { props: { message: 'hi' } })
  expect(wrapper.text()).toContain('hi')
})

it('emits update on click', async () => {
  const wrapper = mount(Greeting)
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('update')).toBeTruthy()
  expect(wrapper.emitted('update')?.[0]).toEqual(['new value'])
})
```

## Vitest vs a real browser runner

Vitest with `happy-dom`/`jsdom` simulates the DOM in Node — fast, but it does not catch real CSS rendering, native browser events, cookies, or `localStorage` quirks tied to an actual browser engine. If a component's behavior genuinely depends on real style computation or native events, that's a signal for Cypress Component Testing or Vitest Browser Mode — outside this skill's scope, flag it rather than force-fitting a `happy-dom` test.