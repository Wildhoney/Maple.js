/**
 * @module DateTime
 * @extends React.Component
 */
export default class DateTime extends React.Component {

    halt(e) {
        e.preventDefault();
        e.stopPropagation();
        //console.log(e);
    }

    /*
     * @method render
     * @return {Object}
     */
    render() {
        let unixTimestamp = Number(this.props.unix);
        let dateFormat    = this.props.format || 'MM-DD-YYYY';
        return <time onClick={this.halt}>{moment(unixTimestamp).format(dateFormat)}</time>
    }

}