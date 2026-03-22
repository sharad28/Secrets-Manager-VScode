import { styles } from './styles';

export function getWebviewContent(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secrets Manager</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    <div class="container">
        <div class="section">

            <div id="notebookStatus" class="notebook-status" style="display:none;">
                <span class="notebook-status-icon">&#x1F511;</span>
                <span id="notebookStatusText" class="notebook-status-text"></span>
                <button class="notebook-status-clear" onclick="clearAllNotebookAccess()" title="Deactivate all secrets from notebooks">Clear all</button>
            </div>

            <div class="sync-info" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <span>&#x2139;&#xFE0F; Stored in system keychain. Toggles inject/remove secrets instantly &mdash; no restart needed.</span>
                <button onclick="vscode.postMessage({command:'refreshKeys'})" title="Refresh" style="flex-shrink:0;padding:2px 8px;font-size:11px;background:transparent;border:1px solid var(--vscode-input-border,#555);color:var(--vscode-foreground,#ccc);border-radius:3px;cursor:pointer;">&#x21BB;</button>
            </div>

            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Search keys..." oninput="filterKeys()" />
            </div>

            <div id="uncategorizedKeys" style="display: none;">
                <table class="keys-table">
                    <thead>
                        <tr class="keys-table-header">
                            <th class="th-access">Notebook</th>
                            <th class="th-access">Terminal</th>
                            <th class="th-name">Name</th>
                            <th class="th-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="keysList"><tr><td colspan="4" style="padding:12px;color:var(--vscode-descriptionForeground,#858585);">Loading secrets…</td></tr></tbody>
                </table>
            </div>

            <div id="noKeys" style="text-align: center; padding: 20px; color: var(--vscode-descriptionForeground, #858585);">
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
                    <button class="btn-cancel" onclick="hideKeyForm()">Cancel</button>
                </div>
                <div id="successMessage" class="success-message"></div>
            </div>

            <button class="add-secret-btn" onclick="showNewKeyForm()">+ Add new secret</button>

            <div id="pythonSnippet" class="python-snippet" style="display:none;">
                <div class="python-snippet-label">Access in Python via:</div>
                <div class="python-snippet-code"><span class="py-kw">import</span> os<br>os.environ.get(<span class="py-str">'<span id="snippetKeyName">SECRET_NAME</span>'</span>)</div>
            </div>

        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        // ── Helpers ──────────────────────────────────────────────────────────
        function esc(s) {
            return String(s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        // ── UI actions ────────────────────────────────────────────────────────
        function showNewKeyForm() {
            var form = document.getElementById('keyForm');
            if (!form) { return; }
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
            if (form.style.display === 'block') {
                var kn = document.getElementById('keyName');
                if (kn) { kn.focus(); }
            }
        }

        function hideKeyForm() {
            var form = document.getElementById('keyForm');
            if (form) { form.style.display = 'none'; }
        }

        function storeKey() {
            var keyNameEl = document.getElementById('keyName');
            var apiKeyEl  = document.getElementById('apiKey');
            if (!keyNameEl || !apiKeyEl) { return; }
            var keyName = keyNameEl.value.trim();
            var apiKey  = apiKeyEl.value.trim();
            if (keyName && apiKey) {
                vscode.postMessage({ command: 'storeKey', key: keyName, value: apiKey });
                keyNameEl.value = '';
                apiKeyEl.value  = '';
                hideKeyForm();
            }
        }

        function filterKeys() {
            var searchEl = document.getElementById('searchInput');
            if (!searchEl) { return; }
            var term = searchEl.value.toLowerCase();
            document.querySelectorAll('.keys-table tr').forEach(function(row) {
                var nameEl = row.querySelector('.key-name');
                if (nameEl) {
                    row.style.display = nameEl.textContent.toLowerCase().includes(term) ? '' : 'none';
                }
            });
        }

        function toggleKey(key) {
            vscode.postMessage({ command: 'getKey', key: key });
        }

        function copyKey(key) {
            vscode.postMessage({ command: 'copyKey', key: key });
        }

        function deleteKey(key) {
            vscode.postMessage({ command: 'confirmDelete', key: key });
        }

        function toggleNotebookAccess(key, active) {
            vscode.postMessage({ command: 'toggleNotebookAccess', key: key, value: active ? 'true' : 'false' });
        }

        function toggleTerminalAccess(key, active) {
            vscode.postMessage({ command: 'toggleTerminalAccess', key: key, value: active ? 'true' : 'false' });
        }

        function clearAllNotebookAccess() {
            vscode.postMessage({ command: 'clearAllNotebookAccess' });
        }

        // ── Row rendering ─────────────────────────────────────────────────────
        var SHOW_ICON   = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 2c3.9 0 7 2.5 7 6s-3.1 6-7 6-7-2.5-7-6 3.1-6 7-6zm0 1C4.7 3 2 5.1 2 8s2.7 5 6 5 6-2.1 6-5-2.7-5-6-5zm0 2c1.4 0 2.5 1.1 2.5 2.5S9.4 10 8 10s-2.5-1.1-2.5-2.5S6.6 5 8 5zm0 1C7.2 6 6.5 6.7 6.5 7.5S7.2 9 8 9s1.5-.7 1.5-1.5S8.8 6 8 6z"/></svg>';
        var COPY_ICON   = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M4 4h3v1H4v8h8V9h1v4H3V4zm5-3h6v6h-1V2.5L7.5 9 7 8.5 13.5 2H9V1z"/></svg>';
        var DELETE_ICON = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/></svg>';

        function buildRow(key) {
            var safeName   = esc(key.name);
            var nbChecked  = key.notebookAccess  === true ? 'checked' : '';
            var trmChecked = key.terminalAccess  === true ? 'checked' : '';
            return '<td class="toggle-cell">' +
                '<label class="notebook-toggle" title="Notebook">' +
                '<input type="checkbox" ' + nbChecked + ' data-key="' + safeName + '" onchange="toggleNotebookAccess(this.dataset.key, this.checked)" />' +
                '<span class="toggle-slider"></span></label></td>' +

                '<td class="toggle-cell">' +
                '<label class="notebook-toggle" title="Terminal">' +
                '<input type="checkbox" ' + trmChecked + ' data-key="' + safeName + '" onchange="toggleTerminalAccess(this.dataset.key, this.checked)" />' +
                '<span class="toggle-slider"></span></label></td>' +

                '<td><div class="key-name">' + safeName + '</div>' +
                '<div id="value-' + safeName + '" class="key-value"></div></td>' +

                '<td class="key-actions">' +
                '<button class="icon-button" onclick="toggleKey(\\'' + safeName + '\\')" title="Show/Hide">' + SHOW_ICON + '</button>' +
                '<button class="icon-button" onclick="copyKey(\\'' + safeName + '\\')" title="Copy">' + COPY_ICON + '</button>' +
                '<button class="icon-button" onclick="deleteKey(\\'' + safeName + '\\')" title="Delete">' + DELETE_ICON + '</button>' +
                '</td>';
        }

        // ── Drag-and-drop ─────────────────────────────────────────────────────
        var draggedKey = null;

        function setupDragHandlers() {
            document.querySelectorAll('.keys-table tr[draggable="true"]').forEach(function(row) {
                row.addEventListener('dragstart', function() {
                    draggedKey = row.dataset.key || null;
                    row.classList.add('dragging');
                });
                row.addEventListener('dragend', function() {
                    draggedKey = null;
                    row.classList.remove('dragging');
                    document.querySelectorAll('.drag-over').forEach(function(el) { el.classList.remove('drag-over'); });
                });
                row.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    if (draggedKey !== row.dataset.key) { row.classList.add('drag-over'); }
                });
                row.addEventListener('dragleave', function() { row.classList.remove('drag-over'); });
                row.addEventListener('drop', function(e) {
                    e.preventDefault();
                    if (draggedKey !== row.dataset.key) {
                        var tbody = row.closest('tbody');
                        if (tbody) {
                            var rows = Array.from(tbody.querySelectorAll('tr[draggable="true"]'));
                            var keys = rows.map(function(r) { return r.dataset.key; }).filter(Boolean);
                            var from = keys.indexOf(draggedKey);
                            var to   = keys.indexOf(row.dataset.key);
                            if (from !== -1 && to !== -1) {
                                keys.splice(from, 1);
                                keys.splice(to, 0, draggedKey);
                                vscode.postMessage({ command: 'updateOrder', keys: keys });
                            }
                        }
                    }
                    row.classList.remove('drag-over');
                });
            });
        }

        // ── Message handling ──────────────────────────────────────────────────
        function handleUpdateKeys(message) {
            var keys       = message.keys       || [];
            var viewState  = message.viewState;

            // Apply view state
            if (viewState) {
                var container = document.querySelector('.container');
                if (container) {
                    container.classList.remove('grid-view', 'list-view', 'compact-mode');
                    container.classList.add(viewState.mode === 'grid' ? 'grid-view' : 'list-view');
                    if (viewState.compact) { container.classList.add('compact-mode'); }
                }
            }

            var noKeysEl   = document.getElementById('noKeys');
            var uncatEl    = document.getElementById('uncategorizedKeys');
            var keysList   = document.getElementById('keysList');

            if (keys.length === 0) {
                if (noKeysEl)  { noKeysEl.style.display  = 'block'; }
                if (uncatEl)   { uncatEl.style.display   = 'none';  }
            } else {
                if (noKeysEl)  { noKeysEl.style.display  = 'none';  }
                if (uncatEl)   { uncatEl.style.display   = 'block'; }
                if (keysList) {
                    keysList.innerHTML = keys.map(function(key) {
                        return '<tr draggable="true" data-key="' + esc(key.name) + '">' + buildRow(key) + '</tr>';
                    }).join('');
                }
            }

            setupDragHandlers();

            // Status badge
            var nbActive  = keys.filter(function(k) { return k.notebookAccess  === true; }).length;
            var trmActive = keys.filter(function(k) { return k.terminalAccess  === true; }).length;
            var badge     = document.getElementById('notebookStatus');
            var badgeText = document.getElementById('notebookStatusText');
            if (badge && badgeText) {
                var parts = [];
                if (nbActive  > 0) { parts.push(nbActive  + ' in notebook'); }
                if (trmActive > 0) { parts.push(trmActive + ' in terminal'); }
                if (parts.length > 0) {
                    badge.style.display   = 'flex';
                    badgeText.textContent = '\\uD83D\\uDD11 ' + parts.join(' \\u00B7 ');
                } else {
                    badge.style.display = 'none';
                }
            }

            // Python snippet
            var snippetDiv  = document.getElementById('pythonSnippet');
            var snippetName = document.getElementById('snippetKeyName');
            var activeNb    = keys.filter(function(k) { return k.notebookAccess === true; });
            if (snippetDiv) {
                if (activeNb.length > 0) {
                    snippetDiv.style.display = 'block';
                    if (snippetName) { snippetName.textContent = activeNb[0].name; }
                } else {
                    snippetDiv.style.display = 'none';
                }
            }
        }

        window.addEventListener('message', function(event) {
            var message = event.data;
            switch (message.command) {
                case 'updateKeys':
                    handleUpdateKeys(message);
                    break;
                case 'showKey':
                    var valueDiv = document.getElementById('value-' + message.key);
                    if (valueDiv) {
                        valueDiv.textContent = message.value || 'No value found';
                        valueDiv.classList.toggle('visible');
                    }
                    break;
                case 'keyStored':
                    vscode.postMessage({ command: 'refreshKeys' });
                    break;
                case 'deleteSuccess':
                    vscode.postMessage({ command: 'refreshKeys' });
                    break;
                case 'focusSearch':
                    var si = document.getElementById('searchInput');
                    if (si) { si.focus(); }
                    break;
            }
        });

        // ── Keyboard shortcuts ────────────────────────────────────────────────
        document.addEventListener('keydown', function(e) {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) { return; }
            if (e.metaKey || e.ctrlKey) {
                if (e.shiftKey && e.code === 'KeyC') {
                    e.preventDefault();
                    vscode.postMessage({ command: 'secrets-manager.toggleCompactMode' });
                } else if (e.code === 'KeyF') {
                    e.preventDefault();
                    var si = document.getElementById('searchInput');
                    if (si) { si.focus(); }
                }
            }
        });

        // ── Bootstrap — wait for full load before requesting data ─────────────
        window.addEventListener('load', function() {
            vscode.postMessage({ command: 'refreshKeys' });
        });
    </script>
</body>
</html>`;
}
