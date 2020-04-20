"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Validate status. */
var ValidateStatus;
(function (ValidateStatus) {
    /** (need validation but) not validated */
    ValidateStatus[ValidateStatus["NotValidated"] = 0] = "NotValidated";
    /** current validation ongoing */
    ValidateStatus[ValidateStatus["Validating"] = 1] = "Validating";
    /** current validation finished */
    ValidateStatus[ValidateStatus["Validated"] = 2] = "Validated"; // 校验完成
})(ValidateStatus = exports.ValidateStatus || (exports.ValidateStatus = {}));
//# sourceMappingURL=types.js.map