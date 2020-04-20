import FieldState from './fieldState';
import FormState from './formState';
/** A truthy string or falsy values. */
export declare type ValidationResponse = string | null | undefined | false;
/** The return value of a validator. */
export declare type ValidatorResponse = ValidationResponse | Promise<ValidationResponse>;
export declare type Validated<TValue> = {
    value: TValue;
    response: ValidatorResponse;
};
/**
 * A validator simply takes a value and returns a string or Promise<string>
 * If a truthy string is returned it represents a validation error
 **/
export interface Validator<TValue> {
    (value: TValue): ValidatorResponse;
}
/** Validatable object. */
export interface Validatable<T, TValue = T> {
    $: T;
    value: TValue;
    hasError: boolean;
    error?: string | null | undefined;
    validating: boolean;
    validated: boolean;
    validationDisabled: boolean;
    validate(): Promise<{
        hasError: true;
    } | {
        hasError: false;
        value: TValue;
    }>;
}
/** Composible validatable object (which can be used as a field for `FormState`). */
export interface ComposibleValidatable<T, TValue = T> extends Validatable<T, TValue> {
    reset: () => void;
    dispose: () => void;
    dirty: boolean;
    _activated: boolean;
    _validateStatus: ValidateStatus;
}
/** Function to do dispose. */
export interface Disposer {
    (): void;
}
/** Value of `FieldState`. */
export declare type ValueOfFieldState<State> = (State extends FieldState<infer FieldType> ? FieldType : never);
/** Value Array of given Field. */
export interface ValueArrayOf<Field> extends Array<ValueOf<Field>> {
}
/** Value of object-fields. */
export declare type ValueOfObjectFields<Fields> = {
    [FieldKey in keyof Fields]: ValueOf<Fields[FieldKey]>;
};
/** Value of array-fields. */
export declare type ValueOfArrayFields<Fields> = (Fields extends Array<infer Field> ? ValueArrayOf<Field> : never);
/** Value of fields. */
export declare type ValueOfFields<Fields> = (Fields extends {
    [key: string]: ComposibleValidatable<any>;
} ? ValueOfObjectFields<Fields> : ValueOfArrayFields<Fields>);
/** Value of state (`FormState` or `FieldState`) */
export declare type ValueOf<State> = (State extends FormState<infer Fields> ? ValueOfFields<Fields> : ValueOfFieldState<State>);
/** Validate status. */
export declare enum ValidateStatus {
    /** (need validation but) not validated */
    NotValidated = 0,
    /** current validation ongoing */
    Validating = 1,
    /** current validation finished */
    Validated = 2
}
