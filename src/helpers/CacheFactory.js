export default (function main($window) {

    "use strict";

    /**
     * @property cache
     * @type {Object}
     */
    let cache = {};

    /**
     * @property sass
     * @type {Sass|null}
     */
    let sass = null;

    return {

        /**
         * @method getSass
         * @return {Sass}
         */
        getSass() {

            if (!sass && typeof $window.Sass !== 'undefined') {
                sass = new $window.Sass();
            }

            return sass;

        },

        /**
         * Responsible for delegating to the native `fetch` function (polyfill provided), but will cache the
         * initial promise in order for other invocations to the same URL to yield the same promise.
         *
         * @method fetch
         * @param url {String}
         * @return {Promise}
         */
        fetch(url) {

            if (cache[url]) {
                return cache[url];
            }

            cache[url] = new Promise((resolve) => {

                $window.fetch(url).then((response) => response.text()).then((body) => {
                    resolve(body);
                });

            });

            return cache[url];

        }

    };

})(window);