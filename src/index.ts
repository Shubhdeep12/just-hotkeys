/**
 * Declarative Shortcuts - A framework-agnostic keyboard shortcut manager
 *
 * @example
 * ```typescript
 * import { createShortcuts } from 'just-hotkeys';
 *
 * const cleanup = createShortcuts({
 *   'cmd+k': () => openSearch(),
 *   'cmd+/': () => toggleHelp(),
 *   'esc': () => closeModal()
 * });
 *
 * // Later...
 * cleanup();
 * ```
 */

// Core functionality
export { createShortcuts, shortcuts } from './manager';

// Types
export type {
  ShortcutCallback,
  ShortcutMap,
  ShortcutOptions,
  ShortcutManager,
  ParsedShortcut,
} from './types';

// Utilities
export { parseShortcut, matchesShortcut, normalizeShortcut } from './parser';
