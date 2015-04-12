/**
 * @module UserCalendar
 * @extends Maple.Component
 */
export default class UserCalendar extends React.Component {

    /**
     * @constructor
     * @param {Object} properties
     * @return {UserCalendar}
     */
    constructor(properties) {
        super(properties);
        this.state = { elements: [{}, {}, {}] };
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
        return React.createElement('div', {onClick: this.resetCounter}, this.state.elements.map(function () {
            return React.createElement('a', null, 'Element');
        }.bind(this)));
    }

}