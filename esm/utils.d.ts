import { Validator, ValidationResponse, ValidatorResponse } from "./types";
export declare function isPromiseLike(arg: any): arg is Promise<any>;
export declare function isEmpty(response: ValidationResponse): boolean;
export declare function asyncResponsesAnd(asyncResponses: Array<Promise<ValidationResponse>>): ValidatorResponse;
export declare function applyValidators<TValue>(value: TValue, validators: Validator<TValue>[]): ValidatorResponse;
export declare function debounce(fn: () => void, delay: number): () => void;
