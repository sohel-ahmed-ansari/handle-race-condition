/**
 * Module that returns a function that resolves promises in the same order that it was called.
 */
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        //AMD
        define([], function () {
            return factory();
        });
    }
    else if (typeof exports === 'object') {
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
        var lastPromise;
        var onSuccess = function (result) {
            if (lastPromise === this) {
                lastPromise = null;
            }
            return result;
        }
        var onError = function (err) {
            if (lastPromise === this) {
                lastPromise = null;
            }
            throw err;
        }
        return (function (...args) {
            if (!lastPromise) {
                lastPromise = raceConditionFunction(...args)
                    .then(onSuccess.bind(lastPromise))
                    .catch(onError.bind(lastPromise));
                return lastPromise;
            } else {
                lastPromise = lastPromise
                    .then((function () {
                        return raceConditionFunction(...args)
                            .then(onSuccess.bind(this))
                            .catch(onError.bind(this));
                    }).bind(lastPromise))
                    .catch((function () {
                        return raceConditionFunction(...args)
                            .then(onSuccess.bind(this))
                            .catch(onError.bind(this));
                    }).bind(lastPromise));
                return lastPromise;
            }
        });
    }
}));