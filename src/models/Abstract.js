export const State = { UNRESOLVED: 0, RESOLVING: 1, RESOLVED: 2 };

export class Abstract {

    /**
     * @constructor
     * @return {Abstract}
     */
    constructor() {
        this.state = State.UNRESOLVED;
    }

    /**
     * @method setState
     * @param {Number} state
     * @return {void}
     */
    setState(state) {
        this.state = state;
    }

}