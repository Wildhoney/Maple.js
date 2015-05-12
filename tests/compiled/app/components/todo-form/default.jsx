/**
 * @module TodoForm
 * @extends React.Component
 */
export default class TodoForm extends React.Component {

    /**
     * @constructor
     * @return {TodoForm}
     */
    constructor() {
        super();
        this.state = { addable: false };
    }

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
            this.setState({ addable: false });
            textElement.select();
        }

    }

    /**
     * @method enableButton
     * @return {void}
     */
    enableButton() {

        if (this.refs.todoText.getDOMNode().value.trim()) {
            return void this.setState({ addable: true });
        }

        this.setState({ addable: false });

    }

    /**
     * @method handleKeyUp
     * @return {void}
     */
    handleKeyUp(event) {

        const ENTER_KEY = 13;

        if (event.keyCode === ENTER_KEY) {
            this.addTodo();
        }

        this.enableButton();

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <section>
                <h1>Add Item:</h1>
                <div className="fields">
                    <input type="text" ref="todoText" onKeyUp={this.handleKeyUp} placeholder="What are you going to forget?" />
                    <input type="button" value="Add" className={this.state.addable ? 'active' : ''}
                           onClick={this.addTodo} />
                </div>
            </section>
        );

    }

}