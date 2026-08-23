import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AcademyForm from '@/academies/components/AcademyForm.vue'

describe('AcademyForm', () => {
  it('renders all form fields', () => {
    const wrapper = mount(AcademyForm)

    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#discipline').exists()).toBe(true)
    expect(wrapper.find('#registration-fee').exists()).toBe(true)
    expect(wrapper.find('#monthly-fee').exists()).toBe(true)
    expect(wrapper.find('#class-fee').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows custom submit label', () => {
    const wrapper = mount(AcademyForm, {
      props: { submitLabel: 'Save Changes' },
    })

    expect(wrapper.find('button[type="submit"]').text()).toContain('Save Changes')
  })

  it('shows loading state on submit button', () => {
    const wrapper = mount(AcademyForm, {
      props: { isLoading: true, submitLabel: 'Save' },
    })
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('populates fields with initial values', () => {
    const wrapper = mount(AcademyForm, {
      props: {
        initialValues: {
          name: 'Existing Club',
          discipline: 'Judo',
          registration_fee: 50,
          monthly_fee: 25,
          class_fee: 10,
        },
      },
    })

    expect(wrapper.find('#name').element.value).toBe('Existing Club')
    expect(wrapper.find('#discipline').element.value).toBe('Judo')
    expect(wrapper.find('#registration-fee').element.value).toBe('50')
    expect(wrapper.find('#monthly-fee').element.value).toBe('25')
    expect(wrapper.find('#class-fee').element.value).toBe('10')
  })

  it('allows typing in all fields', async () => {
    const wrapper = mount(AcademyForm)

    await wrapper.find('#name').setValue('New Academy')
    await wrapper.find('#discipline').setValue('Karate')
    await wrapper.find('#registration-fee').setValue('60')
    await wrapper.find('#monthly-fee').setValue('30')
    await wrapper.find('#class-fee').setValue('15')

    expect(wrapper.find('#name').element.value).toBe('New Academy')
    expect(wrapper.find('#discipline').element.value).toBe('Karate')
    expect(wrapper.find('#registration-fee').element.value).toBe('60')
    expect(wrapper.find('#monthly-fee').element.value).toBe('30')
    expect(wrapper.find('#class-fee').element.value).toBe('15')
  })

  it('shows error messages when errors prop is provided', () => {
    const wrapper = mount(AcademyForm, {
      props: {
        errors: {
          name: ['The name field is required.'],
          discipline: ['The discipline field is required.'],
        },
      },
    })

    expect(wrapper.text()).toContain('The name field is required.')
    expect(wrapper.text()).toContain('The discipline field is required.')
  })

  it('renders cancel button', () => {
    const wrapper = mount(AcademyForm)

    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find((b) => b.text().includes('Cancel'))

    expect(cancelButton).toBeDefined()
  })
})
