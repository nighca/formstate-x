import { ComposibleValidatable, ValueOfFields, ValidationResponse, Validator, ValidateStatus } from './types';
import Disposable from './disposable';
/** Mode: object */
export declare type FieldsObject = {
    [key: string]: ComposibleValidatable<any>;
};
/** Mode: array */
export declare type FieldsArray = ComposibleValidatable<any>[];
/** Each key of the object is a validatable */
export declare type ValidatableFields = FieldsObject | FieldsArray;
/**
 * The state for a form (composition of fields).
 */
export default class FormState<TFields extends ValidatableFields, TValue = ValueOfFields<TFields>> extends Disposable implements ComposibleValidatable<TFields, TValue> {
    /**
     * Behavior mode: `object` or `array`
     */
    private mode;
    /**
     * If activated (with auto validate).
     * Form will only be activated when `validate()` called or some field activated.
     */
    _activated: boolean;
    /**
     * If value has been touched.
     */
    readonly dirty: boolean;
    /**
     * Fields.
     */
    $: TFields;
    /**
     * List of fields.
     */
    private readonly fields;
    /**
     * Value that can be consumed by your code.
     * It's a composition of fields' value.
     */
    readonly value: TValue;
    /**
     * The validate status.
     */
    _validateStatus: ValidateStatus;
    /**
     * If the state is doing a validation.
     */
    readonly validating: boolean;
    /**
     * The error info of form validation.
     */
    private _error?;
    /**
     * The error info of validation (including fields' error info).
     */
    readonly error: string | undefined;
    /**
     * If the state contains error.
     */
    readonly hasError: boolean;
    /**
     * If the validation has been done.
     * It does not means validation passed.
     */
    readonly validated: boolean;
    /**
     * Set error info of form.
     */
    setError(error: ValidationResponse): void;
    /**
     * List of validator functions.
     */
    private _validators;
    /**
     * Add validator function.
     */
    validators(...validators: Validator<TValue>[]): this;
    /**
     * 同步设置值
     * 这里 `FormState` 不提供 `set`，因为
     * 1. 如果 `set` 传入 fields（`$`），不够好用，意义不大
     * 2. 如果 `set` 传入 `value`，则 `FormState` 很难利用 `value` 还原 fields
     *    如 fields 是 `[field1, field2]`，传入 `value` 为 `[1, 2, 3]` 的情况，这里做不到依据 `3` 还原出其对应的 field
     */
    /**
     * Reset to initial status.
     */
    reset(): void;
    /**
     * Current validation info.
     */
    private validation?;
    /**
     * Do validation.
     */
    private _validate;
    /**
     * Fire a validation behavior.
     */
    validate(): Promise<{
        readonly hasError: true;
        readonly value?: undefined;
    } | {
        readonly hasError: false;
        readonly value: TValue;
    }>;
    /**
     * Method to check if we should disable validation.
     */
    private shouldDisableValidation;
    /** If validation disabled. */
    readonly validationDisabled: boolean;
    /**
     * Configure when to disable validation.
     */
    disableValidationWhen(predict: () => boolean): this;
    /**
     * Apply validation.
     */
    private applyValidation;
    constructor(initialFields: TFields);
}
