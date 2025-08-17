import type {
  ShortcutMap,
  ShortcutOptions,
  ShortcutManager,
  ParsedShortcut,
} from './types';
import { parseShortcut, matchesShortcut, normalizeShortcut } from './parser';

/**
 * Type for global objects that might not exist in all environments
 */
interface GlobalWithDocument {
  document?: EventTarget;
}

/**
 * Default options for shortcut manager
 */
const DEFAULT_OPTIONS: Required<ShortcutOptions> = {
  target: (globalThis as GlobalWithDocument).document || globalThis,
  preventDefault: true,
  stopPropagation: false,
  enableInInputs: false,
};

/**
 * Check if the current target is an input element
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || typeof (target as HTMLElement).tagName !== 'string')
    return false;

  const element = target as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.contentEditable === 'true'
  );
}

/**
 * Create a keyboard shortcut manager
 */
export function createShortcuts(
  shortcuts: ShortcutMap,
  options: ShortcutOptions = {}
): ShortcutManager {
  // Ensure target is evaluated at runtime
  const target =
    options.target || (globalThis as GlobalWithDocument).document || globalThis;
  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
    target,
  };
  const parsedShortcuts = new Map<
    string,
    { parsed: ParsedShortcut; callback: Function }
  >();

  // Parse initial shortcuts
  for (const [key, callback] of Object.entries(shortcuts)) {
    const normalizedKey = normalizeShortcut(key);
    parsedShortcuts.set(normalizedKey, {
      parsed: parseShortcut(key),
      callback,
    });
  }

  /**
   * Handle keyboard events
   */
  function handleKeyDown(event: KeyboardEvent): void {
    // Skip if typing in input elements (unless enabled)
    if (!config.enableInInputs && isInputElement(event.target)) {
      return;
    }

    // Find matching shortcut
    for (const [, { parsed, callback }] of parsedShortcuts) {
      if (matchesShortcut(event, parsed)) {
        if (config.preventDefault) {
          event.preventDefault();
        }

        if (config.stopPropagation) {
          event.stopPropagation();
        }

        callback(event);
        break; // Only execute the first match
      }
    }
  }

  // Add event listener
  config.target.addEventListener('keydown', handleKeyDown as EventListener);

  /**
   * Add new shortcuts
   */
  function add(newShortcuts: ShortcutMap): void {
    for (const [key, callback] of Object.entries(newShortcuts)) {
      const normalizedKey = normalizeShortcut(key);
      parsedShortcuts.set(normalizedKey, {
        parsed: parseShortcut(key),
        callback,
      });
    }
  }

  /**
   * Remove specific shortcuts
   */
  function remove(keys: string[]): void {
    for (const key of keys) {
      const normalizedKey = normalizeShortcut(key);
      parsedShortcuts.delete(normalizedKey);
    }
  }

  /**
   * Destroy the shortcut manager
   */
  function destroy(): void {
    config.target.removeEventListener(
      'keydown',
      handleKeyDown as EventListener
    );
    parsedShortcuts.clear();
  }

  /**
   * Get all active shortcuts
   */
  function getActiveShortcuts(): string[] {
    return Array.from(parsedShortcuts.keys());
  }

  return {
    add,
    remove,
    destroy,
    getActiveShortcuts,
  };
}

/**
 * Simple utility for one-time shortcut creation with cleanup
 */
export function shortcuts(
  shortcutMap: ShortcutMap,
  options?: ShortcutOptions
): () => void {
  const manager = createShortcuts(shortcutMap, options);
  return manager.destroy;
}
