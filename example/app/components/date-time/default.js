/**
 * @module DateTime
 * @extends React.Component
 */
var DateTime = React.createClass({

    /**
     * @method getDefaultProps
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return { unix: Date.now() };
    },

    /*
     * @method render
     * @return {Object}
     */
    render: function render() {
        var unixTimestamp = Number(this.props.unix);
        return React.createElement('time', null, new Date(unixTimestamp).toLocaleDateString());
    }

});