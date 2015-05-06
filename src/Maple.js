import Module  from './models/Module.js';
import utility from './helpers/Utility.js';
import events  from './helpers/Events.js';

(function main($window, $document) {

    "use strict";

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
    }

    /**
     * @constant HAS_INITIATED
     * @type {Boolean}
     */
    let HAS_INITIATED = false;

    /**
     * @method isReady
     * @param {String} state
     * @return {Boolean}
     */
    function isReady(state) {
        return (!HAS_INITIATED && (state === 'interactive' || state === 'complete'));
    }

    /**
     * @module Maple
     * @link https://github.com/Wildhoney/Maple.js
     * @author Adam Timberlake
     */
    class Maple {

        /**
         * @constructor
         * @return {void}
         */
        constructor() {
            HAS_INITIATED = true;
            this.findComponents();
        }

        /**
         * @method findComponents
         * @return {void}
         */
        findComponents() {

            var linkElements = utility.toArray($document.querySelectorAll('link[rel="import"]'));

            linkElements.forEach((linkElement) => {

                if (linkElement.import) {
                    return void new Module(linkElement);
                }

                linkElement.addEventListener('load', () => new Module(linkElement));

            });

            // Configure the event delegation mappings.
            events.setupDelegation();

        }

    }

    // Support for the "async" attribute on the Maple script element.
    if (isReady($document.readyState)) {
        new Maple();
    }

    // No documents, no person.
    $document.addEventListener('DOMContentLoaded', () => new Maple());

})(window, document);