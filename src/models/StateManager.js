/**
 * @constant State
 * @type {{UNRESOLVED: number, RESOLVING: number, RESOLVED: number}}
 */
export const State = { UNRESOLVED: 0, RESOLVING: 1, RESOLVED: 2 };

/**
 * @module Maple
 * @submodule StateManager
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */
export class StateManager {

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