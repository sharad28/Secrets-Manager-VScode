# Change Log

## [1.0.9] - 2026-03-22
- Fixed: JavaScript syntax error in webview — escaped quotes `\'` inside template literal were being consumed by the template literal parser, producing invalid JS (`toggleKey('' + name + '')` instead of `toggleKey(\'' + name + '\')`)

## [1.0.8] - 2026-03-22
- **Fixed: ROOT CAUSE of blank panel** — `commands.ts` imported `./test/populate-demo-data` which is excluded from the VSIX by `.vscodeignore`. This caused `Cannot find module` on activation, crashing the entire extension before the webview provider was ever registered.

## [1.0.7] - 2026-03-22
- Fixed: Removed restrictive Content-Security-Policy that blocked VS Code webview runtime (working reference has no CSP)
- Fixed: Restructured activation to match working API Vault pattern — single try-catch, cleaner error handling
- Fixed: Logger falls back to console.log instead of throwing when uninitialized

## [1.0.6] - 2026-03-22
- Fixed: **Root cause of blank panel** — logger now falls back to console.log instead of throwing when uninitialized. Previously, if the log directory could not be created on first install, the logger threw an error that cascaded through storage initialization and caused the extension to bail out without ever registering the webview provider.

## [1.0.5] - 2026-03-22
- Fixed: Blank panel — restored visibility check before postMessage (matches working reference)
- Fixed: Blank panel — restored 1-second follow-up refresh so data always arrives even if first message was dropped
- Fixed: Bootstrap now uses window.load event so refreshKeys is sent only after webview is fully ready
- Added: "Loading secrets…" placeholder so panel never looks empty before data arrives

## [1.0.4] - 2026-03-22
- Fixed: Blank/black panel on dark themes — body and section now have hardcoded fallback background colors
- Fixed: Panel goes blank after hiding — added retainContextWhenHidden to keep webview alive
- Added: Refresh button (↻) in the info bar as a manual fallback if message passing stalls

## [1.0.3] - 2026-03-22
- Fixed: Extension host crash when logger.initialize() throws on startup
- Fixed: Webview stuck on "Loading" when storage.getKeys() fails before provider registration
- Fixed: Unhandled promise rejection in setTimeout refresh causing extension host to stop

## [1.0.2] - 2026-03-22
- Fixed: Webview not showing after reinstall
- Fixed: Cmd/Ctrl+F search focus not working in the panel
- Fixed: focusSearch message handler missing in webview

## [1.0.1]
- Updated logo/icon design

## [1.0.0]
- Initial release
