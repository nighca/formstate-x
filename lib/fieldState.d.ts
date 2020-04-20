import { ComposibleValidatable, Validator, ValidationResponse, ValidateStatus } from './types';
import Disposable from './disposable';
/**
 * The state for a field.
 */
export default class FieldState<TValue> extends Disposable implements ComposibleValidatable<TValue> {
    private initialValue;
    /**
     * If activated (with auto validation).
     * Field will only be activated when `validate()` or `onChange()` called.
     */
    _activated: boolean;
    /**
     * If value has been touched (different with `initialValue`)
     */
    readonly dirty: boolean;
    /**
     * Value that reacts to `onChange` immediately.
     * You should only use it to bind with UI input componnet.
     */
    _value: TValue;
    /**
     * Value that can be consumed by your code.
     * It's synced from `_value` with debounce of 200ms.
     */
    value: TValue;
    /**
     * Value that has bean validated with no error, AKA "safe".
     */
    $: TValue;
    /**
     * The validate status.
     */
    _validateStatus: ValidateStatus;
    /**
     * If the state is doing a validation.
     */
    readonly validating: boolean;
    /**
     * The original error info of validation.
     */
    _error?: string;
    /**
     * The error info of validation.
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
     * Set error info.
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
     * Set `_value` on change event.
     */
    onChange(value: TValue): void;
    /**
     * Set `value` (& `_value`) synchronously.
     */
    set(value: TValue): void;
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
    constructor(initialValue: TValue, delay?: number);
}
