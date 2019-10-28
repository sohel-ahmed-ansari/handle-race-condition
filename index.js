/**
 * Module that returns a function that resolves promises in the same order that it was called.
 */
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(factory());
    }
    else if (typeof exports === 'object') {
        //Babel
        module.exports = factory();
    }
    else {
        window.handleRaceCondition = factory();
    }
}(function () {
    /**
     * @param {Function} raceConditionFunction Async function for which race condition needs to be handled. This function should return a promise
     * @returns {Function} An sync function that returns a promise and can be called any number of times, but will always resolve in the order of which it was called.
     */
    return function (raceConditionFunction) {
        let lastPromise;
        function handler(result) {
            if (lastPromise === this) {
                lastPromise = null;
            }
            return result;
        }
        return ((...args) => {
            if (!lastPromise) {
                lastPromise = raceConditionFunction(...args)
                    .then(handler.bind(lastPromise))
                    .catch(handler.bind(lastPromise));
                return lastPromise;
            } else {
                lastPromise = lastPromise
                    .then((function () {
                        return raceConditionFunction(...args)
                            .then(handler.bind(this))
                            .catch(handler.bind(this));
                    }).bind(lastPromise))
                    .catch((function () {
                        return raceConditionFunction(...args)
                            .then(handler.bind(this))
                            .catch(handler.bind(this));
                    }).bind(lastPromise));
                return lastPromise;
            }
        });
    }
}));