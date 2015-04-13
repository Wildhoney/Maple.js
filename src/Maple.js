import Component from './components/Component.js';
import Register  from './components/Register.js';

(function main($window, $document) {

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

            $document.addEventListener('DOMContentLoaded', () => {

                let register = new Register(...modules);

            });

        }

    }

    $window.Maple           = Maple;
    $window.Maple.Component = Component;

})(window, document);