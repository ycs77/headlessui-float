import '@testing-library/jest-dom'

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
vi.stubGlobal('ResizeObserver', ResizeObserverMock)
