# 🚀 Declarative Shortcuts

A modern, declarative keyboard shortcut manager for JavaScript and TypeScript. Framework-agnostic with first-class React support.

## ✨ Features

- 🎯 **Declarative API** - Just map keys to functions
- 🔧 **Framework Agnostic** - Works everywhere (vanilla JS, React, Vue, etc.)
- ⚛️ **React Hooks** - `useShortcuts()` for React users
- 🖥️ **Cross-platform** - Handles Cmd/Ctrl automatically
- 📦 **TypeScript First** - Full type safety out of the box
- 🪶 **Lightweight** - Zero dependencies, tiny bundle size
- ♿ **Accessible** - Smart input handling and focus management

## 🔥 Why Declarative Shortcuts?

Most keyboard shortcut libraries require imperative setup:

```js
// 😰 The old way
hotkeys('cmd+k', event => {
  event.preventDefault();
  openSearch();
});

hotkeys('cmd+/', event => {
  event.preventDefault();
  toggleHelp();
});

hotkeys('esc', event => {
  event.preventDefault();
  closeModal();
});
```

**Declarative Shortcuts** lets you just declare what you want:

```js
// 🎉 The declarative way
createShortcuts({
  'cmd+k': openSearch,
  'cmd+/': toggleHelp,
  esc: closeModal,
});
```

No manual event handling, no repetitive code, just pure intent.

## 📦 Installation

```bash
npm install declarative-shortcuts
# or
yarn add declarative-shortcuts
# or
pnpm add declarative-shortcuts
```

## 🚀 Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { createShortcuts } from 'declarative-shortcuts';

// Create shortcuts
const cleanup = createShortcuts({
  'cmd+k': () => openSearch(),
  'cmd+/': () => toggleHelp(),
  esc: () => closeModal(),
  'ctrl+shift+p': () => openCommandPalette(),
});

// Cleanup when done
cleanup();
```

### React

```tsx
import { useShortcuts } from 'declarative-shortcuts/react';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useShortcuts({
    'cmd+k': () => setSearchOpen(true),
    'cmd+/': () => setHelpOpen(!helpOpen),
    esc: () => {
      setSearchOpen(false);
      setHelpOpen(false);
    },
  });

  return (
    <div>
      {searchOpen && <SearchModal />}
      {helpOpen && <HelpPanel />}
    </div>
  );
}
```

## 🎮 Supported Key Patterns

All combinations work intuitively:

```typescript
createShortcuts({
  // Single keys
  k: openSearch,
  esc: closeModal,
  enter: submit,

  // Modifier combinations
  'cmd+k': openSearch, // ⌘K on Mac, Ctrl+K on Windows/Linux
  'ctrl+k': forceCtrlK, // Ctrl+K on all platforms
  'alt+enter': newWindow, // Alt+Enter
  'shift+?': showHelp, // Shift+?

  // Multiple modifiers
  'cmd+shift+p': commandPalette,
  'ctrl+alt+delete': emergencyExit,

  // Function keys
  f1: help,
  f5: refresh,
  f11: fullscreen,

  // Arrow keys
  up: moveUp,
  down: moveDown,
  'ctrl+up': jumpToTop,

  // Special keys
  space: playPause,
  tab: nextField,
  backspace: goBack,
});
```

### Key Aliases

Use whatever feels natural:

```typescript
// These all work the same:
('cmd+k' === 'command+k') === 'meta+k';
('opt+k' === 'option+k') === 'alt+k';
'ctrl+k' === 'control+k';
'del' === 'delete';
'esc' === 'escape';
'space' === ' ';
```

## ⚙️ Configuration Options

```typescript
interface ShortcutOptions {
  target?: EventTarget; // Element to listen on (default: document)
  preventDefault?: boolean; // Prevent default behavior (default: true)
  stopPropagation?: boolean; // Stop event bubbling (default: false)
  enableInInputs?: boolean; // Work in input fields (default: false)
}

// Example with options
createShortcuts(
  {
    'cmd+k': openSearch,
  },
  {
    target: myElement,
    preventDefault: false,
    enableInInputs: true,
  }
);
```

## 🔧 Advanced Usage

### Dynamic Shortcut Management

```typescript
const manager = createShortcuts({
  'cmd+k': openSearch,
});

// Add more shortcuts later
manager.add({
  'cmd+/': toggleHelp,
  esc: closeModal,
});

// Remove specific shortcuts
manager.remove(['cmd+/', 'esc']);

// See what's active
console.log(manager.getActiveShortcuts()); // ['cmd+k']

// Cleanup everything
manager.destroy();
```

### React Advanced Hooks

```tsx
import {
  useShortcuts,
  useConditionalShortcuts,
  useScopedShortcuts,
  useShortcutManager,
} from 'declarative-shortcuts/react';

