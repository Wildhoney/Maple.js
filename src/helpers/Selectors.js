import utility from './Utility.js';

export default (function main() {

    "use strict";

    return {

        /**
         * @method getExternalStyles
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getExternalStyles(element) {
            return utility.toArray(element.querySelectorAll('link[type="text/css"]'));
        },

        /**
         * @method getInlineStyles
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getInlineStyles(element) {
            return utility.toArray(element.querySelectorAll('link[type="text/css"]'));
        },

        /**
         * @method getScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getScripts(element) {

            let jsFiles  = element.querySelectorAll('script[type="text/javascript"]');
            let jsxFiles = element.querySelectorAll('script[type="text/jsx"]');

            return [].concat(utility.toArray(jsFiles), utility.toArray(jsxFiles));

        }

    };

})();