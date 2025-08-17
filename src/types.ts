/**
 * Callback function type for keyboard shortcuts
 */
export type ShortcutCallback = (event: KeyboardEvent) => void;

/**
 * Object mapping keyboard shortcuts to callback functions
 */
export type ShortcutMap = Record<string, ShortcutCallback>;

/**
 * Configuration options for the shortcut manager
 */
export interface ShortcutOptions {
  /**
   * Element to attach event listeners to (default: document)
   */
  target?: EventTarget;

  /**
   * Whether to prevent default behavior (default: true)
   */
  preventDefault?: boolean;

  /**
   * Whether to stop event propagation (default: false)
   */
  stopPropagation?: boolean;

  /**
   * Whether shortcuts should work when typing in inputs/textareas (default: false)
   */
  enableInInputs?: boolean;
}

/**
 * Internal representation of a parsed keyboard shortcut
 */
export interface ParsedShortcut {
  key: string;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
}

/**
 * Return type for createShortcuts function
 */
export interface ShortcutManager {
  /**
   * Add new shortcuts
   */
  add: (shortcuts: ShortcutMap) => void;

  /**
   * Remove specific shortcuts
   */
  remove: (keys: string[]) => void;

  /**
   * Remove all shortcuts and cleanup
   */
  destroy: () => void;

  /**
   * Get all active shortcuts
   */
  getActiveShortcuts: () => string[];
}
