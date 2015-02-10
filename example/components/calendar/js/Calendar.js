(function main($module) {

    "use strict";

    import Events from '../../../Events.js';

    $module.template('Calendar', {

        /**
         * @property mixins
         * @type {Array}
         */
        //mixins: ['DeleteUsers'],

        /**
         * @constructor
         * @return {Object}
         */
        constructor() {
            this.emit(Events.DIARY_DELETE);
            this.super.constructor();
        },

        /**
         * @method deleteUser
         * @return {void}
         */
        deleteUser() {
            this.emit(Events.DIARY_DELETE, this.users[0]);
        }

    });

})(maple.module('exampleApp'));