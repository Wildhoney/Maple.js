(function main($module) {

    "use strict";

    //class TodoActions {
    //    updateTodo(id, text) {
    //        this.dispatch({ id: id, text: text });
    //    }
    //}

    function TodoActions() {}
    TodoActions.prototype = {
        updateTodo(id, text) {
            this.dispatch({ id: id, text: text });
        }
    };

    $module.actions.TodoActions = $module.alt.createActions(TodoActions);

})(window.alt);