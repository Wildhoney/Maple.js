/**
 * @module DateTime
 * @extends React.Component
 */
export default class DateTime extends React.Component {

    /*
     * @method render
     * @return {Object}
     */
    function render() {
        var unixTimestamp = Number(this.props.unix);
        return React.createElement('time', null, new Date(unixTimestamp).toLocaleDateString());
    }

}