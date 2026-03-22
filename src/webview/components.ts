import { KeyData } from '../types';
import { chevronIcon, addIcon, compactIcon, categoryIcon, searchIcon, deleteIcon } from './icons';

export function getKeyRowHtml(key: KeyData, _categories: any[]) {
    // Icons are inlined so this function stays self-contained when serialized into the webview
    const _showHideIcon = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 2c3.9 0 7 2.5 7 6s-3.1 6-7 6-7-2.5-7-6 3.1-6 7-6zm0 1C4.7 3 2 5.1 2 8s2.7 5 6 5 6-2.1 6-5-2.7-5-6-5zm0 2c1.4 0 2.5 1.1 2.5 2.5S9.4 10 8 10s-2.5-1.1-2.5-2.5S6.6 5 8 5zm0 1C7.2 6 6.5 6.7 6.5 7.5S7.2 9 8 9s1.5-.7 1.5-1.5S8.8 6 8 6z"/></svg>';
    const _copyIcon = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M4 4h3v1H4v8h8V9h1v4H3V4zm5-3h6v6h-1V2.5L7.5 9 7 8.5 13.5 2H9V1z"/></svg>';
    const _deleteIcon = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/></svg>';
    // Escape key name for safe use in HTML attributes and content
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const safeName = esc(key.name);
    const notebookOn = key.notebookAccess === true;
    const terminalOn = key.terminalAccess === true;
    return `
    <td class="toggle-cell">
        <label class="notebook-toggle" title="Notebook: ${notebookOn ? 'ON' : 'OFF'}">
            <input type="checkbox" ${notebookOn ? 'checked' : ''}
                data-key="${safeName}"
                onchange="toggleNotebookAccess(this.dataset.key, this.checked)" />
            <span class="toggle-slider"></span>
        </label>
    </td>
    <td class="toggle-cell">
        <label class="notebook-toggle" title="Terminal: ${terminalOn ? 'ON' : 'OFF'}">
            <input type="checkbox" ${terminalOn ? 'checked' : ''}
                data-key="${safeName}"
                onchange="toggleTerminalAccess(this.dataset.key, this.checked)" />
            <span class="toggle-slider"></span>
        </label>
    </td>
    <td>
        <div class="key-name">${safeName}</div>
        <div id="value-${safeName}" class="key-value"></div>
    </td>
    <td class="key-actions">
        <button class="icon-button" data-key="${safeName}" onclick="toggleKey(this.dataset.key)" title="Show/Hide">
            ${_showHideIcon}
        </button>
        <button class="icon-button" data-key="${safeName}" onclick="copyKey(this.dataset.key)" title="Copy">
            ${_copyIcon}
        </button>
        <button class="icon-button" data-key="${safeName}" onclick="deleteKey(this.dataset.key)" title="Delete">
            ${_deleteIcon}
        </button>
    </td>
`;
}

export function getQuickActionsHtml() {
    return `
    <div class="quick-actions">
        <button class="action-button" onclick="showNewKeyForm()" title="Add New Key">
            ${addIcon}
        </button>
        <button class="action-button" onclick="toggleCompactMode()" title="Toggle Compact Mode (⌘/Ctrl+Shift+C)">
            ${compactIcon}
        </button>
        <button class="action-button" onclick="createCategory()" title="New Category (⌘/Ctrl+Shift+N)">
            ${categoryIcon}
        </button>
        <button class="action-button" onclick="document.getElementById('searchInput').focus()" title="Search (⌘/Ctrl+F)">
            ${searchIcon}
        </button>
    </div>
`;
}

export function getKeyFormHtml() {
    return `
    <div class="key-form" id="keyForm">
        <div class="form-group">
            <label>Key Name:</label>
            <input type="text" id="keyName" placeholder="e.g., OPENAI_API_KEY" />
        </div>
        <div class="form-group">
            <label>Value:</label>
            <input type="password" id="apiKey" placeholder="Enter your secret value" />
        </div>
        <button onclick="storeKey()">Store Key</button>
        <div id="successMessage" class="success-message"></div>
    </div>
`;
}

export function getCategoryHeaderHtml(name: string, expanded: boolean) {
    return `
    <div class="category-header" draggable="true">
        <div class="category-header-left" onclick="event.stopPropagation(); toggleCategory('${name}')">
            <span class="category-chevron" style="transform: ${expanded ? '' : 'rotate(-90deg)'}">
                ${chevronIcon}
            </span>
            <span class="category-name">${name}</span>
        </div>
        <button class="icon-button" onclick="event.stopPropagation(); deleteCategory('${name}')" title="Delete Category">
            ${deleteIcon}
        </button>
    </div>
`;
}

export function getNotebookStatusHtml() {
    return `
    <div id="notebookStatus" class="notebook-status" style="display:none;">
        <span class="notebook-status-icon">🔑</span>
        <span id="notebookStatusText" class="notebook-status-text"></span>
        <button class="notebook-status-clear" onclick="clearAllNotebookAccess()" title="Deactivate all secrets from notebooks">Clear all</button>
    </div>
`;
}

export function getPythonSnippetHtml() {
    return `
    <div id="pythonSnippet" class="python-snippet" style="display:none;">
        <div class="python-snippet-label">Access in Python via:</div>
        <div class="python-snippet-code"><span class="py-kw">import</span> os<br>os.environ.get(<span class="py-str">'<span id="snippetKeyName">SECRET_NAME</span>'</span>)</div>
    </div>
`;
}

export function getKeyboardShortcutsHtml() {
    return `
    <div class="keyboard-shortcuts">
        <div class="shortcut-item">
            <kbd>⌘/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
            <span>Toggle Compact Mode</span>
        </div>
        <div class="shortcut-item">
            <kbd>⌘/Ctrl</kbd> + <kbd>F</kbd>
            <span>Search Keys</span>
        </div>
    </div>
`;
}
