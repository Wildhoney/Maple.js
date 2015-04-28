import alt from './../alt.js';
import TodoActions from './../actions/TodoActions.js';

class TodoStore {
    constructor() {
        this.bindListeners({
            updateTodo: TodoActions.updateTodo
        });

        this.todos = {};
    }

    updateTodo({ id, text }) {
        const todos = this.todos;

        todos[id] = todos[id] || {};
        todos[id].text = text;

        this.setState({ todos });
    }
}

export default alt.createStore(TodoStore, 'TodoStore');