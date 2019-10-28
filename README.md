# handle-race-condition
Module that returns a function that resolves promises in the same order that it was called. 

 - Super simple to use
 - No dependencies on any other library.
 - Works with any async function that returns a Promise
 - Supports AMD

## Race condition
There are times when you call an async function multiple times but the ouput may not come in the same order as it was called.
This is called race condition and you can solve it using this simple module.

## How to install
```
npm i handle-race-condition
```

## Example usage

Consider the example below:
```javascript
const someAsyncFunction = (time, order) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(order);
        }, time);
    });
};
```
Here `someAsyncFunction` is an async function whose output can resolve at different times depending on `time`. You can think of this time as the time required for an ajax response.

Now lets call this function multiple times:

```javascript
someAsyncFunction(500, 1).then((order) => { console.log(order) });
someAsyncFunction(200, 2).then((order) => { console.log(order) });
someAsyncFunction(50, 3).then((order) => { console.log(order) });
someAsyncFunction(400, 4).then((order) => { console.log(order) });
someAsyncFunction(600, 5).then((order) => { console.log(order) });
```

As you can see the output below is not in the same order as it was called:
```
3
2
4
1
5
```

Now lets use our module:
```javascript
import handleRaceCondition from 'handleRaceCondition';

const someAsyncFunction = (time, order) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(order);
        }, time);
    });
};

const getSyncedResponse = handleRaceCondition(someAsyncFunction);

getSyncedResponse(500, 1).then((order) => { console.log(order) });
getSyncedResponse(200, 2).then((order) => { console.log(order) });
getSyncedResponse(50, 3).then((order) => { console.log(order) });
getSyncedResponse(400, 4).then((order) => { console.log(order) });
getSyncedResponse(600, 5).then((order) => { console.log(order) });
```
You pass the desired async function to `handleRaceCondition()` and it will return another function which when called multiple times will always resolve in the same order.
The output as you can see now, is in the order of when it was called.
```
1
2
3
4
5
```
