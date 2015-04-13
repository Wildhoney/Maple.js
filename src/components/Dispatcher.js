/**
 * @module Maple
 * @submodule Dispatcher
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */
export default class Dispatcher {

    /**
     * @constructor
     * @return {Dispatcher}
     */
    constructor() {
        this.events = {};
    }

    /**
     * @method addEventListener
     * @param {String} name
     * @param {Object} [options={}]
     * @return {void}
     */
    addEventListener(name, options = { reference: null, callback: () => {} }) {

        if (this.events[name]) {
            this.events[name] = [];
        }

        this.events[name].push(options);

    }

    /**
     * @method removeEventListener
     * @param {String} name
     * @param {Object} reference
     * @return {void}
     */
    removeEventListener(name, reference) {

    }

}