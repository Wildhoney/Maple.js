(function main($window) {

    "use strict";

    /**
     * @constant options
     * @type {Object}
     */
    const options = {
        linkSelector: 'link[type="text/css"]',
        importSelector: 'link[rel="import"]',
        dataAttribute: 'data-component',
        dataElement: 'html'
    };

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
         * @method register
         * @param {String} name
         * @param {Object} blueprint
         * @return {void}
         */
        register(name, blueprint) {

            let element         = React.createClass(blueprint);
            this.elements[name] = this.createElement(name, React.createElement(element));

        }

        /**
         * @method associateCSS
         * @param {String} name
         * @param {Document} ownerDocument
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associateCSS(name, ownerDocument, shadowRoot) {

            console.log(ownerDocument);

        }

        /**
         * @method createElement
         * @param {String} name
         * @param {Object} element
         * @return {void}
         */
        createElement(name, element) {

            let ownerDocument = document.currentScript.ownerDocument,
                associateCSS  = this.associateCSS.bind(this, name, ownerDocument);

            let elementPrototype = Object.create(HTMLElement.prototype, {

                /**
                 * @property createdCallback
                 * @type {Object}
                 */
                createdCallback: {

                    /**
                     * @method value
                     * @return {void}
                     */
                    value: function value() {

                        this.innerHTML = '';

                        ownerDocument.querySelector(options.dataElement).setAttribute(options.dataAttribute, name);

                        let contentElement = document.createElement('content'),
                            shadowRoot     = this.createShadowRoot();

                        shadowRoot.appendChild(contentElement);
                        React.render(element, contentElement);
                        associateCSS(shadowRoot);

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