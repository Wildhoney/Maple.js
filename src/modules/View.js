(function main() {

    "use strict";

    import {Maple} from 'Event.js';

    /**
     * @module Maple
     * @submodule View
     * @author Adam Timberlake
     * @link https://github.com/maplejs/framework
     * @type {Object}
     */
    class View extends Maple {

        /**
         * @constructor
         * @return {Maple}
         */
        constructor() {

        }

        /**
         * @method name
         * @param name {String}
         * @param properties {Array}
         * @return {void}
         */
        emit(name, ...properties) {
            Maple.Event.emit();
        }

        /**
         * Re-renders the current view which can either by invoked by the developer, or invoked
         * automatically once an event has been received and its listeners invoked.
         *
         * @method render
         * @return {void}
         */
        render() {

        }

    }

    export default { Maple: View };

})();