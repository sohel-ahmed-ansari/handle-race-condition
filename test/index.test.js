import handleRaceCondition from '../lib';

describe('handleRaceCondition', () => {
    let someAsyncFunction, getResult;
    beforeEach(() => {
        someAsyncFunction = (time, order) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(order);
                }, time);
            });
        };
        getResult = handleRaceCondition(someAsyncFunction);
    });
    it('should return a function', () => {
        expect(typeof getResult).toEqual('function')
    });
    it('should resolve for the last call', () => {
        let results = [];
        return Promise.all([
            getResult(500, 1).then((result) => { results.push(result) }),
            getResult(200, 2).then((result) => { results.push(result) }),
            getResult(50, 3).then((result) => { results.push(result) }),
            getResult(400, 4).then((result) => { results.push(result) }),
            getResult(100, 5).then((result) => { results.push(result) })
        ]).then(() => {
            expect(results).toEqual([5, 5, 5, 5, 5]);
        });
    });
    it('should resolve for the last call when last promise resolves first', () => {
        let results = [];
        return Promise.all([
            getResult(500, 1).then((result) => { results.push(result) }),
            getResult(200, 2).then((result) => { results.push(result) }),
            getResult(50, 3).then((result) => { results.push(result) }),
            getResult(400, 4).then((result) => { results.push(result) }),
            getResult(20, 5).then((result) => { results.push(result) })
        ]).then(() => {
            expect(results).toEqual([5, 5, 5, 5, 5]);
        });
    });
    it('should resolve for the last call when last promise resolves last', () => {
        let results = [];
        return Promise.all([
            getResult(500, 1).then((result) => { results.push(result) }),
            getResult(200, 2).then((result) => { results.push(result) }),
            getResult(50, 3).then((result) => { results.push(result) }),
            getResult(400, 4).then((result) => { results.push(result) }),
            getResult(700, 5).then((result) => { results.push(result) })
        ]).then(() => {
            expect(results).toEqual([5, 5, 5, 5, 5]);
        });
    });
    it('should resolve when only called once', () => {
        let results = [];
        return Promise.all([
            getResult(500, 1).then((result) => { results.push(result) })
        ]).then(() => {
            expect(results).toEqual([1]);
        });
    });
});