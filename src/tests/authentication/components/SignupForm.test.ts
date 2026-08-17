import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SignupForm from '@/authentication/components/SignupForm.vue'

describe('SignupForm', () => {
  it('renders all form fields', () => {
    const wrapper = mount(SignupForm)

    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('#password-confirmation').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows password validation error when passwords do not match', async () => {
    const wrapper = mount(SignupForm)

    await wrapper.find('#password').setValue('Password1!')
    await wrapper.find('#password-confirmation').setValue('DifferentPass1!')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Passwords do not match')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('shows password complexity error for weak password', async () => {
    const wrapper = mount(SignupForm)

    await wrapper.find('#password').setValue('weak')
    await wrapper.find('#password-confirmation').setValue('weak')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Password must be at least 8 characters')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
