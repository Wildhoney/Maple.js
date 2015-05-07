export default (function main($console) {

    "use strict";

    return {

        /**
         * @method warn
         * @param {String} message
         * @return {void}
         */
        warn(message) {
            $console.log(`Maple.js: %c${message}.`, 'color: #dd4b39');
        },

        /**
         * @method info
         * @param {String} message
         * @return {void}
         */
        info(message) {
            $console.log(`Maple.js: %c${message}.`, 'color: blue');
        },

        /**
         * @method error
         * @param {String} message
         * @return {void}
         */
        error(message) {
            $console.log(`Maple.js: %c${message}.`, 'color: orange');
        }

    };

})(window.console);