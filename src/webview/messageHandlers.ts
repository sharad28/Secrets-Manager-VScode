export function createMessageHandlers(vscode: any, handlers: any, getRowHtml: any) {
    return {
        handleUpdateKeys(message: any) {
            // Update view state first
            if (message.viewState) {
                handlers.updateViewState(message.viewState);
            }

            // Clear loading message immediately
            const keysList = document.getElementById('keysList');
            if (keysList && keysList.innerHTML.includes('Loading keys...')) {
                keysList.innerHTML = '';
            }

            const totalKeys = message.keys.length;

            // Show/hide empty state
            const noKeysElement = document.getElementById('noKeys');
            const uncategorizedSection = document.getElementById('uncategorizedKeys');
            if (noKeysElement && uncategorizedSection) {
                if (totalKeys === 0) {
                    noKeysElement.style.display = 'block';
                    uncategorizedSection.style.display = 'none';
                } else {
                    noKeysElement.style.display = 'none';
                    uncategorizedSection.style.display = 'block';

                    // Render all keys in a flat list (no category grouping)
                    if (keysList) {
                        const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                        keysList.innerHTML = message.keys.map((key: any) => `
                            <tr draggable="true" data-key="${esc(key.name)}">
                                ${getRowHtml(key, [])}
                            </tr>
                        `).join('');
                    }
                }
            }

            // Setup drag handlers
            handlers.setupKeyDragHandlers();

            // Update status badge
            const notebookActive = message.keys.filter((k: any) => k.notebookAccess === true).length;
            const terminalActive = message.keys.filter((k: any) => k.terminalAccess === true).length;
            const badge = document.getElementById('notebookStatus');
            const badgeText = document.getElementById('notebookStatusText');
            if (badge && badgeText) {
                const parts = [];
                if (notebookActive > 0) { parts.push(notebookActive + ' in notebook'); }
                if (terminalActive > 0) { parts.push(terminalActive + ' in terminal'); }
                if (parts.length > 0) {
                    badge.style.display = 'flex';
                    badgeText.textContent = '🔑 ' + parts.join(' · ');
                } else {
                    badge.style.display = 'none';
                }
            }
            const activeCount = notebookActive;
            const activeKeys = message.keys.filter((k: any) => k.notebookAccess === true);

            // Update Python snippet panel
            const snippetDiv = document.getElementById('pythonSnippet');
            const snippetKeyName = document.getElementById('snippetKeyName');
            if (snippetDiv) {
                if (activeCount > 0) {
                    snippetDiv.style.display = 'block';
                    if (snippetKeyName) {
                        snippetKeyName.textContent = activeKeys[0].name;
                    }
                } else {
                    snippetDiv.style.display = 'none';
                }
            }
        },

        handleShowKey(message: any) {
            const valueDiv = document.getElementById('value-' + message.key);
            if (valueDiv) {
                valueDiv.textContent = message.value || 'No value found';
                valueDiv.classList.toggle('visible');
            }
        },

        handleKeyStored(message: any) {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.textContent = 'Key "' + message.key + '" stored!';
                successMessage.style.display = 'block';
                setTimeout(() => { successMessage.style.display = 'none'; }, 3000);
            }
            vscode.postMessage({ command: 'refreshKeys' });
        },

        handleDeleteSuccess() {
            vscode.postMessage({ command: 'refreshKeys' });
        },

        handleDeleteCancelled(_message: any) {},

        handleDeleteFailed(_message: any) {}
    };
}
