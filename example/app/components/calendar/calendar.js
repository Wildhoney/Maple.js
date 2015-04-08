(function() {

    "use strict";

    /**
     * @module Calendar
     * @extends React.Component
     */
    var Calendar = React.createClass({

        /**
         * @method componentDidMount
         * @return {void}
         */
        componentDidMount() {

            setInterval(function() {

                this.setState({ count: this.state.count + 1 });

            }.bind(this), 1000);

        },

        /**
         * @method getInitialState
         * @return {Object}
         */
        getInitialState() {
            return { count: 1 };
        },

        /**
         * @method render
         * @return {Object}
         */
        render() {
            return React.DOM.div(null, 'Calendar! ' + this.state.count);
        }

    });

    maple.render(React.createElement(Calendar), 'user-calendar');

})();