import { Disposer } from './types';
/**
 * Class that collects side-effects and dispose them on demand.
 */
export default class Disposable {
    /**
     * Array of disposers.
     */
    private disposers;
    /**
     * Collect the disposer function.
     */
    protected addDisposer(disposer: Disposer): void;
    /**
     * Do dispose by calling all disposer functions.
     */
    dispose(): void;
    constructor();
}
