(function main($window) {

    "use strict";

    /**
     * @module Maple
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/Maple.js
     */
    class Maple {

    }

    /**
     * @module Maple
     * @submodule Component
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/Maple.js
     */
    class MapleComponent extends React.Component {

        /**
         * @constructor
         * @param {String} name
         * @param {Object} componentClass
         * @return {MapleComponent}
         */
        constructor(name, componentClass) {

            //React.render(component, document.querySelector('body'));
            this.registerElement(name, componentClass);

        }

        /**
         * @method registerElement
         * @param {String} name
         * @param {Object} componentClass
         * @return {void}
         */
        registerElement(name, componentClass) {

            var prototype = Object.create(HTMLElement.prototype, {

                createdCallback: {

                    value: function value() {

                        let element    = React.createElement(componentClass),
                            component  = React.render(element, this),
                            domNode    = React.findDOMNode(component),
                            shadowRoot = domNode.parentNode.createShadowRoot();

                        shadowRoot.appendChild(domNode);

                    }

                }

            });

            /**
             * @property MegaButton
             * @type {Object}
             */
            document.registerElement(name, {
                prototype: prototype
            });

        }

    }

    $window.Maple           = Maple;
    $window.Maple.Component = MapleComponent;

})(window);