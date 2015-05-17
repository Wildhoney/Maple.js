import utility from './Utility.js';

/**
 * @method queryAll
 * @param {String} expression
 * @return {Array}
 */
let queryAll = function queryAll(expression) {
    "use strict";
    return utility.toArray(this.querySelectorAll(expression));
};

export default (function main() {

    "use strict";

    return {

        /**
         * @method getCSSLinks
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getCSSLinks(element) {
            return queryAll.call(element, 'link[type="text/css"],link[type="text/scss"]');
        },

        /**
         * @method getCSSInlines
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getCSSInlines(element) {
            return queryAll.call(element, 'style[type="text/css"]');
        },

        /**
         * @method getImports
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getImports(element) {
            return queryAll.call(element, 'link[rel="import"]:not([data-ignore])');
        },

        /**
         * @method getTemplates
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getTemplates(element) {
            return queryAll.call(element, 'template[ref]');
        },

        /**
         * @method getScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getScripts(element) {
            return queryAll.call(element, 'script[type="text/javascript"]');
        },

        /**
         * @method getAllScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getAllScripts(element) {
            let jsxFiles = queryAll.call(element, 'script[type="text/jsx"]');
            return [].concat(utility.toArray(this.getScripts(element)), utility.toArray(jsxFiles));
        }

    };

})();