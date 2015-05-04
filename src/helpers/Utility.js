export default (function main() {

    "use strict";

    /**
     * @constant WAIT_TIMEOUT
     * @type {Number}
     */
    const WAIT_TIMEOUT = 30000;

    /**
     * @constant LOCAL_MATCHER
     * @type {String}
     */
    const LOCAL_MATCHER = '../';

    return {

        /**
         * @method pathResolver
         * @param {HTMLDocument} ownerDocument
         * @param {String} url
         * @param {String} componentPath
         * @return {String}
         */
        pathResolver(ownerDocument, url, componentPath) {

            return {

                /**
                 * @method getPath
                 * @return {String}
                 */
                getPath() {

                    var a  = ownerDocument.createElement('a');
                    a.href = url;

                    if (~a.href.indexOf(componentPath)) {
                        return a.href;
                    }

                    a      = document.createElement('a');
                    a.href = url;
                    return a.href;

                }

            }

        },

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray(arrayLike) {
            return Array.from ? Array.from(arrayLike) : Array.prototype.slice.apply(arrayLike);
        },

        flattenArray(arr, givenArr = []) {

            arr.forEach((item) => {
                (Array.isArray(item)) && (this.flattenArray(item, givenArr));
                (!Array.isArray(item)) && (givenArr.push(item));
            });

            return givenArr;

        },

        /**
         * @method timeoutPromise
         * @param {Function} reject
         * @param {String} errorMessage
         * @param {Number} [timeout=WAIT_TIMEOUT]
         * @return {void}
         */
        timeoutPromise(reject, errorMessage = 'Timeout', timeout = WAIT_TIMEOUT) {
            setTimeout(() => reject(new Error(errorMessage)), timeout);
        },

        /**
         * @method toSnakeCase
         * @param {String} camelCase
         * @param {String} [joiner='-']
         * @return {String}
         */
        toSnakeCase(camelCase, joiner = '-') {
            return camelCase.split(/([A-Z][a-z]{0,})/g).filter(parts => parts).join(joiner).toLowerCase();
        },

        /**
         * @method getName
         * @param {String} importPath
         * @return {String}
         */
        getName(importPath) {
            return importPath.split('/').slice(0, -1).pop();
        },

        /**
         * @method getPath
         * @param {String} importPath
         * @return {String}
         */
        getPath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        },

        /**
         * @method removeExtension
         * @param {String} filePath
         * @return {String}
         */
        removeExtension(filePath) {
            return filePath.split('.').slice(0, -1).join('.');
        }

    };

})();