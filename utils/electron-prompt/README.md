# Bruno util: `electron-prompt`

This util creates window popups in Bruno and enables data transfer between the popup and Bruno.

## Usage

```javascript
const electronPrompt = require('bruno-utils-electron-prompt');
const promptData = await electronPrompt({
  title: 'Your Title',
  data: {}, // Add the data you want to work with in the popup
  customJavaScriptFiles: [
    /* Add your custom JavaScript file to display the data or process it in any way.
       You get access to the data object with `window.Data` */
    path.join(__dirname, 'prompt.js'),
  ],
});

console.log('Your Prompt Data:', promptData);
```

### Available options

```javascript
electronPrompt({
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
  data: {},
});
```
