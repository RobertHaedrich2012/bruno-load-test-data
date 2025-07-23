const path = require('node:path');
const electronPrompt = require('bruno-utils-electron-prompt');

async function loadTestData(currentBrunoWorkingDirectory = globalThis.bru?.cwd() || './', testDataFile = 'testData.js') {
    let testData = {};

    try {
        testData = require(`${currentBrunoWorkingDirectory}/${testDataFile}`);
    } catch (error) {
        throw new Error(`🛑 Error: Failed to load test data from ${testDataFile}❗\n${error.message}`);
    }

    /** @type {{ [key: string]: string }} */
    const selectedTestData = await electronPrompt({
        title: 'Select your test data',
        data: testData,
        useContentSize: true,
        height: 250,
        width: 800,
        customJavaScriptFiles: [
            path.join(__dirname, 'prompt.js'),
            path.join(__dirname, '../../../node_modules/prismjs/components/prism-core.js'),
            path.join(__dirname, '../../../node_modules/prismjs/components/prism-json.js'),
        ],
        customCssFiles: [
            { path: path.join(__dirname, '../../../node_modules/prismjs/themes/prism.css'), darkMode: false },
            { path: path.join(__dirname, '../../../node_modules/prismjs/themes/prism-twilight.css'), darkMode: true },
        ],
    });

    Object.entries(selectedTestData).forEach(([level1Key, level2Key]) => {
        console.log(`Key: ${level1Key}, Value: ${level2Key}`, testData[level1Key][level2Key]);

        const selectedEntry = testData[level1Key][level2Key];
        if (selectedEntry && typeof selectedEntry === 'object') {
            Object.entries(selectedEntry).forEach(
                /** @param {[string, string]} entry */
                ([key, val]) => {
                    globalThis.bru.setVar(key, val);
                },
            );
        }
    });
}

module.exports = loadTestData;
