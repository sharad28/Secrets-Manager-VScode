import * as assert from 'assert';
import * as vscode from 'vscode';
import { MockStorageManager, MockMemento, MockSecretStorage, MockWebviewView } from './testUtils';
import { VSCodeStorageManager } from '../../storage';
import { SecretsManagerWebviewProvider } from '../../webview/provider';
import { getWebviewContent } from '../../webview/template';

suite('API Vault Extension Test Suite', () => {
    let storage: VSCodeStorageManager;
    let mockSecrets: MockSecretStorage;
    let mockGlobalState: MockMemento;

    setup(async () => {
        mockSecrets = new MockSecretStorage();
        mockGlobalState = new MockMemento();
        storage = await VSCodeStorageManager.create(mockSecrets, mockGlobalState);
    });

    test('Store and retrieve key', async () => {
        const key = 'TEST_KEY';
        const value = 'test-value';
        
        await storage.storeKey(key, value);
        const retrievedValue = await storage.getValue(key);
        
        assert.strictEqual(retrievedValue, value);
    });

    test('Create and delete category', async () => {
        const categoryName = 'Test Category';
        
        await storage.createCategory(categoryName);
        let categories = await storage.getCategories();
        assert.strictEqual(categories.length, 1);
        assert.strictEqual(categories[0].name, categoryName);
        assert.strictEqual(categories[0].expanded, true);
        assert.strictEqual(categories[0].order, 0);
        
        await storage.deleteCategory(categoryName);
        categories = await storage.getCategories();
        assert.strictEqual(categories.length, 0);
    });

    test('Update key category', async () => {
        const key = 'TEST_KEY';
        const value = 'test-value';
        const category = 'Test Category';
        
        await storage.storeKey(key, value);
        await storage.createCategory(category);
        await storage.updateKeyCategory(key, category);
        
        const keys = await storage.getKeys();
        assert.strictEqual(keys.length, 1);
        assert.strictEqual(keys[0].name, key);
        assert.strictEqual(keys[0].category, category);
    });

    test('Toggle category expansion', async () => {
        const category = 'Test Category';
        
        await storage.createCategory(category);
        let categories = await storage.getCategories();
        assert.strictEqual(categories[0].expanded, true);
        
        await storage.toggleCategory(category);
        categories = await storage.getCategories();
        assert.strictEqual(categories[0].expanded, false);
        
        await storage.toggleCategory(category);
        categories = await storage.getCategories();
        assert.strictEqual(categories[0].expanded, true);
    });

    test('Update category order', async () => {
        const categoryNames = ['Category 1', 'Category 2', 'Category 3'];
        
        // Create categories in original order
        for (const name of categoryNames) {
            await storage.createCategory(name);
        }
        
        // Verify initial order
        let categories = await storage.getCategories();
        assert.strictEqual(categories[0].name, 'Category 1');
        assert.strictEqual(categories[1].name, 'Category 2');
        assert.strictEqual(categories[2].name, 'Category 3');
        
        // Update order
        const newOrder = ['Category 3', 'Category 1', 'Category 2'];
        await storage.updateCategoryOrder(newOrder);
        
        // Verify new order
        categories = await storage.getCategories();
        assert.strictEqual(categories[0].name, 'Category 3');
        assert.strictEqual(categories[1].name, 'Category 1');
        assert.strictEqual(categories[2].name, 'Category 2');
    });

    test('Update key order within category', async () => {
        const category = 'Test Category';
        const keys = ['Key 1', 'Key 2', 'Key 3'];
        
        // Create category and keys
        await storage.createCategory(category);
        for (const key of keys) {
            await storage.storeKey(key, 'value', category);
        }
        
        // Update order
        const newOrder = ['Key 3', 'Key 1', 'Key 2'];
        await storage.updateKeyOrder(newOrder);
        
        // Verify new order
        const storedKeys = await storage.getKeys();
        const categoryKeys = storedKeys.filter(k => k.category === category);
        assert.strictEqual(categoryKeys[0].name, 'Key 3');
        assert.strictEqual(categoryKeys[1].name, 'Key 1');
        assert.strictEqual(categoryKeys[2].name, 'Key 2');
    });

    test('Move key between categories', async () => {
        const sourceCategory = 'Source Category';
        const targetCategory = 'Target Category';
        const key = 'TEST_KEY';
        
        // Setup categories and key
        await storage.createCategory(sourceCategory);
        await storage.createCategory(targetCategory);
        await storage.storeKey(key, 'value', sourceCategory);
        
        // Move key to target category
        await storage.updateKeyCategory(key, targetCategory);
        
        // Verify key moved
        const keys = await storage.getKeys();
        const movedKey = keys.find(k => k.name === key);
        assert.strictEqual(movedKey?.category, targetCategory);
    });

    test('Delete category removes category from keys', async () => {
        const key = 'TEST_KEY';
        const value = 'test-value';
        const category = 'Test Category';
        
        await storage.storeKey(key, value);
        await storage.createCategory(category);
        await storage.updateKeyCategory(key, category);
        
        let keys = await storage.getKeys();
        assert.strictEqual(keys[0].category, category);
        
        await storage.deleteCategory(category);
        keys = await storage.getKeys();
        assert.strictEqual(keys[0].category, undefined);
    });

    test('Category expansion state is preserved', async () => {
        // Create a category
        const category = 'Test Category';
        await storage.createCategory(category);

        // Verify initial expanded state
        let categories = await storage.getCategories();
        assert.strictEqual(categories[0].expanded, true);

        // Toggle category closed
        await storage.toggleCategory(category);
        categories = await storage.getCategories();
        assert.strictEqual(categories[0].expanded, false);

        // Verify state is preserved after refresh
        const refreshedCategories = await storage.getCategories();
        assert.strictEqual(refreshedCategories[0].expanded, false);

        // Toggle category open
        await storage.toggleCategory(category);
        categories = await storage.getCategories();
        assert.strictEqual(categories[0].expanded, true);
    });

    test('Store duplicate key updates existing key', async () => {
        const key = 'TEST_KEY';
        const value1 = 'test-value-1';
        const value2 = 'test-value-2';

        await storage.storeKey(key, value1);
        await storage.storeKey(key, value2);

        const keys = await storage.getKeys();
        assert.strictEqual(keys.length, 1);

        const retrievedValue = await storage.getValue(key);
        assert.strictEqual(retrievedValue, value2);
    });
});

