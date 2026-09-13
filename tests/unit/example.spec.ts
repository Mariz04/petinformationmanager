import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'
import { describe, expect, test } from 'vitest'

describe('HomePage.vue', () => {
  test('renders panel tabs and menu', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toMatch('PawPink')
    expect(wrapper.text()).toMatch('Add Pet')
    expect(wrapper.text()).toMatch('Welcome to PawPink')
  })
})
