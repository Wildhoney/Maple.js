import modular from './internals/Modular.js';

(function main($window) {

    "use strict";

    /**
     * @module Maple
     * @author Adam Timberlake
     * @link https://github.com/maplejs/framework
     * @constructor
     */
    function Maple() {}

    /**
     * @property prototype
     * @type {Object}
     */
    Maple.prototype = {

        /**
         * @property _modules
         * @type {Object}
         * @private
         */
        _modules: {},

        /**
         * @method throwException
         * @param {String} message
         */
        throwException: function throwException(message) {
            throw `Maple: ${message}.`;
        },

        /**
         * @method module
         * @param {String} name
         * @param {Array} dependencies
         * @return {Object}
         */
        module: function module(name, dependencies) {

            if (Array.isArray(dependencies)) {
                this._modules[name] = modular.setup(name, dependencies);
            }

            if (!this._modules.hasOwnProperty(name)) {
                this.throwException(`Module "${name}" does not exist`);
            }

            return this._modules[name];

        }

    };

    // It's time to throw everything to the devil and go to Kislovodsk.
    $window.maple = new Maple();

})(window);