import { styles } from './styles';
import { getKeyRowHtml, getNotebookStatusHtml, getPythonSnippetHtml } from './components';
import { createHandlers } from './handlers';
import { createMessageHandlers } from './messageHandlers';

export function getWebviewContent(): string {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>Secrets Manager</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <div class="section">

            ${getNotebookStatusHtml()}

            <div class="sync-info">
                ℹ️ Stored in system keychain. Toggles inject/remove secrets instantly — no restart needed.
            </div>

            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Search keys..." oninput="filterKeys()" />
            </div>

            <div id="uncategorizedKeys">
                <table class="keys-table">
                    <thead>
                        <tr class="keys-table-header">
                            <th class="th-access">Notebook</th>
                            <th class="th-access">Terminal</th>
                            <th class="th-name">Name</th>
                            <th class="th-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="keysList"></tbody>
                </table>
            </div>

            <div id="noKeys" style="display: none; text-align: center; padding: 20px; color: var(--vscode-descriptionForeground);">
                No secrets yet. Click <strong>+ Add new secret</strong> below.
            </div>

            <div id="keyForm" class="add-form" style="display:none;">
                <div class="form-row">
                    <input type="text" id="keyName" placeholder="Secret name (e.g. OPENAI_API_KEY)" />
                </div>
                <div class="form-row">
                    <input type="password" id="apiKey" placeholder="Value" />
                </div>
                <div class="form-actions">
                    <button class="btn-save" onclick="storeKey()">Save</button>
                    <button class="btn-cancel" onclick="document.getElementById('keyForm').style.display='none'">Cancel</button>
                </div>
                <div id="successMessage" class="success-message"></div>
            </div>

            <button class="add-secret-btn" onclick="showNewKeyForm()">+ Add new secret</button>

            ${getPythonSnippetHtml()}
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const handlers = (${createHandlers.toString()})(vscode);
        const messageHandlers = (${createMessageHandlers.toString()})(vscode, handlers, ${getKeyRowHtml.toString()});

        // Initialize event listeners
        document.addEventListener('keydown', handlers.handleKeyboardShortcuts);

        // Request initial data load
        window.addEventListener('load', () => {
            console.log('[Webview] Requesting initial data load');
            vscode.postMessage({ command: 'refreshKeys' });
        });

        window.addEventListener('message', event => {
            const message = event.data;
            console.log('[Webview] Received message:', message.command);

            // Handle initial loading state
            const keysList = document.getElementById('keysList');
            if (keysList && keysList.innerHTML.includes('Loading keys...')) {
                if (message.command !== 'updateKeys') {
                    // Keep showing loading for non-update messages
                    return;
                }
            }

            switch (message.command) {
                case 'updateKeys':
                    messageHandlers.handleUpdateKeys(message);
                    break;

                case 'showKey':
                    messageHandlers.handleShowKey(message);
                    break;

                case 'keyStored':
                    messageHandlers.handleKeyStored(message);
                    break;

                case 'deleteSuccess':
                    messageHandlers.handleDeleteSuccess();
                    break;

                case 'deleteCancelled':
                    messageHandlers.handleDeleteCancelled(message);
                    break;

                case 'deleteFailed':
                    messageHandlers.handleDeleteFailed(message);
                    break;
            }
        });

        // Expose handlers to HTML
        window.showNewKeyForm = handlers.showNewKeyForm;
        window.toggleCompactMode = handlers.toggleCompactMode;
        window.storeKey = handlers.storeKey;
        window.filterKeys = handlers.filterKeys;
        window.toggleKey = handlers.toggleKey;
        window.copyKey = handlers.copyKey;
        window.deleteKey = handlers.deleteKey;
        window.toggleNotebookAccess = handlers.toggleNotebookAccess;
        window.toggleTerminalAccess = handlers.toggleTerminalAccess;
        window.clearAllNotebookAccess = handlers.clearAllNotebookAccess;
    </script>
</body>
</html>`;

    return htmlContent;
}
