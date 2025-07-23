# Bruno util: `load-test-data`

This util enables the loading of predefined test data for the respectively Bruno collection.

## Usage

```javascript
const loadTestData = require('./utils/load-test-data');

// Default usage
await loadTestData();

// With additional options
await loadTestData(
  // Specify the path to the Bruno collection
  bru.cwd(),
  // Specify the path to the test data file
  './testData.js',
);
```
