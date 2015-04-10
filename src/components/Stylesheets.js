export default (function main($document) {

    "use strict";

    return {

        /**
         * @property linkSelector
         * @type {String}
         */
        linkSelector: 'link[type="text/css"]',

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        },

        /**
         * @method associate
         * @param {Document} ownerDocument
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associate(ownerDocument, shadowRoot) {

            this.toArray(document.querySelectorAll('link')).forEach((link) => {

                if (link.import === ownerDocument) {

                    let path            = link.getAttribute('href').split('/').slice(0, -1).join('/'),
                        templateElement = ownerDocument.querySelector('template').content,
                        cssDocuments    = this.toArray(templateElement.querySelectorAll(this.linkSelector)).map((model) => {
                            return `${path}/${model.getAttribute('href')}`;
                        });

                    cssDocuments.forEach((cssDocument) => {

                        let styleElement = $document.createElement('style');
                        styleElement.setAttribute('type', 'text/css');
                        styleElement.innerHTML = `@import url(${cssDocument})`;
                        shadowRoot.appendChild(styleElement);

                    });

                }

            });

        }

    };

})(document);