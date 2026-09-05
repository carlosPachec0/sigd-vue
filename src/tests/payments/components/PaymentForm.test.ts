// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentForm from '@/payments/components/PaymentForm.vue'

describe('PaymentForm', () => {
  it('renders all form fields', () => {
    const wrapper = mount(PaymentForm)

    expect(wrapper.find('#subject').exists()).toBe(true)
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows custom submit label', () => {
    const wrapper = mount(PaymentForm, {
      props: { submitLabel: 'Save Changes' },
    })

    expect(wrapper.find('button[type="submit"]').text()).toContain('Save Changes')
  })

  it('shows loading state on submit button', () => {
    const wrapper = mount(PaymentForm, {
      props: { isLoading: true, submitLabel: 'Save' },
    })
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('populates fields with initial values', () => {
    const wrapper = mount(PaymentForm, {
      props: {
        initialValues: {
          id: '1',
          student_id: '1',
          subject: 'Monthly Fee',
          amount: '25.00',
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
      },
    })

    expect(wrapper.find<HTMLInputElement>('#subject').element.value).toBe('Monthly Fee')
    expect(wrapper.find<HTMLInputElement>('#amount').element.value).toBe('25.00')
  })

  it('allows typing in all fields', async () => {
    const wrapper = mount(PaymentForm)

    await wrapper.find('#subject').setValue('Class Fee')
    await wrapper.find('#amount').setValue('15')

    expect(wrapper.find<HTMLInputElement>('#subject').element.value).toBe('Class Fee')
    expect(wrapper.find<HTMLInputElement>('#amount').element.value).toBe('15')
  })

  it('shows error messages when errors prop is provided', () => {
    const wrapper = mount(PaymentForm, {
      props: {
        errors: {
          subject: ['The subject field is required.'],
          amount: ['The amount field is required.'],
        },
      },
    })

    expect(wrapper.text()).toContain('The subject field is required.')
    expect(wrapper.text()).toContain('The amount field is required.')
  })

  it('renders cancel button', () => {
    const wrapper = mount(PaymentForm)

    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find((b) => b.text().includes('Cancel'))

    expect(cancelButton).toBeDefined()
  })
})
