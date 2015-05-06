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
        this.props = { onChange: this.onChange.bind(this) };
        app.stores.todoStore.listen(this.props.onChange);
    }

    /**
     * @method componentWillUnmount
     * @return {void}
     */
    componentWillUnmount() {
        app.stores.todoStore.unlisten(this.props.onChange);
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
     * @method toggleState
     * @return {void}
     */
    toggleState(model) {
        app.actions.todoActions.toggleState(model);
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        let todoItems = this.state.items.map(function(model) {

            return (
                <li className={ model.complete ? 'done' : '' } onClick={this.toggleState.bind(this, model)}>
                    <p>{model.text}</p>
                    <date-time data-unix={model.date}></date-time>
                </li>
            );

        }.bind(this));

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