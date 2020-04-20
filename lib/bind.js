"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bindInput(state, getValue) {
    return {
        value: state._value,
        // TODO: cache onChange
        onChange: function (arg) { return state.onChange(getValue ? getValue(arg) : arg); }
    };
}
exports.bindInput = bindInput;
//# sourceMappingURL=bind.js.map