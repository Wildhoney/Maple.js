import Component from './components/Component.js';

(function main($window) {

    "use strict";

    /**
     * @module Maple
     * @link https://github.com/Wildhoney/Maple.js
     * @author Adam Timberlake
     */
    class Maple {

        /**
         * @constructor
         * @param {Array} modules
         * @return {void}
         */
        constructor(...modules) {

            document.addEventListener('DOMContentLoaded', () => {

                let _component = new Component(true);
                _component.register(...modules);

            });

        }

    }

    $window.Maple = Maple;

})(window);