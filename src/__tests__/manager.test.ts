import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createShortcuts } from '../manager';

/**
 * Type for global objects that might not exist in all environments
 */
interface GlobalWithDocument {
  document?: EventTarget;
  __originalDocument?: EventTarget;
}

describe('createShortcuts', () => {
  let manager: ReturnType<typeof createShortcuts>;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock functions
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();

    // Mock document for testing
    const mockDocument = {
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    };

    // Store original document and replace it
    (globalThis as GlobalWithDocument).__originalDocument = (globalThis as GlobalWithDocument).document;
    (globalThis as GlobalWithDocument).document = mockDocument as unknown  as EventTarget;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (manager) manager.destroy();
    
    // Restore original document
    (globalThis as GlobalWithDocument).document = (globalThis as GlobalWithDocument).__originalDocument;
  });

  it('should create shortcuts manager', () => {
    const mockCallback = vi.fn();
    manager = createShortcuts({
      'cmd+k': mockCallback,
    });

    expect(manager).toBeDefined();
    expect(manager.add).toBeDefined();
    expect(manager.remove).toBeDefined();
    expect(manager.destroy).toBeDefined();
    expect(manager.getActiveShortcuts).toBeDefined();
  });

  it('should add event listener on creation', () => {
    createShortcuts({ 'cmd+k': vi.fn() });
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });

  it('should remove event listener on destroy', () => {
    const manager = createShortcuts({ 'cmd+k': vi.fn() });
    manager.destroy();
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });

  it('should return active shortcuts', () => {
    const manager = createShortcuts({
      'cmd+k': vi.fn(),
      escape: vi.fn(),
    });

    const active = manager.getActiveShortcuts();
    expect(active).toContain('cmd+k');
    expect(active).toContain('escape');

    manager.destroy();
  });

  it('should add new shortcuts', () => {
    const manager = createShortcuts({ 'cmd+k': vi.fn() });
    
    manager.add({ 'cmd+/': vi.fn() });
    const active = manager.getActiveShortcuts();
    
    expect(active).toContain('cmd+k');
    expect(active).toContain('cmd+/');
    
    manager.destroy();
  });

  it('should remove specific shortcuts', () => {
    const manager = createShortcuts({
      'cmd+k': vi.fn(),
      'cmd+/': vi.fn(),
      escape: vi.fn(),
    });
    
    manager.remove(['cmd+k', 'escape']);
    const active = manager.getActiveShortcuts();
    
    expect(active).not.toContain('cmd+k');
    expect(active).not.toContain('escape');
    expect(active).toContain('cmd+/');
    
    manager.destroy();
  });

  it('should handle empty shortcuts object', () => {
    const manager = createShortcuts({});
    
    expect(manager.getActiveShortcuts()).toEqual([]);
    
    manager.destroy();
  });

  it('should handle options with custom target', () => {
    const customTarget = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as EventTarget;
    
    const manager = createShortcuts(
      { 'cmd+k': vi.fn() },
      { target: customTarget }
    );
    
    expect(customTarget.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    
    manager.destroy();
    expect(customTarget.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });
});
