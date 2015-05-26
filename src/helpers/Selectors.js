import utility from './Utility.js';

/**
 * @method queryAll
 * @param {String} expression
 * @return {Array}
 */
let queryAll = function queryAll(expression) {

    "use strict";

    expression = Array.isArray(expression) ? expression.join(',') : expression;
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
            return queryAll.call(element, 'link[rel="stylesheet"]');
        },

        /**
         * @method getCSSInlines
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getCSSInlines(element) {
            return queryAll.call(element, ['style[type="text/css"]', 'style:not([type])']);
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

            var selectors = ['script[type="text/javascript"]', 'script[type="application/javascript"]',
                             'script[type="text/ecmascript"]', 'script[type="application/ecmascript"]', 'script:not([type])'];

            return queryAll.call(element, selectors);

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