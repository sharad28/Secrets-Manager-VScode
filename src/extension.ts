import * as vscode from 'vscode';
import { VSCodeStorageManager } from './storage';
import { SecretsManagerWebviewProvider } from './webview/provider';
import { registerCommands } from './commands';
import { logger } from './utils/logger';
import { updateTerminalEnv } from './jupyter/startupManager';

let provider: SecretsManagerWebviewProvider | undefined;

export async function activate(context: vscode.ExtensionContext) {
    // Initialize logger — failures must not block activation
    try {
        logger.initialize(context);
        logger.command('Secrets Manager extension is now active!');
    } catch { /* logger failure is non-fatal */ }

    try {
        // Initialize storage manager
        const storage = await VSCodeStorageManager.create(context.secrets, context.globalState);

        // Initialize webview provider
        provider = new SecretsManagerWebviewProvider(context.extensionUri, storage, context);

        // Register webview provider
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider('secretsManagerView', provider, {
                webviewOptions: { retainContextWhenHidden: true }
            })
        );

        // Register commands
        registerCommands(context, storage, provider);

        // Restore terminal env — failure here must not crash the extension
        try {
            await updateTerminalEnv(context, storage);
        } catch (error) {
            console.error('[Secrets Manager] Failed to restore terminal env:', error);
        }

        logger.command('Extension initialization complete');
    } catch (error) {
        console.error('[Secrets Manager] Activation failed:', error);
        vscode.window.showErrorMessage(`Secrets Manager: Failed to initialize — ${(error as Error).message}`);
    }
}

export function deactivate() {
    provider?.cleanup();
    provider = undefined;
}
