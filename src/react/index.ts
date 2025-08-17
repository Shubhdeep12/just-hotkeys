/**
 * React integration for declarative shortcuts
 *
 * @example
 * ```tsx
 * import { useShortcuts } from 'just-hotkeys/react';
 *
 * function App() {
 *   const [searchOpen, setSearchOpen] = useState(false);
 *
 *   useShortcuts({
 *     'cmd+k': () => setSearchOpen(true),
 *     'esc': () => setSearchOpen(false)
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */

import { useEffect, useRef, useMemo } from 'react';
import type { ShortcutMap, ShortcutOptions, ShortcutManager } from '../types';
import { createShortcuts } from '../manager';

/**
 * React hook for declarative keyboard shortcuts
 */
export function useShortcuts(
  shortcuts: ShortcutMap,
  options?: ShortcutOptions
): void {
  const managerRef = useRef<ShortcutManager | null>(null);

  // Memoize options to prevent unnecessary re-creation
  const memoizedOptions = useMemo(
    () => options,
    [
      options?.target,
      options?.preventDefault,
      options?.stopPropagation,
      options?.enableInInputs,
    ]
  );

  useEffect(() => {
    // Create shortcut manager
    managerRef.current = createShortcuts(shortcuts, memoizedOptions);

    // Cleanup on unmount or dependency change
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [shortcuts, memoizedOptions]);
}

/**
 * Advanced React hook with more control over shortcut lifecycle
 */
export function useShortcutManager(options?: ShortcutOptions) {
  const managerRef = useRef<ShortcutManager | null>(null);

  const memoizedOptions = useMemo(
    () => options,
    [
      options?.target,
      options?.preventDefault,
      options?.stopPropagation,
      options?.enableInInputs,
    ]
  );

  useEffect(() => {
    // Initialize empty manager
    managerRef.current = createShortcuts({}, memoizedOptions);

    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [memoizedOptions]);

  const addShortcuts = (shortcuts: ShortcutMap) => {
    managerRef.current?.add(shortcuts);
  };

  const removeShortcuts = (keys: string[]) => {
    managerRef.current?.remove(keys);
  };

  const getActiveShortcuts = (): string[] => {
    return managerRef.current?.getActiveShortcuts() || [];
  };

  return {
    addShortcuts,
    removeShortcuts,
    getActiveShortcuts,
  };
}

/**
 * Hook for conditional shortcuts
 */
export function useConditionalShortcuts(
  shortcuts: ShortcutMap,
  condition: boolean,
  options?: ShortcutOptions
): void {
  useShortcuts(condition ? shortcuts : {}, options);
}

/**
 * Hook for scoped shortcuts (only active when component is focused)
 */
export function useScopedShortcuts(
  shortcuts: ShortcutMap,
  targetRef: React.RefObject<HTMLElement>,
  options?: Omit<ShortcutOptions, 'target'>
): void {
  useShortcuts(shortcuts, {
    ...options,
    target: targetRef.current || undefined,
  });
}
