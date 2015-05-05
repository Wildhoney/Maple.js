/**
 * @module TodoForm
 * @extends React.Component
 */
export default class TodoForm extends React.Component {

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return React.createElement('section', null, [
            React.createElement('h1', null, 'Add Todo Item'),
            React.createElement('input', { type: 'text' }),
            React.createElement('input', { type: 'button', value: 'Add' })
        ]);

    }

}