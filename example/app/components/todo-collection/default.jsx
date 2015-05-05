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
        this.state = {
            items: [
                { text: 'Take out the dirty dishes.', date: Date.now(), complete: false },
                { text: 'Bring in the clothes from the line.', date: Date.now(), complete: false },
                { text: 'Get curry powder from Waitrose.', date: Date.now(), complete: false }
            ]
        };
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
                <ul>{todoItems}</ul>
            </section>
        );

    }

}