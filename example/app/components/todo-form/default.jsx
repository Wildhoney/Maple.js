/**
 * @module TodoForm
 * @extends React.Component
 */
class TodoForm extends React.Component {

    /**
     * @method addTodo
     * @return {void}
     */
    addTodo() {

        let textElement = this.refs.todoText.getDOMNode();

        if (textElement.value) {
            let model = { text: textElement.value, date: Date.now(), complete: false };
            app.actions.todoActions.add(model);
            textElement.value = '';
        }

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <section>
                <h1>Add Todo Item</h1>
                <input type="text" ref="todoText" refs="todoText" />
                <input type="button" value="Add" onClick={this.addTodo} />
            </section>
        );

    }

}