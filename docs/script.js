function runExample(type) {
    const output = document.getElementById('output');
    const timestamp = new Date().toLocaleTimeString();
    
    let message = '';
    let details = '';
    
    switch(type) {
        case 'search':
            message = '🔍 Search Modal loaded!';
            details = 'Shortcuts active: Cmd+K (open search), Esc (close search)';
            break;
        case 'palette':
            message = '⌨️ Command Palette loaded!';
            details = 'Shortcuts active: Cmd+Shift+P (open palette), Esc (close palette), Cmd+Shift+N (new file), Cmd+Shift+O (open file), Cmd+Shift+S (save as)';
            break;
        case 'navigation':
            message = '🧭 Navigation Controls loaded!';
            details = 'Shortcuts active: Arrow keys (movement), Shift+Arrows (fast movement), Cmd+Arrows (jump to edges)';
            break;
        default:
            message = 'Example loaded successfully!';
            details = 'Check the console for more details';
    }
    
    output.innerHTML = `
        <div class="info-text">
            <p>Click "Load Example" to see shortcuts in action!</p>
            <p>Try these shortcuts on this page:</p>
            <ul>
                <li><kbd>Cmd+K</kbd> - Search</li>
                <li><kbd>Cmd+/</kbd> - Help</li>
                <li><kbd>Esc</kbd> - Close</li>
                <li><kbd>Cmd+Shift+P</kbd> - Command Palette</li>
            </ul>
        </div>
        <div class="example-status">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 10px;">[${timestamp}] ${message}</div>
            <div style="color: #6c757d; margin-bottom: 15px;">${details}</div>
            <div style="padding: 10px; background: #f8f9fa; border-radius: 4px; font-family: monospace; font-size: 12px; border-left: 3px solid #28a745;">
                Example loaded and ready to use!
            </div>
        </div>
        <div id="logs" class="logs-container">
            <!-- Live shortcut logs will appear here -->
        </div>
    `;
}

function copyInstall(event) {
    navigator.clipboard.writeText('npm install just-hotkeys').then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const btn = event.target;
        btn.textContent = 'Failed to copy';
        btn.style.background = '#dc3545';
        
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.style.background = '';
        }, 2000);
    });
}

// Helper function to add new logs at the top
function addLogAtTop(message, color = '#495057') {
    const logsContainer = document.getElementById('logs');
    if (!logsContainer) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const newLog = document.createElement('div');
    newLog.innerHTML = `[${timestamp}] ${message}`;
    newLog.style.color = color;
    newLog.style.marginBottom = '10px';
    newLog.style.borderBottom = '1px solid #e9ecef';
    newLog.style.paddingBottom = '10px';
    
    // Insert at the beginning of logs container
    logsContainer.insertBefore(newLog, logsContainer.firstChild);
}

// Prevent browser shortcuts from interfering with our demo
document.addEventListener('keydown', function(e) {
    // Prevent browser shortcuts that we want to handle
    if ((e.ctrlKey || e.metaKey) && ['s', 'n', 'o', 'w', 'r'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Our demo shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        addLogAtTop('🔍 Search shortcut triggered! (Ctrl/Cmd + K)', '#28a745');
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        addLogAtTop('❓ Help shortcut triggered! (Ctrl/Cmd + /)', '#17a2b8');
    }
    
    if (e.key === 'Escape') {
        addLogAtTop('🚪 Escape pressed - closing modals', '#dc3545');
    }
    
    if (e.key === 'p' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        addLogAtTop('⌨️ Command palette opened! (Ctrl+Shift+P)', '#6f42c1');
    }
    
    // Arrow key navigation demo
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            let modifier = '';
            if (e.shiftKey) modifier = 'Shift+';
            if (e.ctrlKey || e.metaKey) modifier = 'Cmd+';
            
            addLogAtTop(`🧭 ${modifier}${e.key} navigation triggered!`, '#fd7e14');
        }
    }
});
