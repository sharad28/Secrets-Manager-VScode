export function createHandlers(vscode: any) {
    let viewState = {
        mode: 'list',
        compact: false
    };
    let draggedKey: string | null = null;

    function updateViewState(newState: any) {
        viewState = { ...viewState, ...newState };
        requestAnimationFrame(() => {
            const container = document.querySelector('.container');
            if (container) {
                container.classList.remove('grid-view', 'list-view', 'compact-mode');
                container.classList.add(viewState.mode === 'grid' ? 'grid-view' : 'list-view');
                if (viewState.compact) {
                    container.classList.add('compact-mode');
                }
            }
        });
    }

    function showNewKeyForm() {
        const form = document.getElementById('keyForm');
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
            if (form.style.display === 'block') {
                (document.getElementById('keyName') as HTMLInputElement)?.focus();
            }
        }
    }

    function toggleCompactMode() {
        vscode.postMessage({ command: 'secrets-manager.toggleCompactMode' });
    }

    function storeKey() {
        const keyName = (document.getElementById('keyName') as HTMLInputElement).value.trim();
        const apiKey = (document.getElementById('apiKey') as HTMLInputElement).value.trim();
        if (keyName && apiKey) {
            vscode.postMessage({ command: 'storeKey', key: keyName, value: apiKey });
            (document.getElementById('keyName') as HTMLInputElement).value = '';
            (document.getElementById('apiKey') as HTMLInputElement).value = '';
            const form = document.getElementById('keyForm');
            if (form) { form.style.display = 'none'; }
        }
    }

    function filterKeys() {
        const searchTerm = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
        document.querySelectorAll('.keys-table tr').forEach(row => {
            const keyName = row.querySelector('.key-name')?.textContent?.toLowerCase();
            if (keyName) {
                (row as HTMLElement).style.display = keyName.includes(searchTerm) ? '' : 'none';
            }
        });
    }

    function toggleKey(key: string) {
        vscode.postMessage({ command: 'getKey', key });
    }

    function copyKey(key: string) {
        vscode.postMessage({ command: 'copyKey', key });
    }

    function deleteKey(key: string) {
        vscode.postMessage({ command: 'confirmDelete', key });
    }

    function toggleNotebookAccess(key: string, active: boolean) {
        vscode.postMessage({ command: 'toggleNotebookAccess', key, value: active ? 'true' : 'false' });
    }

    function toggleTerminalAccess(key: string, active: boolean) {
        vscode.postMessage({ command: 'toggleTerminalAccess', key, value: active ? 'true' : 'false' });
    }

    function clearAllNotebookAccess() {
        vscode.postMessage({ command: 'clearAllNotebookAccess' });
    }

    function setupKeyDragHandlers() {
        document.querySelectorAll('.keys-table tr[draggable="true"]').forEach(row => {
            row.addEventListener('dragstart', () => {
                draggedKey = (row as HTMLElement).dataset.key || null;
                row.classList.add('dragging');
            });
            row.addEventListener('dragend', () => {
                draggedKey = null;
                row.classList.remove('dragging');
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            });
            row.addEventListener('dragover', e => {
                e.preventDefault();
                if (draggedKey !== (row as HTMLElement).dataset.key) {
                    row.classList.add('drag-over');
                }
            });
            row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
            row.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedKey !== (row as HTMLElement).dataset.key) {
                    const tbody = row.closest('tbody');
                    if (tbody) {
                        const rows = Array.from(tbody.querySelectorAll('tr[draggable="true"]'));
                        const keys = rows.map(r => (r as HTMLElement).dataset.key).filter(Boolean);
                        const fromIndex = keys.indexOf(draggedKey as string);
                        const toIndex = keys.indexOf((row as HTMLElement).dataset.key as string);
                        if (fromIndex !== -1 && toIndex !== -1) {
                            keys.splice(fromIndex, 1);
                            keys.splice(toIndex, 0, draggedKey as string);
                            vscode.postMessage({ command: 'updateOrder', keys });
                        }
                    }
                }
                row.classList.remove('drag-over');
            });
        });
    }

    function handleKeyboardShortcuts(event: KeyboardEvent) {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }
        if (event.metaKey || event.ctrlKey) {
            if (event.shiftKey && event.code === 'KeyC') {
                event.preventDefault();
                toggleCompactMode();
            } else if (event.code === 'KeyF') {
                event.preventDefault();
                (document.getElementById('searchInput') as HTMLInputElement)?.focus();
            }
        }
    }

    // No-ops kept for compatibility (messageHandlers may call these)
    function updateCategorySelect() {}
    function setupCategoryDragHandlers() {}
    function setCategories(_cats: any[]) {}

    return {
        updateViewState,
        showNewKeyForm,
        toggleCompactMode,
        storeKey,
        filterKeys,
        toggleKey,
        copyKey,
        deleteKey,
        toggleNotebookAccess,
        toggleTerminalAccess,
        clearAllNotebookAccess,
        setupKeyDragHandlers,
        setupCategoryDragHandlers,
        handleKeyboardShortcuts,
        updateCategorySelect,
        setCategories
    };
}
