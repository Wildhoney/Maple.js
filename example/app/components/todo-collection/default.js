/**
 * @module TodoCollection
 * @extends React.Component
 */
export default class TodoCollection extends React.Component {

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
     * @method completedItems
     * @return {Array}
     */
    completedItems() {

        return this.state.items.filter(function(d) {
            return d.complete;
        });

    }

    /**
     * @method removeTodo
     * @param {Object} model
     * @return {void}
     */
    removeTodo(model) {
        app.actions.todoActions.remove(model);
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        let todoItems = this.state.items.map(function(model, index) {

            return (
                <li key={index} className={ model.complete ? 'done' : '' } onClick={this.toggleState.bind(this, model)}>
                    <p>{model.text}</p>
                    <date-time data-unix={model.date}></date-time>
                    <button className="remove" onClick={this.removeTodo.bind(this, model)}>
                        <i className="fa fa-times"></i> Remove Item
                    </button>
                </li>
            );

        }.bind(this));

        return (
            <section>
                <h1>
                    <i className="fa fa-calendar"></i>
                    <span>Todo List</span>
                    <span>{this.completedItems().length}/ {this.state.items.length}</span>
                </h1>
                <ul>{todoItems.length ? todoItems : <li className="none">You have an impeccable memory!</li>}</ul>
            </section>
        );

    }

}