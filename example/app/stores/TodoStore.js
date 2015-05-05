(function main($app) {

    "use strict";

    function TodoStore() {

        this.todoItems = [
            { text: 'Take out the dirty dishes.', date: Date.now(), complete: false },
            { text: 'Bring in the clothes from the line.', date: Date.now(), complete: false },
            { text: 'Get curry powder from Waitrose.', date: Date.now(), complete: false }
        ];

        this.bindListeners({
            handleAddTodo: $app.actions.todoActions.ADD_TODO
        });

    }

    TodoStore.prototype = {

        handleAddTodo: function handleAddTodo(items) {
            this.items = items;
        }

    };

    $app.stores.todoStore = $app.alt.createStore(TodoStore, 'TodoStore');

})(window.app);