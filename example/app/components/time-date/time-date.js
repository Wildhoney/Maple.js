/**
 * @module TimeDate
 * @extends React.Component
 */
export default class TimeDate extends React.Component {

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {
        setInterval(() => this.forceUpdate(), 1000);
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {
        let dateTime = moment().format(this.props.format || 'YYYY-MM-DD');
        return React.createElement('datetime', null, dateTime);
    }

}