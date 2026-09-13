import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'
import { describe, expect, test } from 'vitest'

describe('HomePage.vue', () => {
  test('renders pet information manager tabs', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toMatch('Add Pet')
    expect(wrapper.text()).toMatch('Pets')
  })
})
