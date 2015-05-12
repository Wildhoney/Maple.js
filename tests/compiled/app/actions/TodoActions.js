(function main($app) {

    "use strict";

    /**
     * @property prototype
     * @type {Function}
     */
    var TodoActions = function() {

        // Generate all of our actions!
        this.generateActions('add', 'remove', 'toggleState');

    };

    $app.actions.todoActions = $app.alt.createActions(TodoActions);

})(window.app);