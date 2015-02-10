import MapleModule    from './internals/Modular.js';
import MapleTemplate  from './components/Template.js';
import MapleException from './internals/Exception.js';

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
         * @method createModule
         * @param {String} name
         * @param {Array} dependencies
         * @return {Object}
         */
        createModule: function createModule(name, dependencies) {

            if (Array.isArray(dependencies)) {

                if (this._modules.hasOwnProperty(name)) {
                    MapleException.throwException(`Module "${name}" has already been registered`);
                }

                // Register our module!
                this._modules[name] = new MapleModule(name, dependencies);

            }

            if (!this._modules.hasOwnProperty(name)) {
                MapleException.throwException(`Module "${name}" does not exist`);
            }

            return this._modules[name];

        }

    };

    // It's time to throw everything to the devil and go to Kislovodsk.
    $window.maple = new Maple();

})(window);