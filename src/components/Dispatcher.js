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

        this.events = [];

        setTimeout(() => this.fireEvent('people'), 2500);

    }

    /**
     * @method fireEvent
     * @param {String} name
     * @return {void}
     */
    fireEvent(name) {

        let eventFns = this.events.filter((event) => event.name === name),
            people   = ['Buster', 'Miss Kittens', 'Kipper', 'Splodge', 'Mango'];

        eventFns.forEach((event) => {
            event.reference.setState({ names: people.join(',') });
        });

    }

    /**
     * @method addEventListener
     * @param {String} name
     * @param {Object} [options={}]
     * @return {void}
     */
    addEventListener(name, options = { reference: null, callback: () => {} }) {

        this.events.push({
            name: name,
            reference: options.reference,
            callback: options.callback
        });

    }

    /**
     * @method removeEventListener
     * @param {String} name
     * @param {Object} reference
     * @return {void}
     */
    removeEventListener(name, reference) {
        return void { name, reference };
    }

}