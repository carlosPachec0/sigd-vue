import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StudentForm from '@/students/components/StudentForm.vue'

describe('StudentForm', () => {
  it('renders all form fields', () => {
    const wrapper = mount(StudentForm)

    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#gender').exists()).toBe(true)
    expect(wrapper.find('#birth-date').exists()).toBe(true)
    expect(wrapper.find('#height').exists()).toBe(true)
    expect(wrapper.find('#weight').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows custom submit label', () => {
    const wrapper = mount(StudentForm, {
      props: { submitLabel: 'Save Changes' },
    })

    expect(wrapper.find('button[type="submit"]').text()).toContain('Save Changes')
  })

  it('shows loading state on submit button', () => {
    const wrapper = mount(StudentForm, {
      props: { isLoading: true, submitLabel: 'Save' },
    })
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('defaults gender to Male', () => {
    const wrapper = mount(StudentForm)

    expect(wrapper.find('#gender').element.value).toBe('Male')
  })

  it('allows changing gender', async () => {
    const wrapper = mount(StudentForm)

    await wrapper.find('#gender').setValue('Female')

    expect(wrapper.find('#gender').element.value).toBe('Female')
  })

  it('populates fields with initial values', () => {
    const wrapper = mount(StudentForm, {
      props: {
        initialValues: {
          id: 1,
          academy_id: 1,
          name: 'Jane Doe',
          gender: 'Female',
          birth_date: '2012-08-20',
          height: 1.55,
          weight: 48,
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
      },
    })

    expect(wrapper.find('#name').element.value).toBe('Jane Doe')
    expect(wrapper.find('#gender').element.value).toBe('Female')
    expect(wrapper.find('#birth-date').element.value).toBe('2012-08-20')
    expect(wrapper.find('#height').element.value).toBe('1.55')
    expect(wrapper.find('#weight').element.value).toBe('48')
  })

  it('allows typing in all fields', async () => {
    const wrapper = mount(StudentForm)

    await wrapper.find('#name').setValue('John Doe')
    await wrapper.find('#gender').setValue('Male')
    await wrapper.find('#birth-date').setValue('2010-05-10')
    await wrapper.find('#height').setValue('1.65')
    await wrapper.find('#weight').setValue('55')

    expect(wrapper.find('#name').element.value).toBe('John Doe')
    expect(wrapper.find('#gender').element.value).toBe('Male')
    expect(wrapper.find('#birth-date').element.value).toBe('2010-05-10')
    expect(wrapper.find('#height').element.value).toBe('1.65')
    expect(wrapper.find('#weight').element.value).toBe('55')
  })

  it('shows error messages when errors prop is provided', () => {
    const wrapper = mount(StudentForm, {
      props: {
        errors: {
          name: ['The name field is required.'],
          gender: ['The gender field is required.'],
        },
      },
    })

    expect(wrapper.text()).toContain('The name field is required.')
    expect(wrapper.text()).toContain('The gender field is required.')
  })

  it('renders cancel button', () => {
    const wrapper = mount(StudentForm)

    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find((b) => b.text().includes('Cancel'))

    expect(cancelButton).toBeDefined()
  })
})
