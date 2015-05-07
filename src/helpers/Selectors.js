import utility from './Utility.js';

/**
 * @method queryAll
 * @param {String} expression
 * @return {Array}
 */
let queryAll = (expression) => {
    "use strict";
    return utility.toArray(this.querySelectorAll(expression));
};

export default (function main() {

    "use strict";

    return {

        /**
         * @method getExternalStyles
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getExternalStyles(element) {
            return queryAll.call(element, 'link[type="text/css"]');
        },

        /**
         * @method getInlineStyles
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getInlineStyles(element) {
            return queryAll.call(element, 'style[type="text/css"]');
        },

        /**
         * @mmethod getLinks
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getLinks(element) {
            return queryAll.call(element, 'link[rel="import"]');
        },

        /**
         * @method getScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getScripts(element) {

            let jsFiles  = queryAll.call(element, 'script[type="text/javascript"]');
            let jsxFiles = queryAll.call(element, 'script[type="text/jsx"]');

            return [].concat(utility.toArray(jsFiles), utility.toArray(jsxFiles));

        }

    };

})();