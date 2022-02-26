---
title: State
order: 2
toc: menu
---

### State

A formstate-x state is a object which holds state (value, error, etc.) for a input.

In formstate-x, there are more than one state types (such as `FieldState`, `FormState`, `TransformedState`, ...), while all of them implemented the same interface `IState`. Here is the interface definition:

```ts
/** interface for State */
export interface IState<V> {
  /** Value in the state. */
  value: V
  /** If value has been touched. */
  dirty: boolean
  /** The error info of validation. */
  error: Error
  /** If the state contains error. */
  hasError: boolean
  /** The state's own error info, regardless of child states. */
  ownError: Error
  /** If the state contains its own error info. */
  hasOwnError: boolean
  /** If activated (with auto-validation). */
  activated: boolean
  /** Current validate status. */
  validateStatus: ValidateStatus
  /** If the state is doing a validation. */
  validating: boolean
  /**
   * If the validation has been done.
   * It does not mean validation passed.
   */
  validated: boolean
  /** Fire a validation behavior. */
  validate(): Promise<ValidateResult<V>>
  /** Set `value` on change event. */
  onChange(value: V): void
  /** Set `value` imperatively. */
  set(value: V): void
  /** Reset to initial status. */
  reset(): void
  /** Append validator(s). */
  withValidator(...validators: Array<Validator<V>>): this
  /**
   * Configure when state will be disabled, which means:
   * - corresponding UI is invisible or disabled
   * - state value do not need to (and will not) be validated
   * - state `onChange` will not be called
   * - no error info will be provided
   */
  disableWhen(predictFn: () => boolean): this
  /** Do dispose */
  dispose(): void
}
```

### Composability

Like inputs, states are composable.

A state may be composed with multiple child states. Its value should be composition of these child states' values and its validation result should reflect all its child states' validation results.

A state for a complex input can be composed with its child inputs' states.

A state for a list input can be composed with its item inputs' states.

A form, which includes multiple inputs, can be considered as a complex input with a submit button. We use a formstate-x state to hold state for a form. The state for a form can be composed with its inputs' states.

### Value

A state holds the current value, and provides methods to change it.

A input component is expected to get state from its props. The component read the value for rendering and set the value when user interacts.

The input component's consumer is expected to create the state and hold it. By passing it to the input component, the consumer get the ability to "control" the input component.

The consumer may also read value from the state for other purposes. Typically, when a user clicks the submit button, from its state a form reads the whole value for submitting (maybe sending an HTTP request).

### Validation

Validation is the process of validating user input values.

Typically validation result is important for cases like:

* When user inputs, we display error tips if validation not passed, so users see that and correct the input
* Before form submiiting, we check if all value is valid, so invalid requests to the server can be avoided

That's why validation should provide such features:

* It should run automatically, when users changed the value, or when some other data change influcend the value validity
* It should produce details such as a meaningful message, so users can get friendly hint

With formstate-x, we define validators and append them to states. formstate-x will do the rest for us. For more details about validators, check section [Validator](/concepts/validator).

### Activated

It's not user-friendly to notify a user for inputs he hasn't interact with.

Most forms start with every input empty—which is obviously invalid. While it's not appropriate to show error tips at the beginning.

That's why there's a boolean field `activated` for states.

States will not be auto-validated until it is **activated**. And they will be activated in two situations:

1. Value changed by user interactions (method `onChange()` is called). 
2. State imperatively validated (method `validate()` is called).

### Own Error

`ownError` & `hasOwnError` are special fields especially for composed states. You can check details about them in issue [#71](https://github.com/qiniu/formstate-x/issues/71).