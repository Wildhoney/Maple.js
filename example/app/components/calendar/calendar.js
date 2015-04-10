(function() {

    "use strict";

    maple.component('user-calendar', {

        /**
         * @method componentDidMount
         * @return {void}
         */
        componentDidMount() {

            //setInterval(function setInterval() {
            //
            //    this.setState({ count: this.state.count + 1 });
            //
            //}.bind(this), 1000);

        },

        /**
         * @method getInitialState
         * @return {Object}
         */
        getInitialState() {
            return { elements: [{}, {}, {}] };
        },

        /**
         * @method resetCounter
         * @return {void}
         */
        resetCounter() {
            this.state.elements.push({});
            this.setState(this.state);
        },

        /**
         * @method render
         * @return {Object}
         */
        render() {
            return React.createElement('div', null, this.state.elements.map(function() {
                return React.createElement('a', { onClick: this.resetCounter }, 'Element');
            }.bind(this)));
        }

    });

})();