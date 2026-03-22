export const styles = `
    body {
        padding: 10px;
        color: var(--vscode-foreground);
        font-family: var(--vscode-font-family);
    }

    /* Quick Actions Toolbar */
    .quick-actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        padding: 8px;
        background: var(--vscode-editor-background);
        border-radius: 4px;
        border: 1px solid var(--vscode-input-border);
    }

    .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        background: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
        border: 1px solid var(--vscode-button-border);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .action-button:hover {
        background: var(--vscode-button-secondaryHoverBackground);
        border-color: var(--vscode-focusBorder);
    }

    .action-button svg {
        width: 16px;
        height: 16px;
        opacity: 0.8;
    }

    .action-button:hover svg {
        opacity: 1;
    }

    /* Key Form */
    .key-form {
        display: none;
        margin-bottom: 16px;
    }

    .key-form.visible {
        display: block;
    }

    /* Compact Mode Styles */
    .compact-mode .category-section {
        margin-bottom: 4px;
    }

    .compact-mode .keys-table td {
        padding: 4px 8px;
    }

    .compact-mode .category-header {
        padding: 4px 8px;
    }

    /* Category Styling */
    .category-header {
        position: relative;
        overflow: hidden;
    }

    .category-color-bar {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
    }

    .category-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        opacity: 0.8;
    }

    /* Keyboard Shortcuts Panel */
    .keyboard-shortcuts {
        margin-top: 16px;
        padding: 12px;
        background: var(--vscode-textBlockQuote-background);
        border-radius: 4px;
        font-size: 12px;
    }

    .shortcut-item {
        display: flex;
        align-items: center;
        margin: 8px 0;
    }

    kbd {
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        padding: 2px 6px;
        border-radius: 3px;
        margin: 0 4px;
        font-family: var(--vscode-editor-font-family);
        font-size: 11px;
    }

    .shortcut-item span {
        margin-left: 12px;
        color: var(--vscode-descriptionForeground);
    }

    /* Context Menu */
    .context-menu {
        position: fixed;
        background: var(--vscode-menu-background);
        border: 1px solid var(--vscode-menu-border);
        border-radius: 4px;
        padding: 4px;
        min-width: 160px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 1000;
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        cursor: pointer;
        border-radius: 2px;
        color: var(--vscode-menu-foreground);
    }

    .context-menu-item:hover {
        background: var(--vscode-menu-selectionBackground);
        color: var(--vscode-menu-selectionForeground);
    }

    .context-menu-separator {
        height: 1px;
        background: var(--vscode-menu-separatorBackground);
        margin: 4px 0;
    }

    /* Editable Key Name */
    .key-name {
        padding: 2px 4px;
        border-radius: 2px;
        cursor: text;
    }

    .key-name:hover {
        background: var(--vscode-input-background);
    }

    .key-name.editing {
        background: var(--vscode-input-background);
        border: 1px solid var(--vscode-input-border);
        outline: none;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    /* Default to list view */
    .keys-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group {
        margin-bottom: 10px;
    }

    input, select {
        width: 100%;
        padding: 5px;
        margin-top: 5px;
        background: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border);
        border-radius: 2px;
    }

    select.category-select {
        width: auto;
        margin: 0;
        padding: 2px 4px;
    }

    button {
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 2px;
    }

    button:hover {
        background: var(--vscode-button-hoverBackground);
    }

    .search-bar {
        margin-bottom: 10px;
    }

    .keys-table {
        border-collapse: collapse;
        width: 100%;
    }

    .keys-table tr {
        border-bottom: 1px solid var(--vscode-input-border);
        cursor: move;
        user-select: none;
    }

    .keys-table tr.dragging {
        opacity: 0.5;
        background: var(--vscode-list-dropBackground);
    }

    .keys-table tr.drag-over {
        border-top: 2px solid var(--vscode-focusBorder);
    }

    .keys-table td {
        padding: 8px;
        vertical-align: middle;
    }

    .key-name {
        font-weight: 500;
    }

    .key-actions {
        display: flex;
        gap: 4px;
        justify-content: flex-end;
        align-items: center;
    }

    .icon-button {
        padding: 4px;
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0.8;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-button:hover {
        opacity: 1;
        background: var(--vscode-toolbar-hoverBackground);
    }

    .key-value {
        font-family: monospace;
        padding: 6px;
        background: var(--vscode-editor-background);
        border-radius: 2px;
        word-break: break-all;
        display: none;
        margin-top: 4px;
    }

    .key-value.visible {
        display: block;
    }

    .success-message {
        color: var(--vscode-notificationsSuccessIcon-foreground);
        margin: 10px 0;
        padding: 8px;
        display: none;
    }

    .sync-info {
        font-size: 0.9em;
        color: var(--vscode-descriptionForeground);
        padding: 8px;
        background: var(--vscode-textBlockQuote-background);
        border-radius: 2px;
    }

    .section {
        background: var(--vscode-editor-background);
        padding: 12px;
        border-radius: 4px;
    }

    .category-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background: var(--vscode-sideBarSectionHeader-background);
        cursor: move;
        user-select: none;
        border-radius: 4px;
        margin-bottom: 4px;
    }

    .category-header.dragging {
        opacity: 0.5;
        background: var(--vscode-list-dropBackground);
    }

    .category-header.drag-over {
        border-top: 2px solid var(--vscode-focusBorder);
    }

    .category-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .category-chevron {
        width: 16px;
        height: 16px;
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .category-chevron svg {
        fill: currentColor;
        width: 16px;
        height: 16px;
    }

    .category-wrapper {
        position: relative;
    }

    .category-header:hover {
        background: var(--vscode-list-hoverBackground);
    }

    .category-content {
        display: none;
        margin-left: 16px;
    }

    .category-content.expanded {
        display: block;
    }

    .category-actions {
        margin-top: 10px;
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .category-input {
        flex: 1;
    }

    .category-drop-zone {
        height: 4px;
        margin: 2px 0;
        transition: height 0.2s;
    }

    .category-drop-zone.drag-over {
        height: 20px;
        background: var(--vscode-list-dropBackground);
        border: 2px dashed var(--vscode-focusBorder);
        border-radius: 4px;
    }

    /* ── Notebook Access Toggle (Colab-style) ── */
    .toggle-cell {
        width: 42px;
        padding: 8px 4px 8px 8px !important;
        vertical-align: middle;
    }

    .notebook-toggle {
        position: relative;
        display: inline-flex;
        width: 34px;
        height: 18px;
        cursor: pointer;
        flex-shrink: 0;
        vertical-align: middle;
    }

    .notebook-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
    }

    .toggle-slider {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--vscode-input-border, #555);
        border-radius: 18px;
        transition: background 0.2s;
    }

    .toggle-slider::before {
        content: '';
        position: absolute;
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background: var(--vscode-editor-background, #fff);
        border-radius: 50%;
        transition: transform 0.2s;
    }

    .notebook-toggle input:checked + .toggle-slider {
        background: #1a73e8;
    }

    .notebook-toggle input:checked + .toggle-slider::before {
        transform: translateX(16px);
    }

    .notebook-toggle:hover .toggle-slider {
        filter: brightness(1.2);
    }

    /* ── Active Keys Status Badge ── */
    .notebook-status {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 10px;
        padding: 6px 10px;
        background: rgba(26, 115, 232, 0.12);
        border: 1px solid rgba(26, 115, 232, 0.4);
        border-radius: 4px;
        font-size: 12px;
    }

    .notebook-status-icon {
        font-size: 14px;
    }

    .notebook-status-text {
        flex: 1;
        color: var(--vscode-foreground);
    }

    .notebook-status-clear {
        background: transparent;
        color: var(--vscode-descriptionForeground);
        border: 1px solid var(--vscode-input-border);
        padding: 2px 6px;
        font-size: 11px;
        border-radius: 3px;
        cursor: pointer;
        flex-shrink: 0;
    }

    .notebook-status-clear:hover {
        background: var(--vscode-toolbar-hoverBackground);
        color: var(--vscode-foreground);
    }

    /* ── Python Snippet Panel ── */
    .python-snippet {
        margin-top: 12px;
        padding: 10px 12px;
        background: var(--vscode-textBlockQuote-background);
        border-left: 3px solid #1a73e8;
        border-radius: 0 4px 4px 0;
        font-size: 12px;
    }

    .python-snippet-label {
        color: var(--vscode-descriptionForeground);
        margin-bottom: 6px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .python-snippet-code {
        font-family: var(--vscode-editor-font-family, monospace);
        font-size: 12px;
        color: var(--vscode-editor-foreground);
        line-height: 1.6;
    }

    .py-kw { color: #569cd6; }
    .py-str { color: #ce9178; }

    /* ── Colab-style table header ── */
    .keys-table thead th {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--vscode-descriptionForeground);
        padding: 6px 8px 8px 8px;
        border-bottom: 1px solid var(--vscode-input-border);
        text-align: left;
    }

    .th-access { width: 110px; }
    .th-name   { }
    .th-actions { width: 90px; text-align: right; }

    /* ── Add new secret button (Colab style) ── */
    .add-secret-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
        padding: 7px 10px;
        width: 100%;
        background: transparent;
        color: #1a73e8;
        border: 1px dashed rgba(26, 115, 232, 0.5);
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;
        text-align: left;
        transition: background 0.15s, border-color 0.15s;
    }

    .add-secret-btn:hover {
        background: rgba(26, 115, 232, 0.08);
        border-color: #1a73e8;
        color: #1a73e8;
    }

    /* ── Inline add form ── */
    .add-form {
        margin-top: 6px;
        padding: 12px;
        background: var(--vscode-input-background);
        border: 1px solid var(--vscode-input-border);
        border-radius: 4px;
    }

    .form-row {
        margin-bottom: 8px;
    }

    .form-row input {
        width: 100%;
        box-sizing: border-box;
        margin-top: 0;
    }

    .form-actions {
        display: flex;
        gap: 8px;
        margin-top: 4px;
    }

    .btn-save {
        background: #1a73e8;
        color: #fff;
        border: none;
        padding: 5px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
    }

    .btn-save:hover { background: #1558b0; }

    .btn-cancel {
        background: transparent;
        color: var(--vscode-descriptionForeground);
        border: 1px solid var(--vscode-input-border);
        padding: 5px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
    }

    .btn-cancel:hover {
        background: var(--vscode-toolbar-hoverBackground);
        color: var(--vscode-foreground);
    }
`;
