export default (function main() {

    "use strict";

    return {

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
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        },

        /**
         * @method getImportPath
         * @param {String} importPath
         * @return {String}
         */
        getImportPath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        }

    };

})();