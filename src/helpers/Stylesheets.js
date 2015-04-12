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
         * @param {String} componentPath
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associate(componentPath, shadowRoot) {

            utility.toArray(document.querySelectorAll('link')).forEach((link) => {

                let href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    let templateElement = link.import.querySelector('template'),
                        templateContent = templateElement.content,
                        cssDocuments    = utility.toArray(templateContent.querySelectorAll('link')).map((linkElement) => {
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