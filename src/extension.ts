import * as vscode from 'vscode';
import { VSCodeStorageManager } from './storage';
import { SecretsManagerWebviewProvider } from './webview/provider';
import { registerCommands } from './commands';
import { logger } from './utils/logger';
import { updateTerminalEnv } from './jupyter/startupManager';

let provider: SecretsManagerWebviewProvider | undefined;

export async function activate(context: vscode.ExtensionContext) {
    // Initialize logger
    logger.initialize(context);
    logger.command('Secrets Manager extension is now active!');

    try {
        // Initialize storage manager
        const storage = await VSCodeStorageManager.create(context.secrets, context.globalState);

        // Initialize webview provider
        provider = new SecretsManagerWebviewProvider(context.extensionUri, storage, context);

        // Log initial state
        const keys = await storage.getKeys();
        const categories = await storage.getCategories();
        logger.command(`Initial state - Keys: ${keys.length}, Categories: ${categories.length}`);

        // Register webview provider
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider('secretsManagerView', provider)
        );

        // Register commands
        registerCommands(context, storage, provider);

        // Restore terminal env for any previously active secrets
        await updateTerminalEnv(context, storage);

        // Log initialization complete
        logger.command('Extension initialization complete');
    } catch (error) {
        logger.error('Failed to initialize extension', error as Error);
        vscode.window.showErrorMessage('Failed to initialize Secrets Manager extension');
    }
}

export function deactivate() {
    provider?.cleanup();
    provider = undefined;
}
