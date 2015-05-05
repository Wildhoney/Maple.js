/**
 * @module DateTime
 * @extends React.Component
 */
class DateTime extends React.Component {

    /*
     * @method render
     * @return {Object}
     */
    render() {
        var unixTimestamp = Number(this.props.unix);
        return <time>{new Date(unixTimestamp).toLocaleDateString()}</time>
    }

}