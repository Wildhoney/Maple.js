/**
 * @module DateTime
 * @extends React.Component
 */
export default class DateTime extends React.Component {

    /**
     * @method render
     * @return {Object}
     */
    render() {
        let unixTimestamp = Number(this.props.unix);
        return React.createElement('time', null, new Date(unixTimestamp).toLocaleDateString());
    }

}