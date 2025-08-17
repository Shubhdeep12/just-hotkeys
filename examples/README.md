# just-hotkeys Examples

This folder contains practical examples demonstrating how to use the just-hotkeys library.

## Examples

### Basic Usage (`basic-usage.html`)
A vanilla JavaScript example showing:
- Basic hotkey registration
- Cross-platform shortcuts (Ctrl/Cmd)
- Event handling and logging
- Simple UI interactions

### React Usage (`react-usage.tsx`)
A React component example demonstrating:
- `useHotkey` hook for single shortcuts
- `useHotkeys` hook for multiple shortcuts
- Conditional shortcuts (enabled/disabled)
- Scoped shortcuts (context-aware)
- State management with shortcuts

## Running the Examples

### Vanilla JavaScript
1. Open `basic-usage.html` in a web browser
2. Try the keyboard shortcuts listed on the page
3. Watch the output log for events

### React
1. Ensure you have the library built (`pnpm run build`)
2. Import and use the component in your React app
3. Or run it standalone with a React development server

## Key Features Demonstrated

- **Cross-platform support**: Works on both Windows/Linux (Ctrl) and Mac (Cmd)
- **Event prevention**: Automatic prevention of default browser behavior
- **Cleanup**: Proper event listener management
- **Conditional logic**: Shortcuts that only work in certain contexts
- **Scoped shortcuts**: Shortcuts that only work when specific elements are focused

## Next Steps

After trying these examples:
1. Check the main [documentation](../docs/) for the full API reference
2. Explore the [source code](../src/) to understand the implementation
3. Try integrating shortcuts into your own projects
4. Check the [GitHub repository](https://github.com/shubhdeep12/just-hotkeys) for updates and issues
