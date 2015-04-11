import Component from './components/Component.js';
import modular   from './helpers/Modular.js';

(function main($window, $document) {

    class Maple {

        /**
         * @constructor
         * @param {Array} modules
         * @return {void}
         */
        constructor(...modules) {

            modular.register(...modules);

        }

    }

    $window.Maple           = Maple;
    $window.Maple.Component = Component;

})(window, document);

//(function main($window, $document) {
//
//    "use strict";
//
//    /**
//     * @module Maple
//     * @author Adam Timberlake
//     * @link https://github.com/Wildhoney/Maple.js
//     */
//    class Maple {
//
//        /**
//         * @constructor
//         * @return {Maple}
//         */
//        constructor() {
//            //this.elements = [];
//            //this.Component = new Component();
//        }
//
//        /**
//         * @method throwException
//         * @throws Error
//         * @param {String} message
//         * @return {void}
//         */
//        throwException(message) {
//            throw new Error(`Maple.js: ${message}.`);
//        }
//
//        /**
//         * @method component
//         * @param {String} name
//         * @param {Object} blueprint
//         * @return {void}
//         */
//        component(name, blueprint) {
//
//            let element         = React.createClass(blueprint);
//            this.elements[name] = this.createElement(name, React.createElement(element));
//
//        }
//
//        /**
//         * @method createElement
//         * @param {String} name
//         * @param {Object} element
//         * @return {void}
//         */
//        createElement(name, element) {
//
//            let ownerDocument    = $document.currentScript.ownerDocument,
//                elementPrototype = Object.create(HTMLElement.prototype, {
//
//                /**
//                 * @property createdCallback
//                 * @type {Object}
//                 */
//                createdCallback: {
//
//                    /**
//                     * @method value
//                     * @return {void}
//                     */
//                    value: function value() {
//
//                        this.innerHTML = '';
//
//                        let contentElement = ownerDocument.createElement('content'),
//                            shadowRoot     = this.createShadowRoot();
//
//                        css.associate(ownerDocument, shadowRoot);
//                        shadowRoot.appendChild(contentElement);
//
//                        let component = React.render(element, contentElement);
//                        events.delegate(contentElement, component);
//
//                    }
//
//                }
//
//            });
//
//            /**
//             * @property MegaButton
//             * @type {Object}
//             */
//            $document.registerElement(name, {
//                prototype: elementPrototype
//            });
//
//        }
//
//    }
//
//    $window.Maple           = new Maple();
//    $window.Maple.Component = new Component();
//
//})(window, document);