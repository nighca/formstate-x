"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPromiseLike(arg) {
    return arg != null && typeof arg === 'object' && typeof arg.then === 'function';
}
exports.isPromiseLike = isPromiseLike;
function isEmpty(response) {
    return !response;
}
exports.isEmpty = isEmpty;
function asyncResponsesAnd(asyncResponses) {
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
exports.asyncResponsesAnd = asyncResponsesAnd;
function applyValidators(value, validators) {
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
exports.applyValidators = applyValidators;
function debounce(fn, delay) {
    var timeout = null;
    return function () {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, delay);
    };
}
exports.debounce = debounce;
//# sourceMappingURL=utils.js.map