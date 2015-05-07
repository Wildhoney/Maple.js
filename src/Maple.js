import Module    from './models/Module.js';
import selectors from './helpers/Selectors.js';
import events    from './helpers/Events.js';

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
        let readyStates = ['interactive', 'complete'];
        return (!HAS_INITIATED && ~readyStates.indexOf(state));
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
         * Responsible for finding all of the external link elements, as well as the inline template elements
         * that can be handcrafted, or baked into the HTML document when compiling a project.
         *
         * @method findComponents
         * @return {void}
         */
        findComponents() {

            selectors.getLinks($document).forEach((linkElement) => {

                if (linkElement.import) {
                    return void new Module(linkElement);
                }

                linkElement.addEventListener('load', () => new Module(linkElement));

            });

            selectors.getTemplates($document).forEach((templateElement) => {
                new Module(templateElement);
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