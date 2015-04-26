export default (function main() {

    "use strict";

    return {

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray(arrayLike) {
            return Array.from ? Array.from(arrayLike) : Array.prototype.slice.apply(arrayLike);
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
         * @method getBase
         * @param {String} name
         * @return {String}
         */
        getBase(name) {
            return name.split('.').slice(0, -1).join('/');
        },

        /**
         * @method modulePath
         * @param {String} importPath
         * @return {String}
         */
        modulePath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        },

        /**
         * @method moduleName
         * @param {String} importPath
         * @return {String}
         */
        moduleName(importPath) {
            return importPath.split('/').slice(0, -1).pop();
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