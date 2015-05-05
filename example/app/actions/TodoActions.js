(function main($app) {

    "use strict";

    /**
     * @constructor
     * @return {TodoActions}
     */
    function TodoActions() {}

    /**
     * @property prototype
     * @type {Object}
     */
    TodoActions.prototype = {

        /**
         * @method addTodo
         * @param {String} text
         * @return {void}
         */
        addTodo: function addTodo(text) {
            this.dispatch(text);
        }

    };

    $app.actions.todoActions = $app.alt.createActions(TodoActions);

})(window.app);