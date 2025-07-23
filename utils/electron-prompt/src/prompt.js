const { ipcRenderer } = require('electron');
let promptId = null;
let promptData = null;

function promptError(error) {
    if (error instanceof Error) {
        error = `${error.message}\n${error.stack}`;
    }

    ipcRenderer.sendSync(`error:${promptId}`, error);
}

function init() {
    const okButton = document.getElementById('ok');
    const cancelButton = document.getElementById('cancel');
    promptId = document.location.hash.replace('#', '');

    const handleSubmit = () => {
        ipcRenderer.send(`response:${promptId}`, {
            value: window.Response,
            confirmed: true,
        });
    };

    const handleCancel = () => {
        ipcRenderer.send(`response:${promptId}`, {
            value: null,
            confirmed: false,
        });
    };

    document.addEventListener('keyup', event => {
        if (event.key === 'Enter') handleSubmit();
        if (event.key === 'Escape') handleCancel();
    });

    okButton.addEventListener('click', handleSubmit);
    cancelButton.addEventListener('click', handleCancel);

    // Get prompt data
    try {
        promptData = JSON.parse(ipcRenderer.sendSync(`get-data:${promptId}`));

        if (promptData.options.darkMode) {
            document.documentElement.classList.add('dark-mode');
        }

        // Only used if the parentWindow was set
        if (promptData.options.title) {
            const titleElement = document.getElementById('title');
            const closeButton = document.createElement('span');
            closeButton.className = 'close-button';
            closeButton.textContent = '×';

            titleElement.textContent = promptData.options.title;
            titleElement.appendChild(closeButton);

            closeButton.addEventListener('click', handleCancel);
        }

        // Load custom JavaScript files sequentially
        if (Array.isArray(promptData.options.customJavaScriptFiles)) {
            function loadScriptsSequentially(files) {
                return (async () => {
                    for (const jsFile of files) {
                        await new Promise((resolve, reject) => {
                            const script = document.createElement('script');
                            script.src = jsFile;
                            script.onload = () => {
                                console.log('Custom JavaScript loaded:', jsFile);
                                resolve();
                            };
                            script.onerror = reject;
                            document.body.appendChild(script);
                        });
                    }
                })();
            }

            loadScriptsSequentially(promptData.options.customJavaScriptFiles).catch(error => {
                console.error('Error loading custom JavaScript files:', error);
            });
        }

        // Load custom CSS files
        if (Array.isArray(promptData.options.customCssFiles)) {
            promptData.options.customCssFiles.forEach(
                /** @param {{path: string, darkMode?: boolean}} cssFile */ cssFile => {
                    if (cssFile.darkMode === undefined || cssFile.darkMode === !!promptData.options.darkMode) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = cssFile.path;
                        link.onload = () => {
                            console.log('Custom CSS loaded:', cssFile);
                        };
                        document.head.appendChild(link);
                    }
                },
            );
        }

        window.Data = promptData.data || null;
        window.Response = {};
    } catch (error) {
        return promptError(error);
    }

    console.log('Prompt data:', promptData);
}

window.addEventListener('error', event => {
    if (promptId) {
        promptError(
            `An error has occurred on the prompt window: \nMessage: ${event.message}\nLine: ${event.lineno}, Column: ${event.colno}\nStack: ${event.error.stack}`,
        );
    }
});

// Add global available functions to resize the window
window.resizeWindow = function () {
    setTimeout(() => {
        const contentHeightDiff =
            (document.getElementById('content-wrapper')?.scrollHeight || 0) - (document.getElementById('content')?.scrollHeight || 0);
        const windowHeightDiff = !promptData.options.parentWindow ? window.outerHeight - window.innerHeight : 0;
        const maxHeight = promptData.options.maxHeight;
        const maxWidth = promptData.options.maxWidth;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        let newHeight = document.documentElement.scrollHeight - (contentHeightDiff > 0 ? contentHeightDiff : 0) + windowHeightDiff;
        let newWidth = document.documentElement.scrollWidth + scrollbarWidth;

        if (maxHeight && newHeight > maxHeight) {
            newHeight = maxHeight;
        }

        if (maxWidth && newWidth > maxWidth) {
            newWidth = maxWidth;
        }

        console.log(`Resizing window to width: ${newWidth}, height: ${newHeight}`, maxWidth, maxHeight);
        ipcRenderer.send(`resize-window:${promptId}`, { width: newWidth, height: newHeight });
    }, 100);
};

// Add global available function to mark the content as loaded
window.contentLoaded = function () {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
