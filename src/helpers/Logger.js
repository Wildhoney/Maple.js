export default (function main($console) {

    "use strict";

    return {

        /**
         * @method warn
         * @param {String} message
         * @return {void}
         */
        warn(message) {
            $console.log(`%cMaple.js: %c${message}.`, 'color: rgba(0, 0, 0, .5)', 'color: #5F9EA0');
        },

        /**
         * @method info
         * @param {String} message
         * @return {void}
         */
        info(message) {
            $console.log(`%cMaple.js: %c${message}.`, 'color: rgba(0, 0, 0, .5)', 'color: #008DDB');
        },

        /**
         * @method error
         * @param {String} message
         * @return {void}
         */
        error(message) {
            $console.log(`%cMaple.js: %c${message}.`, 'color: rgba(0, 0, 0, .5)', 'color: #CD6090');
        }

    };

})(window.console);