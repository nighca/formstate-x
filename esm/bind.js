export function bindInput(state, getValue) {
    return {
        value: state._value,
        // TODO: cache onChange
        onChange: function (arg) { return state.onChange(getValue ? getValue(arg) : arg); }
    };
}
//# sourceMappingURL=bind.js.map