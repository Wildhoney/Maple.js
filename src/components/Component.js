/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */
export default class Component extends React.Component {

    /**
     * @constructor
     * @param {String} name
     * @return {Component}
     */
    addEventListener(name) {

        this.props.dispatcher.addEventListener(name, { reference: this, callback: (event) => {
            return event;
        }});

    }

    /**
     * @method removeEventListener
     * @param {String} name
     * @return {void}
     */
    removeEventListener(name) {
        this.props.dispatcher.removeEventListener(name, this);
    }

}