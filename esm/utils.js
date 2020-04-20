export function isPromiseLike(arg) {
    return arg != null && typeof arg === 'object' && typeof arg.then === 'function';
}
export function isEmpty(response) {
    return !response;
}
export function asyncResponsesAnd(asyncResponses) {
    if (asyncResponses.length === 0) {
        return null;
    }
    return new Promise(function (resolve) {
        // 任一不通过，则不通过
        asyncResponses.forEach(function (asyncResponse) { return asyncResponse.then(function (Response) {
            if (!isEmpty(Response)) {
                resolve(Response);
            }
        }); });
        // 所有都通过，则通过
        return Promise.all(asyncResponses).then(function (responses) {
            if (responses.every(isEmpty)) {
                resolve(null);
            }
        });
    });
}
export function applyValidators(value, validators) {
    if (validators.length === 0) {
        return null;
    }
    if (validators.length === 1) {
        return validators[0](value);
    }
    var asyncResponses = [];
    for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
        var validator = validators_1[_i];
        var response = validator(value);
        if (isPromiseLike(response)) {
            asyncResponses.push(response);
            continue;
        }
        // 任一不通过，则不通过
        if (!isEmpty(response)) {
            return response;
        }
    }
    return asyncResponsesAnd(asyncResponses);
}
export function debounce(fn, delay) {
    var timeout = null;
    return function () {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, delay);
    };
}
//# sourceMappingURL=utils.js.map