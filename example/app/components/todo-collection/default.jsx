/**
 * @module TodoCollection
 * @extends React.Component
 */
class TodoCollection extends React.Component {

    /**
     * @method constructor
     * @return {Object}
     */
    constructor() {
        super();
        this.state = app.stores.todoStore.getState();
    }

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {
        app.stores.todoStore.listen(this.onChange);
    }

    /**
     * @method componentWillUnmount
     * @return {void}
     */
    componentWillUnmount() {
        app.stores.todoStore.unlisten(this.onChange);
    }

    /**
     * @method onChange
     * @param {Object} state
     * @return {void}
     */
    onChange(state) {
        this.setState(state);
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        let todoItems = this.state.items.map(function(model) {

            return (
                <li className={ model.complete ? 'done' : '' }>
                    <p>{model.text}</p>
                    <date-time data-unix={model.date}></date-time>
                </li>
            );

        });

        return (
            <section>
                <h1>
                    <i className="fa fa-calendar"></i>
                    <span>Todo List</span>
                    <span>{this.state.items.length}</span>
                </h1>
                <ul>{todoItems.length ? todoItems : <li className="none">Currently no todo items.</li>}</ul>
            </section>
        );

    }

}