(function main($maple) {

    "use strict";

    /**
     * @class TodoList
     */
    export default class TodoList extends Maple.View {

        /**
         * @method mixins
         * @return {String[]}
         */
        mixins() {
            return ['DeleteUsers'];
        }

        /**
         * @constructor
         * @return {Object}
         */
        constructor() {
            this.emit($maple.EVENTS.USERS.GET);
            this.super.constructor();
        }

        /**
         * @method deleteUser
         * @return {void}
         */
        deleteUser() {
            this.emit($maple.EVENTS.USERS.DELETE, this.users[0]);
        }

    }

})(window.maple);