import type { ParsedShortcut } from './types';

/**
 * Key mappings for consistent cross-browser support
 */
const KEY_MAPPINGS: Record<string, string> = {
  // Special keys
  space: ' ',
  enter: 'Enter',
  return: 'Enter',
  tab: 'Tab',
  esc: 'Escape',
  escape: 'Escape',
  backspace: 'Backspace',
  delete: 'Delete',
  del: 'Delete',

  // Arrow keys
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',

  // Function keys
  f1: 'F1',
  f2: 'F2',
  f3: 'F3',
  f4: 'F4',
  f5: 'F5',
  f6: 'F6',
  f7: 'F7',
  f8: 'F8',
  f9: 'F9',
  f10: 'F10',
  f11: 'F11',
  f12: 'F12',

  // Numbers
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
};

/**
 * Modifier key aliases
 */
const MODIFIER_ALIASES: Record<string, string> = {
  cmd: 'meta',
  command: 'meta',
  win: 'meta',
  windows: 'meta',
  option: 'alt',
  opt: 'alt',
  control: 'ctrl',
};

/**
 * Parse a keyboard shortcut string into its components
 */
export function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map(part => part.trim());

  const parsed: ParsedShortcut = {
    key: '',
    ctrl: false,
    meta: false,
    alt: false,
    shift: false,
  };

  for (const part of parts) {
    const normalizedPart = MODIFIER_ALIASES[part] || part;

    switch (normalizedPart) {
      case 'ctrl':
        parsed.ctrl = true;
        break;
      case 'meta':
        parsed.meta = true;
        break;
      case 'alt':
        parsed.alt = true;
        break;
      case 'shift':
        parsed.shift = true;
        break;
      default:
        // This is the main key
        parsed.key =
          KEY_MAPPINGS[normalizedPart] || normalizedPart.toUpperCase();
        break;
    }
  }

  return parsed;
}

/**
 * Check if a keyboard event matches a parsed shortcut
 */
export function matchesShortcut(
  event: KeyboardEvent,
  parsed: ParsedShortcut
): boolean {
  // Handle special case for Meta key (Cmd on Mac, Win on Windows)
  const metaPressed = event.metaKey;
  const ctrlPressed = event.ctrlKey;

  // Check modifiers
  if (parsed.meta !== metaPressed) return false;
  if (parsed.ctrl !== ctrlPressed) return false;
  if (parsed.alt !== event.altKey) return false;
  if (parsed.shift !== event.shiftKey) return false;

  // Check the main key
  const eventKey = event.key === ' ' ? ' ' : event.key;
  return (
    eventKey.toLowerCase() === parsed.key.toLowerCase() ||
    eventKey === parsed.key
  );
}

/**
 * Normalize shortcut string for consistent comparison
 */
export function normalizeShortcut(shortcut: string): string {
  const parsed = parseShortcut(shortcut);
  const parts: string[] = [];

  if (parsed.ctrl) parts.push('ctrl');
  if (parsed.meta) parts.push('cmd'); // Always use 'cmd' in normalized form
  if (parsed.alt) parts.push('alt');
  if (parsed.shift) parts.push('shift');

  parts.push(parsed.key.toLowerCase());

  return parts.join('+');
}
