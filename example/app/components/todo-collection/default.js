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
        this.state = {
            items: [
                { text: 'Take out the dirty dishes.', date: Date.now() },
                { text: 'Bring in the clothes from the line.', date: Date.now() },
                { text: 'Get curry powder from Waitrose.', date: Date.now() }
            ]
        };
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return React.createElement('section', null, [
            React.createElement('h1', null, [
                React.createElement('i', { className: 'fa fa-calendar' }, null), [
                    React.createElement('span', null, 'Todo Items'),
                    React.createElement('span', null, `(${this.state.items.length})`)
                ]
            ]),
            React.createElement('ul', null, this.state.items.map((model) => {
                return React.createElement('li', null, [
                    React.createElement('p', null, model.text),
                    React.createElement('date-time', { 'data-unix': model.date })
                ]);
            }))
        ]);

    }

}