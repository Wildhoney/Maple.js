import utility from './../helpers/Utility.js';

export default (function main($document) {

    "use strict";

    return {

        /**
         * @property linkSelector
         * @type {String}
         */
        linkSelector: 'link[type="text/css"]',

        /**
         * @method associate
         * @param {Array} cssDocuments
         * @param {ShadowRoot} shadowRoot
         * @return {Array}
         */
        associate(cssDocuments, shadowRoot) {

            return cssDocuments.map((cssDocument) => {

                return new Promise((resolve) => {

                    fetch(cssDocument).then((response) => response.text()).then((body) => {

                        var styleElement = shadowRoot.ownerDocument.createElement('style');
                        styleElement.innerHTML = body;
                        shadowRoot.appendChild(styleElement);
                        resolve(styleElement.innerHTML);

                    });

                });

            });

        }

    };

})(document);