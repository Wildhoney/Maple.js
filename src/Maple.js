(function main($window) {

    "use strict";

    /**
     * @module Maple
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/Maple.js
     */
    class Maple {

        /**
         * @method render
         * @param {Object} element
         * @param {String} name
         * @return {Object}
         */
        render(element, name) {
            this.registerElement(element, name);
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

    $window.Maple = new Maple();

})(window);