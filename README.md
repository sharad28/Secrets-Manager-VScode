# Secrets Manager

Manage API keys and secrets securely inside VS Code — stored in your system keychain, injected into Jupyter notebooks and terminals on demand.

## Features

### Secure storage
- Secrets are stored in your **system keychain** (Keychain Access on macOS, Credential Manager on Windows, libsecret on Linux)
- Never stored in plain text, never synced to the cloud
- Secret names are validated (`letters`, `numbers`, `_` only — must start with a letter or underscore)

### Jupyter notebook integration
- Toggle **Notebook** access per secret — injects into running kernels instantly via the Jupyter extension API
- An IPython startup watcher script (`~/.ipython/profile_default/startup/00_api_vault.py`) is also installed so secrets are available on every future kernel start without needing a toggle
- VS Code's `python.envFile` setting is updated to point to `~/.secrets_manager.env` for non-IPython Jupyter kernels
- If the running kernel can't be reached, a **"Restart Kernel"** notification appears with a one-click action

### Terminal integration
- Toggle **Terminal** access per secret — injects the value into all currently open integrated terminals instantly (no restart needed)
- New terminals opened later also get the value automatically via `environmentVariableCollection`
- Toggling OFF immediately runs `unset KEY` / `Remove-Item Env:KEY` in all open terminals

### UI
- Google Colab-style table: **Notebook** | **Terminal** | **Name** | **Actions**
- Show/hide secret value, copy to clipboard, delete with confirmation
- Search/filter secrets
- Drag-and-drop to reorder
- "+ Add new secret" button at the bottom

## Getting Started

1. Install the extension
2. Click the **Secrets Manager** icon in the Activity Bar
3. Click **+ Add new secret**, enter a name and value, click **Save**
4. Toggle **Notebook** to inject into Jupyter — toggle **Terminal** to inject into integrated terminals

## How secrets reach your code

| Destination | How | Restart needed? |
|---|---|---|
| Jupyter notebook (running) | Jupyter extension API executes `os.environ['KEY'] = 'VALUE'` directly in the kernel | No |
| Jupyter notebook (new kernel) | IPython startup script + `python.envFile` `.env` file | No |
| VS Code integrated terminal (open) | `export KEY=VALUE` sent to all open terminals | No |
| VS Code integrated terminal (new) | `environmentVariableCollection` | No |
| Plain Python script / external shell | Source `~/.secrets_manager_env.sh` (Mac/Linux) or `~/.secrets_manager_env.ps1` (Windows) | N/A |

## Files written to disk

| File | Purpose |
|---|---|
| `~/.ipython/profile_default/startup/00_api_vault.py` | IPython startup watcher — polls `~/.secrets_manager.env` every second and keeps `os.environ` in sync |
| `~/.secrets_manager.env` | Current active notebook secrets in `.env` format |
| `~/.secrets_manager_env.sh` / `.ps1` | Shell export file for manual sourcing |

All files are written with `chmod 600` (owner read/write only) on Mac/Linux.

## Commands

| Command | Description |
|---|---|
| `Secrets Manager: Store Key` | Add a new secret |
| `Secrets Manager: Get Key` | Retrieve and copy a secret |
| `Secrets Manager: List Keys` | Open the Secrets Manager panel |
| `Secrets Manager: Focus Search` | Focus the search input (`Ctrl/Cmd+F`) |

## Security

- Secrets are encrypted at rest in the OS keychain
- Input validation prevents injection attacks in secret names
- Webview uses a strict Content Security Policy
- Secret values are HTML-escaped before rendering
- All generated files are `chmod 600` on Mac/Linux

## Requirements

- VS Code 1.70+
- For Jupyter notebook injection: [Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) (`ms-toolsai.jupyter`)
- For IPython auto-watcher: IPython installed in your Python environment (`pip install ipython`)

## License

MIT

## Feedback & Issues

Found a bug or have a feature request? [Open an issue](https://github.com/sharad28/secrets-manager-vscode/issues)
