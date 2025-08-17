import { describe, it, expect } from 'vitest';
import { parseShortcut, matchesShortcut, normalizeShortcut } from '../parser';

describe('parseShortcut', () => {
  it('should parse simple keys', () => {
    expect(parseShortcut('k')).toEqual({
      key: 'K',
      ctrl: false,
      meta: false,
      alt: false,
      shift: false,
    });
  });

  it('should parse modifier combinations', () => {
    expect(parseShortcut('cmd+k')).toEqual({
      key: 'K',
      ctrl: false,
      meta: true,
      alt: false,
      shift: false,
    });
  });

  it('should parse multiple modifiers', () => {
    expect(parseShortcut('cmd+shift+k')).toEqual({
      key: 'K',
      ctrl: false,
      meta: true,
      alt: false,
      shift: true,
    });
  });

  it('should handle aliases', () => {
    expect(parseShortcut('command+k')).toEqual(parseShortcut('cmd+k'));
    expect(parseShortcut('option+k')).toEqual(parseShortcut('alt+k'));
    expect(parseShortcut('control+k')).toEqual(parseShortcut('ctrl+k'));
  });

  it('should handle special keys', () => {
    expect(parseShortcut('space')).toEqual({
      key: ' ',
      ctrl: false,
      meta: false,
      alt: false,
      shift: false,
    });

    expect(parseShortcut('esc')).toEqual({
      key: 'Escape',
      ctrl: false,
      meta: false,
      alt: false,
      shift: false,
    });
  });
});

describe('matchesShortcut', () => {
  it('should match simple keys', () => {
    const parsed = parseShortcut('k');
    const event = new KeyboardEvent('keydown', { key: 'k' });
    expect(matchesShortcut(event, parsed)).toBe(true);
  });

  it('should match modifier combinations', () => {
    const parsed = parseShortcut('cmd+k');
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    });
    expect(matchesShortcut(event, parsed)).toBe(true);
  });

  it('should not match wrong modifiers', () => {
    const parsed = parseShortcut('cmd+k');
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    expect(matchesShortcut(event, parsed)).toBe(false);
  });
});

describe('normalizeShortcut', () => {
  it('should normalize shortcut strings', () => {
    expect(normalizeShortcut('cmd+k')).toBe('cmd+k');
    expect(normalizeShortcut('command+k')).toBe('cmd+k');
    expect(normalizeShortcut('ctrl+shift+k')).toBe('ctrl+shift+k');
  });
});
