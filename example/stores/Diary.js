(function main($maple) {

    "use strict";

    import http from 'maple/http';
    import Events from '../Events.js';

    $maple.module('exampleApp').store('User', {

        /**
         * @property events
         * @type {Object}
         */
        events: {
            getDiary: [Events.DIARY_GET]
        },

        /**
         * @method getDiary
         * @param [includeDeleted=true] {Boolean}
         * @return {void}
         */
        getDiary(includeDeleted = true) {
            return this.emit(Events.DIARY_PUT, [{}, {}, {}]);
        }

    });

})(window.maple);