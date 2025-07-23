/**
 * This module is inspired by https://github.com/Araxeus/custom-electron-prompt.
 */
const { BrowserWindow, ipcMain, screen } = require('electron');
const url = require('node:url');
const path = require('node:path');

async function electronPrompt(customOptions) {
    return new Promise(async (resolve, reject) => {
        // Create ID, used to ensure unique listeners per prompt window
        const id = `${Date.now()}-${Math.random()}`;

        // Default-Optionen
        const options = Object.assign(
            {
                alwaysOnTop: false,
                darkMode: false,
                frame: true,
                fullscreenable: true,
                height: 400,
                icon: null,
                maximizable: true,
                maxHeight: null,
                maxWidth: null,
                menuBarVisible: false,
                minHeight: 400,
                minWidth: 400,
                minimizable: true,
                parentWindow: BrowserWindow.getFocusedWindow(),
                resizable: true,
                skipTaskbar: true,
                title: 'Prompt Window Title',
                useContentSize: false,
                width: 400,
                x: null, // will not work with parentWindow
                y: null, // will not work with parentWindow

                customJavaScriptFiles: null, // Path array to custom JavaScript files to be loaded in the prompt window
                customCssFiles: null, // Path array to custom CSS files to be loaded in the prompt window
                data: {}, // Custom data to be passed to the prompt window
            },
            customOptions || {},
        );

        options.minWidth = customOptions?.minWidth || customOptions?.width || options.width;
        options.minHeight = customOptions?.minHeight || customOptions?.height || options.height;
        options.title = options.title.toUpperCase();

        // Get dark mode setting from parent window if available
        if (options.parentWindow) {
            try {
                options.darkMode = await options.parentWindow.webContents.executeJavaScript("document.documentElement.classList.contains('dark')");
            } catch (error) {
                console.error('Could not detect dark mode:', error);
                options.darkMode = false;
            }
        }

        // Set maxWidth and maxHeight based on parentWindow or primary display
        if (options.parentWindow) {
            // If options.parentWindow is used, this is the top padding of the inline Bruno prompt window. It is the height of the Bruno title bar. (Retina 2x size for Macbooks)
            const inlineBrunoWindowPadding = 56;

            options.maxWidth = options.maxWidth || options.parentWindow.getSize()[0];
            options.maxHeight = options.maxHeight || options.parentWindow.getSize()[1] - inlineBrunoWindowPadding;
        } else {
            const primaryDisplay = screen.getPrimaryDisplay();

            options.maxWidth = options.maxWidth || primaryDisplay.workArea.width;
            options.maxHeight = options.maxHeight || primaryDisplay.workArea.height;
        }

        // Create the prompt URL - path to the HTML file
        const promptUrl = url.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(__dirname, 'prompt.html'),
            hash: id,
        });

        // Creat BrowserWindow
        let promptWindow = new BrowserWindow({
            alwaysOnTop: options.alwaysOnTop,
            frame: options.frame,
            fullscreenable: options.fullscreenable,
            height: options.height,
            icon: options.icon,
            maxHeight: options.maxHeight,
            maxWidth: options.maxWidth,
            maximizable: options.maximizable,
            minHeight: options.minHeight,
            minWidth: options.minWidth,
            minimizable: options.minimizable,
            modal: !!options.parentWindow,
            parent: options.parentWindow,
            resizable: options.resizable,
            show: false,
            skipTaskbar: options.skipTaskbar,
            title: options.title.toUpperCase(),
            useContentSize: options.useContentSize,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            width: options.width,
            x: options.x,
            y: options.y,
        });

        promptWindow.setMenu(null);
        promptWindow.setMenuBarVisibility(options.menuBarVisible);

        // Cleanup-Funktion
        const cleanup = () => {
            ipcMain.removeListener(`response:${id}`, responseListener);
            ipcMain.removeListener(`get-data:${id}`, getDataListener);
            ipcMain.removeListener(`error:${id}`, errorListener);
            ipcMain.removeListener(`resize-window:${id}`, resizeWindowListener);
            options.parentWindow?.focus();
        };

        const cleanupAndDestroy = () => {
            cleanup();
            if (promptWindow) {
                promptWindow.destroy();
                promptWindow = null;
            }
        };

        // IPC-Listener
        const responseListener = (event, response) => {
            if (response.confirmed) {
                resolve(response.value);
            } else {
                reject(new Error('User cancelled'));
            }

            event.returnValue = null;
            cleanupAndDestroy();
        };

        const getDataListener = event => {
            event.returnValue = JSON.stringify({
                data: options.data,
                options: {
                    customCssFiles: options.customCssFiles,
                    customJavaScriptFiles: options.customJavaScriptFiles,
                    darkMode: options.darkMode,
                    maxHeight: options.maxHeight,
                    maxWidth: options.maxWidth,
                    parentWindow: !!options.parentWindow,
                    title: options.parentWindow ? options.title : null,
                },
            });
        };

        const errorListener = (event, message) => {
            reject(new Error(message));
            event.returnValue = null;
            cleanupAndDestroy();
        };

        const resizeWindowListener = (event, { width, height }) => {
            const browserWindow = BrowserWindow.fromWebContents(event.sender);
            if (browserWindow) {
                browserWindow.setMinimumSize(width, height);
                browserWindow.setSize(width, height);
                browserWindow.center();
            }
        };

        // IPC-Handler
        ipcMain.once(`response:${id}`, responseListener);
        ipcMain.once(`get-data:${id}`, getDataListener);
        ipcMain.once(`error:${id}`, errorListener);
        ipcMain.on(`resize-window:${id}`, resizeWindowListener);

        // Window-Events
        promptWindow.once('closed', () => {
            reject(new Error('Window was closed'));
            cleanup();
        });

        promptWindow.once('unresponsive', () => {
            reject(new Error('Window was unresponsive'));
            cleanupAndDestroy();
        });

        if (options.parentWindow) {
            const parentFocusListener = () => {
                reject(new Error('User cancelled by clicking parent window'));
                cleanupAndDestroy();
            };

            options.parentWindow.once('focus', parentFocusListener);
        }

        // Finally, load the prompt
        promptWindow.loadURL(promptUrl).catch(error => {
            throw error;
        });

        // Show window only when ready
        promptWindow.once('ready-to-show', () => {
            options.x === null && options.y === null && promptWindow.center();
            promptWindow.show();
        });
    });
}

module.exports = electronPrompt;
