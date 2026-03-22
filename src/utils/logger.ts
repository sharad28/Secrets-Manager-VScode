import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

class Logger {
    private logFile?: string;

    initialize(context: vscode.ExtensionContext) {
        // Use the extension's storage path
        const logsPath = path.join(context.globalStorageUri.fsPath, 'logs');
        if (!fs.existsSync(logsPath)) {
            fs.mkdirSync(logsPath, { recursive: true });
        }
        this.logFile = path.join(logsPath, 'api-vault.log');
        this.write('Logger initialized');
    }

    private write(message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} ${message}`;
        console.log(logMessage);
        if (this.logFile) {
            try { fs.appendFileSync(this.logFile, logMessage + '\n'); } catch {}
        }
    }

    public command(message: string) {
        this.write(`[Command] ${message}`);
    }

    public storage(message: string) {
        this.write(`[Storage] ${message}`);
    }

    public webview(message: string) {
        this.write(`[Webview] ${message}`);
    }

    public error(message: string, error?: Error) {
        if (error) {
            this.write(`[Error] ${message}: ${error.message}\n${error.stack}`);
        } else {
            this.write(`[Error] ${message}`);
        }
    }

    public getLogPath(): string {
        return this.logFile || '';
    }
}

export const logger = new Logger();
