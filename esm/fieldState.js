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
import { observable, computed, action, reaction, autorun, runInAction, when } from 'mobx';
import { ValidateStatus } from './types';
import { applyValidators, debounce } from './utils';
import Disposable from './disposable';
/**
 * The state for a field.
 */
var FieldState = /** @class */ (function (_super) {
    __extends(FieldState, _super);
    function FieldState(initialValue, delay) {
        if (delay === void 0) { delay = 200; }
        var _this = _super.call(this) || this;
        _this.initialValue = initialValue;
        /**
         * If activated (with auto validation).
         * Field will only be activated when `validate()` or `onChange()` called.
         */
        _this._activated = false;
        /**
         * The validate status.
         */
        _this._validateStatus = ValidateStatus.NotValidated;
        /**
         * List of validator functions.
         */
        _this._validators = [];
        /**
         * Method to check if we should disable validation.
         */
        _this.shouldDisableValidation = function () { return false; };
        _this.reset();
        // debounced reaction to `_value` change
        _this.addDisposer(reaction(function () { return _this._value; }, 
        // use debounce instead of reactionOptions.delay
        // cause the later do throttle in fact, not debounce
        // see https://github.com/mobxjs/mobx/issues/1956
        debounce(function () {
            if (_this.value !== _this._value) {
                runInAction('sync-value-when-_value-changed', function () {
                    _this.value = _this._value;
                    _this._validateStatus = ValidateStatus.NotValidated;
                    _this._activated = true;
                });
            }
        }, delay), { name: 'reaction-when-_value-change' }));
        // auto sync when validate ok: this.value -> this.$
        _this.addDisposer(reaction(function () { return _this.validated && !_this.hasError; }, function (validateOk) { return validateOk && (_this.$ = _this.value); }, { name: 'sync-$-when-validatedOk' }));
        // auto validate: this.value -> this.validation
        _this.addDisposer(autorun(function () { return !_this.validationDisabled && _this._activated && _this._validate(); }, { name: 'autorun-check-&-_validate' }));
        // auto apply validate result: this.validation -> this.error
        _this.addDisposer(reaction(function () { return _this.validation; }, function () { return _this.applyValidation(); }, { name: 'applyValidation-when-validation-change' }));
        return _this;
    }
    Object.defineProperty(FieldState.prototype, "dirty", {
        /**
         * If value has been touched (different with `initialValue`)
         */
        get: function () {
            return this.value !== this.initialValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldState.prototype, "validating", {
        /**
         * If the state is doing a validation.
         */
        get: function () {
            return this.validationDisabled ? false : this._validateStatus === ValidateStatus.Validating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldState.prototype, "error", {
        /**
         * The error info of validation.
         */
        get: function () {
            return this.validationDisabled ? undefined : this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldState.prototype, "hasError", {
        /**
         * If the state contains error.
         */
        get: function () {
            return !!this.error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldState.prototype, "validated", {
        /**
         * If the validation has been done.
         * It does not means validation passed.
         */
        get: function () {
            return this.validationDisabled ? false : this._validateStatus === ValidateStatus.Validated;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set error info.
     */
    FieldState.prototype.setError = function (error) {
        this._error = error ? error : undefined;
    };
    /**
     * Add validator function.
     */
    FieldState.prototype.validators = function () {
        var _a;
        var validators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            validators[_i] = arguments[_i];
        }
        (_a = this._validators).push.apply(_a, validators);
        return this;
    };
    /**
     * Set `_value` on change event.
     */
    FieldState.prototype.onChange = function (value) {
        this._value = value;
    };
    /**
     * Set `value` (& `_value`) synchronously.
     */
    FieldState.prototype.set = function (value) {
        this.value = this._value = value;
    };
    /**
     * Reset to initial status.
     */
    FieldState.prototype.reset = function () {
        this.$ = this.value = this._value = this.initialValue;
        this._activated = false;
        this._validateStatus = ValidateStatus.NotValidated;
        this._error = undefined;
        this.validation = undefined;
    };
    /**
     * Do validation.
     */
    FieldState.prototype._validate = function () {
        var _this = this;
        var value = this.value;
        // 如果 value 已经过期，则不处理
        if (value !== this._value) {
            return;
        }
        runInAction('set-validateStatus-when-_validate', function () {
            _this._validateStatus = ValidateStatus.Validating;
        });
        var response = applyValidators(value, this._validators);
        runInAction('set-validation-when-_validate', function () {
            _this.validation = { value: value, response: response };
        });
    };
    /**
     * Fire a validation behavior.
     */
    FieldState.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var validation;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validation = this.validation;
                        runInAction('activate-and-sync-_value-when-validate', function () {
                            _this._activated = true;
                            // 若有用户交互产生的变更（因 debounce）尚未同步，同步之，确保本次 validate 结果是相对稳定的
                            _this.value = _this._value;
                        });
                        // 若 `validation` 未发生变更，意味着未发生新的校验行为
                        // 若上边操作未触发自动的校验行为，强制调用之
                        if (this.validation === validation) {
                            this._validate();
                        }
                        // Compatible with formstate
                        return [4 /*yield*/, when(function () { return _this.validationDisabled || _this.validated; }, { name: 'return-validate-when-not-validating' })];
                    case 1:
                        // Compatible with formstate
                        _a.sent();
                        return [2 /*return*/, (this.hasError
                                ? { hasError: true }
                                : { hasError: false, value: this.value })];
                }
            });
        });
    };
    Object.defineProperty(FieldState.prototype, "validationDisabled", {
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
    FieldState.prototype.disableValidationWhen = function (predict) {
        this.shouldDisableValidation = predict;
        return this;
    };
    /**
     * Apply validation.
     */
    FieldState.prototype.applyValidation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var validation, error;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validation = this.validation;
                        if (!validation) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, validation.response];
                    case 1:
                        error = _a.sent();
                        if (validation !== this.validation // 如果 validation 已过期，则不生效
                            || validation.value !== this._value // 如果 value 已过期，则不生效
                        ) {
                            return [2 /*return*/];
                        }
                        runInAction('endValidation', function () {
                            _this.validation = undefined;
                            _this._validateStatus = ValidateStatus.Validated;
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
        observable
    ], FieldState.prototype, "_activated", void 0);
    __decorate([
        computed
    ], FieldState.prototype, "dirty", null);
    __decorate([
        observable.ref
    ], FieldState.prototype, "_value", void 0);
    __decorate([
        observable.ref
    ], FieldState.prototype, "value", void 0);
    __decorate([
        observable.ref
    ], FieldState.prototype, "$", void 0);
    __decorate([
        observable
    ], FieldState.prototype, "_validateStatus", void 0);
    __decorate([
        computed
    ], FieldState.prototype, "validating", null);
    __decorate([
        observable
    ], FieldState.prototype, "_error", void 0);
    __decorate([
        computed
    ], FieldState.prototype, "error", null);
    __decorate([
        computed
    ], FieldState.prototype, "hasError", null);
    __decorate([
        computed
    ], FieldState.prototype, "validated", null);
    __decorate([
        action
    ], FieldState.prototype, "setError", null);
    __decorate([
        observable.shallow
    ], FieldState.prototype, "_validators", void 0);
    __decorate([
        action
    ], FieldState.prototype, "validators", null);
    __decorate([
        action
    ], FieldState.prototype, "onChange", null);
    __decorate([
        action
    ], FieldState.prototype, "set", null);
    __decorate([
        action
    ], FieldState.prototype, "reset", null);
    __decorate([
        observable.ref
    ], FieldState.prototype, "validation", void 0);
    __decorate([
        observable.ref
    ], FieldState.prototype, "shouldDisableValidation", void 0);
    __decorate([
        computed
    ], FieldState.prototype, "validationDisabled", null);
    __decorate([
        action
    ], FieldState.prototype, "disableValidationWhen", null);
    return FieldState;
}(Disposable));
export default FieldState;
//# sourceMappingURL=fieldState.js.map