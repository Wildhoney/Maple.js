import events  from './../helpers/Events.js';
import css     from './../helpers/Stylesheets.js';

export default (function main($document) {

    "use strict";

    return {

        /**
         * @method delegate
         * @param {Array} modules
         * @return {void}
         */
        register(...modules) {

            modules.forEach((name) => {

                let elementName   = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
                    prototype     = Object.create(HTMLElement.prototype, {

                    /**
                     * @property createdCallback
                     * @type {Object}
                     */
                    createdCallback: {

                        /**
                         * @method value
                         * @return {void}
                         */
                        value: function value() {

                            this.innerHTML = '';

                            // Todo: Make all of this dynamic!
                            let path = 'app/components/user-calendar';

                            System.import(`${path}/calendar`).then((Component) => {

                                let element        = React.createElement(Component.default),
                                    contentElement = $document.createElement('content'),
                                    shadowRoot     = this.createShadowRoot();

                                css.associate(path, shadowRoot);
                                shadowRoot.appendChild(contentElement);

                                let component = React.render(element, contentElement);
                                events.delegate(contentElement, component);

                            });

                        }

                    }

                });

                $document.registerElement(elementName, {
                    prototype: prototype
                });

            });

        }

    };

})(document);