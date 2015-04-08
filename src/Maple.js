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
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
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
         * @param {Document} ownerDocument
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associateCSS(ownerDocument, shadowRoot) {

            this.toArray(document.querySelectorAll('link')).forEach((link) => {

                if (link.import === ownerDocument) {

                    let path            = link.getAttribute('href').split('/').slice(0, -1).join('/'),
                        templateElement = ownerDocument.querySelector('template').content,
                        cssDocuments    = this.toArray(templateElement.querySelectorAll(options.linkSelector)).map((model) => {
                            return `${path}/${model.getAttribute('href')}`;
                        });

                    cssDocuments.forEach((cssDocument) => {

                        let styleElement = document.createElement('style');
                        styleElement.setAttribute('type', 'text/css');
                        styleElement.innerHTML = `@import url(${cssDocument})`;
                        shadowRoot.appendChild(styleElement);

                    });

                }

            });

        }

        /**
         * @method createElement
         * @param {String} name
         * @param {Object} element
         * @return {void}
         */
        createElement(name, element) {

            let ownerDocument    = document.currentScript.ownerDocument,
                associateCSS     = this.associateCSS.bind(this, ownerDocument),
                elementPrototype = Object.create(HTMLElement.prototype, {

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

                        let contentElement = document.createElement('content'),
                            shadowRoot     = this.createShadowRoot();

                        associateCSS(shadowRoot);
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