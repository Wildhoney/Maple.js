import utility from './../helpers/Utility.js';

export default (function main() {

    "use strict";

    /**
     * @property cssDocumentCache
     * @type {Object}
     */
    //var cssDocumentCache = {};

    return {

        /**
         * @method associate
         * @param {Array} cssDocuments
         * @param {Object} shadowBoundary
         * @return {Array}
         */
        associate(cssDocuments, shadowBoundary) {

            return cssDocuments.map((cssDocument) => {

                return new Promise((resolve) => {

                    fetch(cssDocument).then((response) => response.text()).then((body) => {

                        var styleElement = shadowBoundary.ownerDocument.createElement('style');
                        styleElement.innerHTML = body;
                        shadowBoundary.appendChild(styleElement);
                        resolve(styleElement.innerHTML);

                    });

                });

            });

        }

    };

})();