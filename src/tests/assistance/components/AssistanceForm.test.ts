// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AssistanceForm from '@/assistance/components/AssistanceForm.vue'

describe('AssistanceForm', () => {
  it('renders date field', () => {
    const wrapper = mount(AssistanceForm)

    expect(wrapper.find('#date').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows custom submit label', () => {
    const wrapper = mount(AssistanceForm, {
      props: { submitLabel: 'Save Changes' },
    })

    expect(wrapper.find('button[type="submit"]').text()).toContain('Save Changes')
  })

  it('shows loading state on submit button', () => {
    const wrapper = mount(AssistanceForm, {
      props: { isLoading: true, submitLabel: 'Save' },
    })
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('populates date with initial value', () => {
    const wrapper = mount(AssistanceForm, {
      props: {
        initialValues: {
          id: '1',
          student_id: '1',
          date: '2026-08-20',
          created_at: '2026-08-20',
          updated_at: '2026-08-20',
        },
      },
    })

    expect(wrapper.find<HTMLInputElement>('#date').element.value).toBe('2026-08-20')
  })

  it('allows typing in date field', async () => {
    const wrapper = mount(AssistanceForm)

    await wrapper.find('#date').setValue('2026-08-21')

    expect(wrapper.find<HTMLInputElement>('#date').element.value).toBe('2026-08-21')
  })

  it('renders cancel button', () => {
    const wrapper = mount(AssistanceForm)

    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find((b) => b.text().includes('Cancel'))

    expect(cancelButton).toBeDefined()
  })

  it('shows error messages when errors prop is provided', () => {
    const wrapper = mount(AssistanceForm, {
      props: {
        errors: {
          date: ['The date field is required.'],
        },
      },
    })

    expect(wrapper.text()).toContain('The date field is required.')
  })
})