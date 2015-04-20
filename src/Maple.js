import Register  from './components/Register.js';

(function main($window, $document) {

    "use strict";

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
    }

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
                new Register(...modules);
            });

        }

    }

    $window.Maple = Maple;

})(window, document);