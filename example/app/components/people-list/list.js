/**
 * @module PeopleList
 * @extends Maple.Component
 */
export default class PeopleList extends React.Component {

    /**
     * @constructor
     * @param {Object} properties
     * @return {UserCalendar}
     */
    constructor(properties) {
        super(properties);
    }

    /**
     * @method getNames
     * @return {Array}
     */
    getNames() {
        return this.props.names.split(',');
    }

    /**
     * @method resetCounter
     * @return {void}
     */
    resetCounter() {
        this.state.elements.push({});
        this.setState(this.state);
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {
        return React.createElement('ul', { onClick: this.resetCounter }, this.getNames().map(function (name) {
            return React.createElement('li', null, name || 'Unknown Person');
        }.bind(this)));
    }

}