/**
 * @module LocalDate
 * @extends React.Component
 */
export default class LocalDate extends React.Component {

    /**
     * @method render
     * @return {Object}
     */
    render() {
        let dateTime = moment().format(this.props.format || 'YYYY-MM-DD');
        return React.createElement('datetime', null, dateTime);
    }

}