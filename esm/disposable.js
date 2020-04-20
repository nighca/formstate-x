/**
 * Class that collects side-effects and dispose them on demand.
 */
var Disposable = /** @class */ (function () {
    function Disposable() {
        /**
         * Array of disposers.
         */
        this.disposers = [];
        this.dispose = this.dispose.bind(this);
    }
    /**
     * Collect the disposer function.
     */
    Disposable.prototype.addDisposer = function (disposer) {
        this.disposers.push(disposer);
    };
    /**
     * Do dispose by calling all disposer functions.
     */
    Disposable.prototype.dispose = function () {
        this.disposers.forEach(function (disposer) { return disposer(); });
        this.disposers = [];
    };
    return Disposable;
}());
export default Disposable;
//# sourceMappingURL=disposable.js.map