import Component from './components/Component.js';
import modular   from './helpers/Modular.js';

(function main($window) {

    "use strict";

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

})(window);