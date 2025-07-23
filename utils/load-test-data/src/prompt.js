const content = document.getElementById('content');

if (content) {
    // Set PismJS to manual mode to prevent automatic highlighting
    window.Prism = window.Prism || {};
    window.Prism.manual = true;

    content.innerHTML = '';
    Object.keys(window.Data).forEach((level1Key, idx, arr) => {
        const label = document.createElement('label');
        label.textContent = level1Key[0].toUpperCase() + level1Key.slice(1) + ': ';

        const selectContainer = document.createElement('div');
        const select = document.createElement('select');
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.appendChild(code);
        selectContainer.appendChild(select);
        selectContainer.className = 'select-container';
        code.className = 'language-json'; // Set class for PrismJS highlighting

        // Empty default entry
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Select ...';
        select.appendChild(emptyOption);

        Object.keys(Data[level1Key]).forEach(level2Key => {
            const option = document.createElement('option');
            option.value = level2Key;
            option.textContent = level2Key;
            select.appendChild(option);
        });

        select.addEventListener('change', function () {
            if (!window.Response) window.Response = {};

            if (this.value) {
                window.Response[level1Key] = this.value;
                code.textContent = JSON.stringify(Data[level1Key][this.value], null, 4);
                Prism.highlightElement(code); // Highlight the code block with PrismJS
                console.log('Ausgewählter Key:', this.value);
            } else {
                delete window.Response[level1Key];
                code.textContent = '';
                console.log('Auswahl gelöscht für Key:', level1Key);
            }

            window.resizeWindow();
        });

        content.appendChild(label);
        content.appendChild(selectContainer);
        content.appendChild(pre);

        if (idx < arr.length - 1) {
            content.appendChild(document.createElement('br'));
        }
    });

    window.resizeWindow();
    window.contentLoaded();
} else {
    throw new Error('Container with id "content" not found in the HTML.');
}
