# @neogeek/fetch

> Wrapper around the browser method fetch that handles errors and response.

## Install

As this is more of a resource than a distributed package, installation is by way of the classic copy and paste method.

## Usage

This fetch wrapper is built with the assumption that error responses from your API use the following format:

```json
{ "code": 500, "message": "Internal Server Error" }
```

When you make a request with the fetch wrapper, you can destruct an error as well as the data from the response.

```typescript
const { error, data } = await get('/api/messages');

if (error) {
  console.log(`Error: ${error.message}`);
}
```
