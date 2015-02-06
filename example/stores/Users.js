(function main($maple) {

    "use strict";

    import http from 'maple/http';

    $maple.module('exampleApp').store('User', {

        /**
         * @property events
         * @type {Object}
         */
        events: {
            getUsers: [$maple.EVENTS.USERS.GET]
        },

        /**
         * @method getUsers
         * @param [includeDeleted=true] {Boolean}
         * @return {void}
         */
        getUsers(includeDeleted = true) {
            return this.emit($maple.EVENTS.USERS.RECEIVE, [{}, {}, {}]);
        }

    });

})(window.maple);