suite('Webview Loading Test Suite', () => {
    let mockContext: vscode.ExtensionContext;

    setup(() => {
        mockContext = {
            secrets: new MockSecretStorage(),
            globalState: new MockMemento(),
            environmentVariableCollection: {
                clear: () => {},
                replace: () => {},
                append: () => {},
                prepend: () => {},
                get: () => undefined,
                forEach: () => {},
                delete: () => {},
                persistent: true,
                description: ''
            },
            extensionUri: vscode.Uri.file('/tmp/test-extension'),
            subscriptions: [],
        } as any;
    });

    test('getWebviewContent returns non-empty HTML document', () => {
        const html = getWebviewContent();
        assert.ok(html.length > 0, 'BLANK SCREEN: getWebviewContent() returned empty string');
        assert.ok(html.includes('<!DOCTYPE html>'), 'BLANK SCREEN: HTML is not a valid document');
    });

    test('getWebviewContent contains all required UI elements', () => {
        const html = getWebviewContent();
        const required: [string, string][] = [
            ['id="keysList"',    'keys list table body'],
            ['id="noKeys"',      '"No secrets yet" empty state'],
            ['id="searchInput"', 'search input field'],
            ['id="keyForm"',     'add-secret form'],
            ['acquireVsCodeApi', 'VS Code API bridge'],
        ];
        for (const [selector, label] of required) {
            assert.ok(
                html.includes(selector),
                `BLANK SCREEN: Missing "${label}" (${selector}) — webview will render empty`
            );
        }
    });

    test('getWebviewContent has Content-Security-Policy meta tag', () => {
        const html = getWebviewContent();
        assert.ok(
            html.includes('Content-Security-Policy'),
            'BLANK SCREEN: Missing CSP — scripts may be blocked, causing a blank panel'
        );
    });

    test('WebviewProvider sets HTML on resolveWebviewView', async () => {
        const mockSecrets = new MockSecretStorage();
        const mockGlobalState = new MockMemento();
        const storage = await VSCodeStorageManager.create(mockSecrets, mockGlobalState);

        const provider = new SecretsManagerWebviewProvider(
            mockContext.extensionUri,
            storage,
            mockContext
        );
        const mockView = new MockWebviewView();
        const cancelToken = {
            isCancellationRequested: false,
            onCancellationRequested: () => ({ dispose: () => {} }),
        } as vscode.CancellationToken;

        await provider.resolveWebviewView(mockView as any, {} as any, cancelToken);

        assert.ok(
            mockView.webview.html.length > 0,
            'BLANK SCREEN: resolveWebviewView() did not set webview.html — panel will be empty after install'
        );
        assert.ok(
            mockView.webview.html.includes('<!DOCTYPE html>'),
            'BLANK SCREEN: webview.html is not a valid HTML document'
        );
    });

    test('WebviewProvider shows error message instead of blank screen when template throws', async () => {
        const mockSecrets = new MockSecretStorage();
        const mockGlobalState = new MockMemento();
        const storage = await VSCodeStorageManager.create(mockSecrets, mockGlobalState);

        const provider = new SecretsManagerWebviewProvider(
            mockContext.extensionUri,
            storage,
            mockContext
        );
        const mockView = new MockWebviewView();
        const cancelToken = {
            isCancellationRequested: false,
            onCancellationRequested: () => ({ dispose: () => {} }),
        } as vscode.CancellationToken;

        // Simulate template failure by patching webview setter to throw once,
        // then capture the fallback error HTML that the provider must write
        let setCount = 0;
        const originalDescriptor = Object.getOwnPropertyDescriptor(mockView.webview, 'html');
        Object.defineProperty(mockView.webview, 'html', {
            get() { return this._html ?? ''; },
            set(value: string) {
                setCount++;
                if (setCount === 1) {
                    throw new Error('Simulated template render failure');
                }
                this._html = value;
            },
            configurable: true,
        });

        // resolveWebviewView must catch the error and write fallback HTML
        await provider.resolveWebviewView(mockView as any, {} as any, cancelToken);

        // Restore
        if (originalDescriptor) {
            Object.defineProperty(mockView.webview, 'html', originalDescriptor);
        }

        assert.ok(
            (mockView.webview as any)._html !== undefined && (mockView.webview as any)._html.length > 0,
            'BLANK SCREEN: When template rendering fails, provider must show an error message — not leave the panel blank'
        );
        assert.ok(
            (mockView.webview as any)._html.includes('failed to load'),
            'BLANK SCREEN: Error fallback HTML must tell the user the extension failed to load'
        );
    });

    test('WebviewProvider sets HTML even when storage.getKeys throws after init', async () => {
        const mockSecrets = new MockSecretStorage();
        const mockGlobalState = new MockMemento();
        const storage = await VSCodeStorageManager.create(mockSecrets, mockGlobalState);

        // Break getKeys to simulate a runtime storage failure
        (storage as any).getKeys = async () => { throw new Error('Storage unavailable'); };

        const provider = new SecretsManagerWebviewProvider(
            mockContext.extensionUri,
            storage,
            mockContext
        );
        const mockView = new MockWebviewView();
        const cancelToken = {
            isCancellationRequested: false,
            onCancellationRequested: () => ({ dispose: () => {} }),
        } as vscode.CancellationToken;

        // Should not throw, and HTML must still be set
        await provider.resolveWebviewView(mockView as any, {} as any, cancelToken);

        assert.ok(
            mockView.webview.html.length > 0,
            'BLANK SCREEN: webview.html was never set when storage.getKeys() failed — panel will be blank'
        );
    });
});
