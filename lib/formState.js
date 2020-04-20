"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var types_1 = require("./types");
var utils_1 = require("./utils");
var disposable_1 = __importDefault(require("./disposable"));
/**
 * The state for a form (composition of fields).
 */
var FormState = /** @class */ (function (_super) {
    __extends(FormState, _super);
    function FormState(initialFields) {
        var _this = _super.call(this) || this;
        /**
         * Behavior mode: `object` or `array`
         */
        _this.mode = 'object';
        /**
         * If activated (with auto validate).
         * Form will only be activated when `validate()` called or some field activated.
         */
        _this._activated = false;
        /**
         * The validate status.
         */
        _this._validateStatus = types_1.ValidateStatus.NotValidated;
        /**
         * List of validator functions.
         */
        _this._validators = [];
        /**
         * Method to check if we should disable validation.
         */
        _this.shouldDisableValidation = function () { return false; };
        _this.mode = mobx_1.isArrayLike(initialFields) ? 'array' : 'object';
        _this.$ = initialFields;
        if (!mobx_1.isObservable(_this.$)) {
            _this.$ = mobx_1.observable(_this.$, undefined, { deep: false });
        }
        // auto activate: any field activated -> form activated
        _this.addDisposer(mobx_1.reaction(function () { return _this.fields.some(function (field) { return field._activated; }); }, function (someFieldActivated) { return someFieldActivated && !_this._activated && (_this._activated = true); }, { fireImmediately: true }));
        // auto validate: this.value -> this.validation
        _this.addDisposer(mobx_1.autorun(function () { return !_this.validationDisabled && _this._activated && _this._validate(); }, { name: 'autorun-check-&-_validate' }));
        // auto apply validate result: this.validation -> this.error
        _this.addDisposer(mobx_1.reaction(function () { return _this.validation; }, function () { return _this.applyValidation(); }, { name: 'applyValidation-when-validation-change' }));
        // dispose fields when dispose
        _this.addDisposer(function () {
            _this.fields.forEach(function (field) { return field.dispose(); });
        });
        return _this;
    }
    Object.defineProperty(FormState.prototype, "dirty", {
        /**
         * If value has been touched.
         */
        get: function () {
            return this.fields.some(function (field) { return field.dirty; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "fields", {
        /**
         * List of fields.
         */
        get: function () {
            if (this.mode === 'array') {
                return this.$;
            }
            var fields = this.$;
            return Object.keys(fields).map(function (key) { return fields[key]; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "value", {
        /**
         * Value that can be consumed by your code.
         * It's a composition of fields' value.
         */
        get: function () {
            if (this.mode === 'array') {
                return this.fields.map(function (field) { return field.value; });
            }
            var fields = this.$;
            return Object.keys(fields).reduce(function (value, key) {
                var _a;
                return (__assign(__assign({}, value), (_a = {}, _a[key] = fields[key].value, _a)));
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "validating", {
        /**
         * If the state is doing a validation.
         */
        get: function () {
            if (this.validationDisabled) {
                return false;
            }
            return (this._validateStatus === types_1.ValidateStatus.Validating
                || this.fields.some(function (field) { return field.validating; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "error", {
        /**
         * The error info of validation (including fields' error info).
         */
        get: function () {
            if (this.validationDisabled) {
                return undefined;
            }
            if (this._error) {
                return this._error;
            }
            for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                var field = _a[_i];
                if (field.error) {
                    return field.error;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "hasError", {
        /**
         * If the state contains error.
         */
        get: function () {
            return !!this.error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "validated", {
        /**
         * If the validation has been done.
         * It does not means validation passed.
         */
        get: function () {
            if (this.validationDisabled) {
                return false;
            }
            return this._validateStatus === types_1.ValidateStatus.Validated && this.fields.every(function (field) { return field.validationDisabled || field.validated; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set error info of form.
     */
    FormState.prototype.setError = function (error) {
        this._error = error ? error : undefined;
    };
    /**
     * Add validator function.
     */
    FormState.prototype.validators = function () {
        var _a;
        var validators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            validators[_i] = arguments[_i];
        }
        (_a = this._validators).push.apply(_a, validators);
        return this;
    };
    /**
     * 同步设置值
     * 这里 `FormState` 不提供 `set`，因为
     * 1. 如果 `set` 传入 fields（`$`），不够好用，意义不大
     * 2. 如果 `set` 传入 `value`，则 `FormState` 很难利用 `value` 还原 fields
     *    如 fields 是 `[field1, field2]`，传入 `value` 为 `[1, 2, 3]` 的情况，这里做不到依据 `3` 还原出其对应的 field
     */
    // @action private set(value: TValue) {}
    /**
     * Reset to initial status.
     */
    FormState.prototype.reset = function () {
        this._activated = false;
        this._validateStatus = types_1.ValidateStatus.NotValidated;
        this._error = undefined;
        this.validation = undefined;
        this.fields.forEach(function (field) { return field.reset(); });
    };
    /**
     * Do validation.
     */
    FormState.prototype._validate = function () {
        var _this = this;
        var value = this.value;
        mobx_1.runInAction('set-validateStatus-when-_validate', function () {
            _this._validateStatus = types_1.ValidateStatus.Validating;
        });
        var response = utils_1.applyValidators(value, this._validators);
        mobx_1.runInAction('set-validation-when-_validate', function () {
            _this.validation = { value: value, response: response };
        });
    };
    /**
     * Fire a validation behavior.
     */
    FormState.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mobx_1.runInAction('activate-when-validate', function () {
                            _this._activated = true;
                        });
                        this._validate();
                        this.fields.forEach(function (field) { return field.validate(); });
                        // 兼容 formstate 接口
                        return [4 /*yield*/, mobx_1.when(function () { return _this.validationDisabled || _this.validated; }, { name: 'return-validate-when-not-validating' })];
                    case 1:
                        // 兼容 formstate 接口
                        _a.sent();
                        return [2 /*return*/, (this.hasError
                                ? { hasError: true }
                                : { hasError: false, value: this.value })];
                }
            });
        });
    };
    Object.defineProperty(FormState.prototype, "validationDisabled", {
        /** If validation disabled. */
        get: function () {
            return this.shouldDisableValidation();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Configure when to disable validation.
     */
    FormState.prototype.disableValidationWhen = function (predict) {
        this.shouldDisableValidation = predict;
        return this;
    };
    /**
     * Apply validation.
     */
    FormState.prototype.applyValidation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var validation, error, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation = this.validation;
                        if (!validation) {
                            return [2 /*return*/];
                        }
                        if (!utils_1.isPromiseLike(validation.response)) return [3 /*break*/, 2];
                        return [4 /*yield*/, validation.response];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = validation.response;
                        _b.label = 3;
                    case 3:
                        error = (_a);
                        // 如果 validation 已过期，则不生效
                        if (validation !== this.validation) {
                            return [2 /*return*/];
                        }
                        mobx_1.runInAction('endValidation', function () {
                            _this.validation = undefined;
                            _this._validateStatus = types_1.ValidateStatus.Validated;
                            if (error !== _this.error) {
                                _this.setError(error);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        mobx_1.observable
    ], FormState.prototype, "_activated", void 0);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "dirty", null);
    __decorate([
        mobx_1.observable.ref
    ], FormState.prototype, "$", void 0);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "fields", null);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "value", null);
    __decorate([
        mobx_1.observable
    ], FormState.prototype, "_validateStatus", void 0);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "validating", null);
    __decorate([
        mobx_1.observable
    ], FormState.prototype, "_error", void 0);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "error", null);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "hasError", null);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "validated", null);
    __decorate([
        mobx_1.action
    ], FormState.prototype, "setError", null);
    __decorate([
        mobx_1.observable.shallow
    ], FormState.prototype, "_validators", void 0);
    __decorate([
        mobx_1.action
    ], FormState.prototype, "validators", null);
    __decorate([
        mobx_1.action
    ], FormState.prototype, "reset", null);
    __decorate([
        mobx_1.observable.ref
    ], FormState.prototype, "validation", void 0);
    __decorate([
        mobx_1.observable.ref
    ], FormState.prototype, "shouldDisableValidation", void 0);
    __decorate([
        mobx_1.computed
    ], FormState.prototype, "validationDisabled", null);
    __decorate([
        mobx_1.action
    ], FormState.prototype, "disableValidationWhen", null);
    return FormState;
}(disposable_1.default));
exports.default = FormState;
//# sourceMappingURL=formState.js.map