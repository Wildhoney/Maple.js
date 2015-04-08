(function main($window) {

    "use strict";

    /**
     * @module Maple
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/Maple.js
     */
    class Maple {

        /**
         * @constructor
         * @return {Maple}
         */
        constructor() {
            this.elements = [];
        }

        /**
         * @method throwException
         * @throws Error
         * @param {String} message
         * @return {void}
         */
        throwException(message) {
            throw new Error(`Maple.js: ${message}.`);
        }

        /**
         * @method render
         * @param {Object} element
         * @param {String} name
         * @return {Object}
         */
        render(element, name) {

            if (this.elements[name] !== 'undefined') {
                throw new Error(`Custom element ${name} already exists`);
            }

            // Register the custom element.
            this.elements[name] = this.registerElement(element, name);

        }

        /**
         * @method registerElement
         * @param {Object} element
         * @param {String} name
         * @return {void}
         */
        registerElement(element, name) {

            let elementPrototype = Object.create(HTMLElement.prototype, {

                createdCallback: {

                    value: function value() {

                        this.innerHTML = '';

                        let contentElement = document.createElement('content'),
                            shadowRoot     = this.createShadowRoot();

                        shadowRoot.appendChild(contentElement);
                        React.render(element, contentElement);

                    }

                }

            });

            /**
             * @property MegaButton
             * @type {Object}
             */
            document.registerElement(name, {
                prototype: elementPrototype
            });

        }

    }

    $window.maple = new Maple();

})(window);