function AdvancedComponent() {
  const [mode, setMode] = useState('normal');
  const panelRef = useRef<HTMLDivElement>(null);

  // Basic shortcuts
  useShortcuts({
    'cmd+k': openSearch,
    esc: closeEverything,
  });

  // Conditional shortcuts (only when in edit mode)
  useConditionalShortcuts(
    {
      'cmd+s': save,
      'cmd+z': undo,
    },
    mode === 'edit'
  );

  // Scoped shortcuts (only when panel is focused)
  useScopedShortcuts(
    {
      j: moveDown,
      k: moveUp,
    },
    panelRef
  );

  // Full control
  const { addShortcuts, removeShortcuts } = useShortcutManager();

  useEffect(() => {
    if (mode === 'power-user') {
      addShortcuts({
        'g g': goToTop,
        'g i': goToInbox,
      });
    }
  }, [mode]);

  return <div ref={panelRef}>...</div>;
}
```

## 🎨 Real-World Examples

### Search Modal

```tsx
function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useShortcuts({
    'cmd+k': () => setOpen(true),
    esc: () => setOpen(false),
  });

  return open ? (
    <div className="modal">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  ) : null;
}
```

### Command Palette

```tsx
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const commands = [
    { key: 'cmd+n', label: 'New File', action: newFile },
    { key: 'cmd+o', label: 'Open File', action: openFile },
    { key: 'cmd+s', label: 'Save', action: save },
  ];

  useShortcuts({
    'cmd+shift+p': () => setOpen(true),
    esc: () => setOpen(false),
    // Register all command shortcuts
    ...commands.reduce(
      (acc, cmd) => ({
        ...acc,
        [cmd.key]: cmd.action,
      }),
      {}
    ),
  });

  return open ? (
    <div className="command-palette">
      {commands.map(cmd => (
        <div key={cmd.key} className="command">
          <span className="shortcut">{cmd.key}</span>
          <span className="label">{cmd.label}</span>
        </div>
      ))}
    </div>
  ) : null;
}
```

### Game Controls

```tsx
function GameComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useShortcuts({
    w: () => setPosition(p => ({ ...p, y: p.y - 1 })),
    s: () => setPosition(p => ({ ...p, y: p.y + 1 })),
    a: () => setPosition(p => ({ ...p, x: p.x - 1 })),
    d: () => setPosition(p => ({ ...p, x: p.x + 1 })),
    'shift+w': () => setPosition(p => ({ ...p, y: p.y - 5 })),
    space: () => jump(),
  });

  return <div style={{ left: position.x, top: position.y }}>Player</div>;
}
```

## 📚 API Reference

### Core Functions

#### `createShortcuts(shortcuts, options?)`

Creates a shortcut manager instance.

```typescript
function createShortcuts(
  shortcuts: ShortcutMap,
  options?: ShortcutOptions
): ShortcutManager;
```

**Parameters:**

- `shortcuts`: Object mapping shortcut strings to callback functions
- `options`: Optional configuration (see ShortcutOptions below)

**Returns:** ShortcutManager instance with methods for dynamic management

#### `shortcuts(shortcuts, options?)`

Simple utility for one-time shortcut creation with automatic cleanup.

```typescript
function shortcuts(
  shortcuts: ShortcutMap,
  options?: ShortcutOptions
): () => void;
```

**Returns:** Cleanup function to remove shortcuts

### React Hooks

#### `useShortcuts(shortcuts, options?)`

React hook for declarative shortcuts with automatic cleanup.

```typescript
function useShortcuts(shortcuts: ShortcutMap, options?: ShortcutOptions): void;
```

#### `useConditionalShortcuts(shortcuts, condition, options?)`

Hook for shortcuts that only activate under certain conditions.

```typescript
function useConditionalShortcuts(
  shortcuts: ShortcutMap,
  condition: boolean,
  options?: ShortcutOptions
): void;
```

#### `useScopedShortcuts(shortcuts, targetRef, options?)`

Hook for shortcuts scoped to a specific DOM element.

```typescript
function useScopedShortcuts(
  shortcuts: ShortcutMap,
  targetRef: React.RefObject<HTMLElement>,
  options?: Omit<ShortcutOptions, 'target'>
): void;
```

#### `useShortcutManager(options?)`

Hook for full control over shortcut lifecycle.

```typescript
function useShortcutManager(options?: ShortcutOptions): {
  addShortcuts: (shortcuts: ShortcutMap) => void;
  removeShortcuts: (keys: string[]) => void;
  getActiveShortcuts: () => string[];
};
```

### Types

#### `ShortcutMap`

```typescript
type ShortcutMap = Record<string, ShortcutCallback>;
```

#### `ShortcutCallback`

```typescript
type ShortcutCallback = (event: KeyboardEvent) => void;
```

#### `ShortcutOptions`

```typescript
interface ShortcutOptions {
  target?: EventTarget; // Element to listen on (default: document)
  preventDefault?: boolean; // Prevent default behavior (default: true)
  stopPropagation?: boolean; // Stop event bubbling (default: false)
  enableInInputs?: boolean; // Work in input fields (default: false)
}
```

#### `ShortcutManager`

```typescript
interface ShortcutManager {
  add: (shortcuts: ShortcutMap) => void;
  remove: (keys: string[]) => void;
  destroy: () => void;
  getActiveShortcuts: () => string[];
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for simpler keyboard shortcut management
- Built with modern web standards and TypeScript
- Thanks to all contributors and users

---

**Made with ❤️ for developers who just want their shortcuts to work.**
