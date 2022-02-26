---
title: Validator
order: 3
toc: menu
---

### Validator

A validator is a function, which takes current value as input, and returns the validation result as output. Here are some examples:

```ts
function required(value: unknown) {
  return value == null && 'Required!'
}

const notEmpty = (value: string) => value === '' ? 'Should not be empty!' : null

function validateUsername(value: string) {
  if (value === '') return 'Please input username!'
  if (value.length > 10) return 'Too long username!'
  if (!/[a-zA-Z\d]+/.test(value)) return 'Invalid username!'
}
```

In a validator, we check the input value to see if it's valid. If invalid, we return a message for that. Defining validation logic as such standalone functions has benefits: they are easy to reuse and easy to test.

### Validation Result

```ts
/** Result of validation. */
export type ValidationResult =
  string
  | null
  | undefined
  | false

/** Return value of validator. */
export type ValidatorResult = 
  ValidationResult
  | Promise<ValidationResult>
```

A normal validation result can be one of these two types:

1. A falsy value, such as `""`, `null`, `undefined`, `false`. This indicates that the input value is valid.
2. A non-empty string value, such as `"Required!"`. This indicates that the input value is invalid, and the string value will be used as a meesage to notify the current user.

If the validation process is async, a validator—we call it "async validator"—can return a `Promise`. The promise is expected to be resolved with an normal validation result. And the value will be treated the same way: non-empty `string` value means invalid and falsy value means valid.

### Built-in Validators

Unlike many other form-related libraries, formstate-x provides no built-in validators.

Any function satisfies the definition above can be used as a validator for formstate-x. So it's easy integrate tools like [validator.js](https://github.com/validatorjs/validator.js) or [async-validator](https://github.com/yiminghe/async-validator). It's also super easy to define your own basic validators and compose them. That's why we believe a built-in validator set is not important.
