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
         * @param {String} componentPath
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associate(componentPath, shadowRoot) {

            this.toArray(document.querySelectorAll('link')).forEach((link) => {

                let href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    let templateElement = link.import.querySelector('template'),
                        templateContent = templateElement.content,
                        cssDocuments    = this.toArray(templateContent.querySelectorAll('link')).map((linkElement) => {
                            return `${componentPath}/${linkElement.getAttribute('href')}`;
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