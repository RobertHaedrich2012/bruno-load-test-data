# bruno-load-test-data

## How to use

1. Fetch the Bruno collection with:
   [<img src="https://fetch.usebruno.com/button.svg" alt="Fetch in Bruno" style="width: 130px; height: 30px;" width="128" height="32">](https://fetch.usebruno.com?url=git%40github.com%3ARobertHaedrich2012%2Fbruno-load-test-data.git 'target=_blank rel=noopener noreferrer')
2. Run `npm install` in the collection directory. This will install:
   - dependencies
     - prismjs
   - devDependencies (not needed for running the collection):
     - @types/node
     - electron
     - prettier
3. Activate the **Developer Mode** in Bruno.
4. Run the example request **Example request** in Bruno. You will get these response:
   ```json
   {
     "customerId": "default customer ID",
     "data": [
       {
         "id": "default example 1"
       },
       {
         "id": "default example 2"
       },
       {
         "id": "default example 3"
       }
     ]
   }
   ```
5. Run the request **Load test data** and select **Collection 1** and **Request example 1**.  
    Run the example request **Example Request** again. You will get these response:
   ```json
   {
     "customerId": "New-Customer-ID-1",
     "data": [
       {
         "id": "Example 1"
       },
       {
         "id": "Example 2"
       },
       {
         "id": "service 1"
       }
     ]
   }
   ```
6. The request **Clear runtime variables** will remove all loaded test data.
