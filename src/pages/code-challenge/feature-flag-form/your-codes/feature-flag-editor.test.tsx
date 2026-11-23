// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import YourCode from './index'

// Monaco needs a real browser; render its value as plain text instead.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) => (
    <pre data-testid="preview">{value}</pre>
  ),
}))

afterEach(cleanup)

const flag = () =>
  JSON.parse(screen.getByTestId('preview').textContent).flags['my-new-feature']
const rules = () =>
  within(screen.getByRole('list', { name: 'Targeting rules' }))
    .getAllByRole('listitem')
    .filter((item) => item.parentElement?.tagName === 'OL')

describe('Feature flag editor', () => {
  it('shows the expected.json output for the initial state', async () => {
    render(<YourCode />)
    await waitFor(() =>
      expect(flag()).toEqual({
        variations: { on: true, off: false },
        targeting: [
          { query: "group == 'beta'", percentage: 50, variation: 'on' },
        ],
        defaultRule: { variation: 'off' },
      }),
    )
  })

  it('validates the flag name with an inline error', async () => {
    render(<YourCode />)
    const name = screen.getByLabelText('Flag name *')
    fireEvent.change(name, { target: { value: '' } })
    fireEvent.blur(name)

    expect(
      await screen.findByText('Flag name is required', {
        selector: '[role=alert]',
      }),
    ).toBeTruthy()
    expect(name.getAttribute('aria-invalid')).toBe('true')
  })

  it('updates description and status in the JSON', async () => {
    render(<YourCode />)
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Beta checkout' },
    })
    fireEvent.click(screen.getByRole('switch', { name: /status/i }))
    await waitFor(() =>
      expect(flag()).toMatchObject({
        disable: true,
        metadata: { description: 'Beta checkout' },
      }),
    )
  })

  it('builds a nested query from recursive groups in real time', async () => {
    render(<YourCode />)
    const rule = rules()[0]

    fireEvent.click(within(rule).getByRole('button', { name: 'Group' }))
    const attributes = within(rule).getAllByLabelText('Attribute')
    fireEvent.change(attributes[1], { target: { value: 'country' } })
    fireEvent.change(within(rule).getAllByLabelText('Value')[1], {
      target: { value: 'TH' },
    })

    const nested = attributes[1].closest('[data-depth="1"]') as HTMLElement
    fireEvent.click(within(nested).getByRole('button', { name: 'Condition' }))
    fireEvent.change(within(nested).getAllByLabelText('Attribute')[1], {
      target: { value: 'role' },
    })
    fireEvent.change(within(nested).getAllByLabelText('Value')[1], {
      target: { value: 'admin' },
    })

    await waitFor(() =>
      expect(flag().targeting[0].query).toBe(
        "group == 'beta' and (country == 'TH' or role == 'admin')",
      ),
    )
  })

  it('reveals errors on submit and reorders rules with the keyboard', async () => {
    render(<YourCode />)
    fireEvent.click(screen.getByRole('button', { name: 'Add rule' }))
    expect(rules()).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: /validate/i }))
    expect(
      await screen.findByText('Attribute is required', {
        selector: '[role=alert]',
      }),
    ).toBeTruthy()
    expect(screen.getByText(/issues? to fix/)).toBeTruthy()

    fireEvent.keyDown(
      within(rules()[1]).getByRole('button', { name: /^Rule 2: drag/ }),
      { key: 'ArrowUp' },
    )
    await waitFor(() =>
      expect(flag().targeting[1].query).toBe("group == 'beta'"),
    )
  })

  it('adds and removes variations, switching type keeps values typed', async () => {
    render(<YourCode />)
    fireEvent.click(screen.getByRole('button', { name: 'Add variation' }))
    await waitFor(() =>
      expect(Object.keys(flag().variations)).toEqual([
        'on',
        'off',
        'variation-3',
      ]),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remove variation 3' }))
    fireEvent.change(screen.getByLabelText('Variation type'), {
      target: { value: 'number' },
    })
    await waitFor(() => expect(flag().variations).toEqual({ on: 0, off: 1 }))
  })

  it('switches between Light and Dark themes and remembers the choice', async () => {
    window.localStorage.clear()
    const { container } = render(<YourCode />)
    const editor = container.querySelector('[data-theme-mode]') as HTMLElement
    expect(editor.dataset.themeMode).toBe('dark')
    expect(editor.classList.contains('dark')).toBe(true)

    fireEvent.click(screen.getByRole('radio', { name: 'Light' }))
    expect(editor.dataset.themeMode).toBe('light')
    expect(editor.classList.contains('ff-theme-light')).toBe(true)
    expect(editor.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('feature-flag-editor:theme')).toBe(
      'light',
    )

    // a new visit starts from the stored theme
    cleanup()
    const second = render(<YourCode />)
    await waitFor(() =>
      expect(
        (second.container.querySelector('[data-theme-mode]') as HTMLElement)
          .dataset.themeMode,
      ).toBe('light'),
    )
  })
})
