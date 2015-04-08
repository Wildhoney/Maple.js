(function() {

    "use strict";

    /**
     * @module Calendar
     * @extends React.Component
     */
    new Maple.Component('user-calendar', class Calendar extends React.Component {

        /**
         * @constructor
         * @return {Calendar}
         */
        constructor() {
            super();
            this.state = { count: 1 };
        }

        /**
         * @method componentDidMount
         * @return {void}
         */
        componentDidMount() {

            setInterval(function() {

                this.setState({ count: this.state.count + 1 });

            }.bind(this), 1000);

        }

        /**
         * @method render
         * @return {Object}
         */
        render() {

            return React.DOM.div(null, 'Calendar! ' + this.state.count);

        }

    });

})();