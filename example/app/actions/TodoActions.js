(function main($app) {

    "use strict";

    function TodoActions() {}

    TodoActions.prototype = {
        addTodo: function addTodo(text) {
            this.dispatch(text);
        }
    };

    $app.actions.todoActions = $app.alt.createActions(TodoActions);

})(window.app);