// Test setup for Vitest
import { vi } from 'vitest';

// Mock browser APIs for tests
function createMockElement(tagName: string): HTMLElement {
  return {
    tagName: tagName.toUpperCase(),
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    focus: vi.fn(),
    blur: vi.fn(),
    tabIndex: 0,
    contentEditable: 'false',
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    hasAttribute: vi.fn(),
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    },
    style: {},
    innerHTML: '',
    textContent: '',
    children: [],
    parentNode: null,
    nextSibling: null,
    previousSibling: null,
    firstChild: null,
    lastChild: null,
    nodeType: 1,
    nodeName: tagName.toUpperCase(),
    nodeValue: null,
    ownerDocument: null,
    getRootNode: vi.fn(() => ({})),
    contains: vi.fn(() => false),
    compareDocumentPosition: vi.fn(() => 0),
    isEqualNode: vi.fn(() => false),
    lookupPrefix: vi.fn(() => null),
    lookupNamespaceURI: vi.fn(() => null),
    isDefaultNamespace: vi.fn(() => false),
    insertBefore: vi.fn(),
    replaceChild: vi.fn(),
    cloneNode: vi.fn(() => createMockElement(tagName)),
  } as unknown as HTMLElement;
}

const mockDocument: Document = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  createElement: vi.fn(createMockElement),
  getElementById: vi.fn(),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    createElement: vi.fn(createMockElement),
  } as unknown as HTMLBodyElement,
  documentElement: createMockElement('html'),
  head: createMockElement('head'),
  implementation: {
    createHTMLDocument: vi.fn(() => mockDocument),
  },
  createTextNode: vi.fn((text: string) => ({
    nodeType: 3,
    nodeValue: text,
    textContent: text,
  })),
  createDocumentFragment: vi.fn(() => ({ nodeType: 11, childNodes: [] })),
  createComment: vi.fn((text: string) => ({
    nodeType: 8,
    nodeValue: text,
    textContent: text,
  })),
  createRange: vi.fn(() => ({
    setStart: vi.fn(),
    setEnd: vi.fn(),
    commonAncestorContainer: createMockElement('div'),
    startContainer: createMockElement('div'),
    endContainer: createMockElement('div'),
    startOffset: 0,
    endOffset: 0,
  })),
  createEvent: vi.fn(() => ({
    initEvent: vi.fn(),
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: null,
    currentTarget: null,
    type: '',
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    timeStamp: Date.now(),
  })),
  defaultView: null,
  activeElement: null,
  hasFocus: vi.fn(() => false),
  readyState: 'complete',
  title: '',
  URL: 'http://localhost/',
  domain: 'localhost',
  referrer: '',
  lastModified: '',
  location: {
    href: 'http://localhost/',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
} as unknown as Document;

const mockWindow: Window = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  document: mockDocument,
  getComputedStyle: vi.fn(() => ({
    getPropertyValue: vi.fn(() => ''),
  })),
  matchMedia: vi.fn(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  requestAnimationFrame: vi.fn((cb: FrameRequestCallback) => {
    const id = Math.random();
    setTimeout(cb, 0);
    return id;
  }),
  cancelAnimationFrame: vi.fn(),
  setTimeout: vi.fn((cb: (...args: unknown[]) => void, delay: number) => {
    const id = Math.random();
    setTimeout(cb, delay);
    return id;
  }),
  clearTimeout: vi.fn(),
  setInterval: vi.fn((cb: (...args: unknown[]) => void, delay: number) => {
    const id = Math.random();
    setInterval(cb, delay);
    return id;
  }),
  clearInterval: vi.fn(),
  scrollTo: vi.fn(),
  scrollBy: vi.fn(),
  scrollX: 0,
  scrollY: 0,
  innerWidth: 1024,
  innerHeight: 768,
  outerWidth: 1024,
  outerHeight: 768,
  devicePixelRatio: 1,
  pageXOffset: 0,
  pageYOffset: 0,
  screenX: 0,
  screenY: 0,
  screenLeft: 0,
  screenTop: 0,
  history: {
    length: 1,
    scrollRestoration: 'auto',
    state: null,
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    pushState: vi.fn(),
    replaceState: vi.fn(),
  },
  location: mockDocument.location,
  navigator: {
    userAgent: 'vitest-test-environment',
    language: 'en-US',
    languages: ['en-US'],
    onLine: true,
    cookieEnabled: true,
    doNotTrack: null,
    maxTouchPoints: 0,
    hardwareConcurrency: 4,
    geolocation: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    },
  },
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  },
} as unknown as Window;

// Set up global mocks
Object.defineProperty(globalThis, 'document', {
  value: mockDocument,
  writable: true,
});

Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true,
});

// Mock console methods to reduce noise in tests
Object.defineProperty(globalThis, 'console', {
  value: {
    ...console,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  writable: true,
});

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock MutationObserver
globalThis.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}));
