export default (function main($window) {

    "use strict";

    /**
     * @property cache
     * @type {Object}
     */
    let cache = {};

    return {

        /**
         * @method fetch
         * @param url {String}
         * @return {Promise}
         */
        fetch(url) {

            if (cache[url]) {
                return cache[url];
            }

            cache[url] = new Promise((resolve) => {

                cache[url] = $window.fetch(url).then((response) => response.text()).then((body) => {
                    resolve(body);
                });

            });

            return cache[url];

        }

    };

})(window);