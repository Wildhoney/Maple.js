(function main($app) {

    "use strict";

    /**
     * @property TodoStore
     * @type {Object}
     */
    var TodoStore = function() {

        /**
         * @method items
         * @type {Array}
         */
        this.items = [
            { text: 'Hang out the dirty dishes.', date: Date.now(), complete: false },
            { text: 'Plead neighbours for my sugar back.', date: Date.now(), complete: false },
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
         * @method onRemove
         * @param {Object} model
         * @return {void}
         */
        this.onRemove = function onRemove(model) {
            var indexOf = this.items.indexOf(model);
            this.items.splice(indexOf, 1);
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