export default (function main() {

    "use strict";

    /**
     * @constant WAIT_TIMEOUT
     * @type {Number}
     */
    const WAIT_TIMEOUT = 30000;

    return {

        /**
         * @method pathResolver
         * @param {HTMLDocument} ownerDocument
         * @param {String} url
         * @return {Object}
         */
        pathResolver(ownerDocument, url) {

            let componentPath = this.getPath(url),
                getPath       = this.getPath.bind(this);

            /**
             * @method resolvePath
             * @param {String} path
             * @param {HTMLDocument} overrideDocument
             * @return {String}
             */
            function resolvePath(path, overrideDocument = document) {
                var a  = overrideDocument.createElement('a');
                a.href = path;
                return a.href;
            }

            return {

                /**
                 * @method getPath
                 * @param {String} path
                 * @return {String}
                 */
                getPath(path) {

                    if (this.isLocalPath(path)) {
                        return `${this.getAbsolutePath()}/${path}`;
                    }

                    return resolvePath(path, document);

                },

                /**
                 * @method getAbsolutePath
                 * @return {String}
                 */
                getAbsolutePath() {
                    return resolvePath(componentPath);
                },

                /**
                 * @method getRelativePath
                 * @return {String}
                 */
                getRelativePath() {
                    return componentPath;
                },

                /**
                 * @method isLocalPath
                 * @param path {String}
                 * @return {Boolean}
                 */
                isLocalPath(path) {
                    path = getPath(resolvePath(path, ownerDocument));
                    return !!~resolvePath(componentPath).indexOf(path);
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

        /**
         * @method flattenArray
         * @param {Array} arr
         * @param {Array} [givenArr=[]]
         */
        flattenArray(arr, givenArr = []) {

            /* jshint ignore:start */

            arr.forEach((item) => {
                (Array.isArray(item)) && (this.flattenArray(item, givenArr));
                (!Array.isArray(item)) && (givenArr.push(item));
            });

            /* jshint ignore:end */

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