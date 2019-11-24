# handle-race-condition
Module that accepts an async function, and returns an async function that can be called any number of times in parallel, but will always resolve/reject with result of the latest call.

 - Super simple to use
 - No dependencies on any other library.
 - Works with any async function that returns a Promise
 - Supports AMD

## Race condition
There are times when you call an async function multiple times but the ouput may not come in the same order as it was called, i.e, the first call can be resolved after the second call.
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
someAsyncFunction(100, 5).then((order) => { console.log(order) });
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

const someAsyncFunction = (time, result) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, time);
    });
};

const getResult = handleRaceCondition(someAsyncFunction);

getResult(500, 1).then((result) => { console.log(result) });
getResult(200, 2).then((result) => { console.log(result) });
getResult(50, 3).then((result) => { console.log(result) });
getResult(400, 4).then((result) => { console.log(result) });
getResult(100, 5).then((result) => { console.log(result) });
```
You pass the desired async function to `handleRaceCondition()` and it will return another async function which when called multiple times will always resolve for the last call.
The output, as you can see now, is resolved when the last call is resolved.
```
5
5
5
5
5
```
