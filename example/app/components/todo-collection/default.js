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
        this.state = { items: [1,2,3] };
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return React.createElement('section', null, [
            React.createElement('h1', null, [
                React.createElement('i', { className: 'fa fa-leanpub' }, null),
                React.createElement('span', null, `Todo Items (${this.state.items.length})`)
            ]),
            React.createElement('ul', null, this.state.items.map((model, index) => {
                return React.createElement('li', null, 'Item');
            }))
        ]);

    }

}