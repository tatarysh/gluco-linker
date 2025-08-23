import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Index from '~/pages/history/index.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Mock useInsulinHistory
vi.mock('~/composable/use-insulin-history', () => ({
  useInsulinHistory: () => ({
    insulinHistory: ref([
      {
        timestamp: Date.now(),
        insulinAmount: 10,
        notes: 'Test note 1',
      },
      {
        timestamp: Date.now() - 3600000, // 1 hour ago
        insulinAmount: 5,
        notes: 'Test note 2',
      },
    ]),
  }),
}))

// Mock useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
})

describe('History Page', () => {
  it('renders correctly', () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [vuetify],
        mocks: {
          $t: (key: string) => key,
        },
        stubs: {
          VDataTable: {
            props: ['headers', 'items'],
            template: `
              <table>
                <thead>
                  <tr>
                    <th v-for="header in headers" :key="header.key">{{ header.title }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td><slot name="item.insulinAmount" :item="item">{{ item.insulinAmount }}</slot></td>
                    <td><slot name="item.timestamp" :item="item">{{ new Date(item.timestamp).toLocaleString() }}</slot></td>
                    <td><slot name="item.notes" :item="item"><v-textarea :model-value="item.notes" /></slot></td>
                  </tr>
                </tbody>
              </table>
            `,
          },
          VTextarea: {
            props: ['modelValue'],
            template: `<textarea>{{ modelValue }}</textarea>`,
          },
        },
      },
    })
    expect(wrapper.text()).toContain('history:title')
    expect(wrapper.text()).toContain('insulin.dose')
    expect(wrapper.text()).toContain('history:time')
    expect(wrapper.text()).toContain('calculator:notes')
    expect(wrapper.text()).toContain('10.00 units')

    // Now, find the textarea and check its value
    const textareas = wrapper.findAll('textarea')
    expect(textareas.length).toBe(2)
    expect(textareas[0].element.value).toBe('Test note 1')
    expect(textareas[1].element.value).toBe('Test note 2')
  })
})
