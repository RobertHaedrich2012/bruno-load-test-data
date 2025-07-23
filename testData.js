module.exports = {
    collection: {
        'Collection 1': {
            'collection.customerId': 'New-Customer-ID-1',
        },
        'Collection 2': {
            'collection.customerId': 'New-Customer-ID-2',
        },
    },
    request: {
        'Request example 1': {
            'request.services.1': 'Example 1',
            'request.services.2': 'Example 2',
            'request.services.3': '{{collection.testData.services.1}}',
        },
        'Request example 2': {
            'request.services.1': 'Example 2.1',
            'request.services.2': 'Example 2.2',
            'request.services.3': '{{collection.testData.services.2}}',
        },
    },
};
