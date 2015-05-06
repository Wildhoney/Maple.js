(function main($app) {

    "use strict";

    /**
     * @property TodoStore
     * @type {Object}
     */
    let TodoStore = function() {

        /**
         * @method items
         * @type {Array}
         */
        this.items = [
            { text: 'Take out the dirty dishes.', date: Date.now(), complete: false },
            { text: 'Bring in the clothes from the line.', date: Date.now(), complete: false },
            { text: 'Get curry powder from Waitrose.', date: Date.now(), complete: false }
        ];

        /**
         * @method onAdd
         * @param {Object} model
         * @return {void}
         */
        this.onAdd = function onAdd(model) {
            this.items.push(model);
        };

        /**
         * @method onToggleState
         * @param {Object} model
         */
        this.onToggleState = function onToggleState(model) {
            model.complete = !model.complete;
        };

        // Bind all of the actions!
        this.bindActions($app.actions.todoActions);

    };

    $app.stores.todoStore = $app.alt.createStore(TodoStore, 'TodoStore');

})(window.app);