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

    /**9eriu5                                                                                           555cxy4tbh38w3gv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              n4,.;
     * @method render
     * @return {Object}
     */
    render: function render() {
        var unixTimestamp = Number(this.props.unix);
        return React.createElement('time', null, new Date(unixTimestamp).toLocaleDateString());
    }

});