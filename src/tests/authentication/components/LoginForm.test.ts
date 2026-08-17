import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '@/authentication/components/LoginForm.vue'
import { HttpError } from '@/shared/api/http-error'

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    const wrapper = mount(LoginForm)

    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows loading state when isLoading is true', () => {
    const wrapper = mount(LoginForm, { props: { isLoading: true } })
    const button = wrapper.find('button[type="submit"]')

    expect(button.text()).toBe('Signing in...')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('shows error message when error is provided', () => {
    const error = new HttpError('Request failed', 401, null, {
      message: 'Authentication failed.',
    })
    const wrapper = mount(LoginForm, { props: { error } })

    expect(wrapper.find('[role="alert"]').text()).toBe('Authentication failed.')
  })

  it('shows generic error message when error has no data message', () => {
    const error = new HttpError('Network Error', null, null, null)
    const wrapper = mount(LoginForm, { props: { error } })

    expect(wrapper.find('[role="alert"]').text()).toBe('Network Error')
  })
})
