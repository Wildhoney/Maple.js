/**
 * @module DateTime
 * @extends React.Component
 */
export default class DateTime extends React.Component {

    /*
     * @method render
     * @return {Object}
     */
    render() {
        let unixTimestamp = Number(this.props.unix);
        let dateFormat    = this.props.format || 'MM-DD-YYYY';
        return <time>{moment(unixTimestamp).format(dateFormat)}</time>
    }

}