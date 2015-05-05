(function main($app) {

    "use strict";

    /**
     * @property TodoStore
     * @type {Object}
     */
    let TodoStore = {

        /**
         * @method items
         * @type {Array}
         */
        items: [
            { text: 'Take out the dirty dishes.', date: Date.now(), complete: false },
            { text: 'Bring in the clothes from the line.', date: Date.now(), complete: false },
            { text: 'Get curry powder from Waitrose.', date: Date.now(), complete: false }
        ],

        /**
         * @method handleAddTodo
         * @param {Array} items
         * @return {void}
         */
        handleAddTodo: function handleAddTodo(items) {
            this.items = items;
        }

    };

    $app.stores.todoStore = $app.alt.createStore(TodoStore, 'TodoStore');

})(window.app);