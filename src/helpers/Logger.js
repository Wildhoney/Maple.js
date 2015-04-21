export default (function main() {

    "use strict";

    return {

        /**
         * @constant type
         * @type {Object}
         */
        type: {
            module: 'module',
            component: 'component'
        },

        /**
         * @method send
         * @param {String} message
         * @param {String} type
         * @return {void}
         */
        send(message, type) {

            switch (type) {

                //case (this.type.module):
                //    console.log(`%c Module: ${message} `, 'color: white; border-radius: 3px; padding: 2px 0; font-size: 9px; background: linear-gradient(to bottom,  #ef3232 0%,#d63a2c 100%)');
                //    break;

                case (this.type.component):
                    console.log(`%cComponent:%c ${message}`, 'color: #d63a2c', 'color: black');
                    break;

                default:
                    console.log(message);

            }

        }

    };

})();