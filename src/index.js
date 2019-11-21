/**
 * Module that returns a function that resolves promises in the same order that it was called.
 */
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        //AMD
        define([], () => {
            return factory();
        });
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        window.handleRaceCondition = factory();
    }
}(() => {
    /**
     * @param {Function} raceConditionFunction Async function for which race condition needs to be handled. This function should return a promise
     * @returns {Function} An async function that returns a promise and can be called any number of times, but will always resolve/reject for the latest call.
     */
    return (raceConditionFunction) => {
        let latestPromise = null;
        const arrResolve = [];
        const arrReject = [];
        return ((...args) => {
            latestPromise = raceConditionFunction(...args);
            return new Promise((resolve, reject) => {
                latestPromise.then(((lp) => {
                    return (result) => {
                        if (lp === latestPromise) {
                            arrResolve.forEach(r => r());
                            resolve(result);
                        } else {
                            arrResolve.push(resolve);
                            arrReject.push(reject);
                        }
                    }
                })(latestPromise)).catch(((lp) => {
                    return (err) => {
                        if (lp === latestPromise) {
                            arrReject.forEach(r => r());
                            reject(err);
                        } else {
                            arrResolve.push(resolve);
                            arrReject.push(reject);
                        }
                    }
                })(latestPromise));
            });
        });
    }
}));