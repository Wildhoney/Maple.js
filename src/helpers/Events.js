export default (function main($document) {

    "use strict";

    /**
     * @constant REACTID_ATTRIBUTE
     * @type {String}
     */
    const REACTID_ATTRIBUTE = 'data-reactid';

    /**
     * @property components
     * @type {Array}
     */
    let components = [];

    /**
     * @property eventNames
     * @type {Array|null}
     */
    let eventNames = null;

    return {

        /**
         * @method findById
         * @param id {Number}
         * @return {Object}
         */
        findById(id) {

            let model;

            /**
             * @method find
             * @param {Object} renderedComponent
             * @param {Object} currentComponent
             * @return {void}
             */
            function find(renderedComponent, currentComponent) {

                if (renderedComponent._rootNodeID === id) {

                    /**
                     * @method bindModel
                     * @return {void}
                     */
                    (function bindModel() {

                        model = {
                            properties: this._currentElement.props,
                            component: currentComponent
                        };

                    }.bind(renderedComponent))();

                    return;

                }

                let children = renderedComponent._renderedComponent._renderedChildren;

                if (children) {
                    Object.keys(children).forEach((index) => {
                        find(children[index], currentComponent);
                    });
                }

            }

            components.forEach((component) => {
                find(component._reactInternalInstance._renderedComponent, component);
            });

            return model;

        },

        /**
         * @method transformKeys
         * @param {Object} map
         * @param {String} [transformer='toLowerCase']
         * @return {Object}
         */
        transformKeys(map, transformer = 'toLowerCase') {

            let transformedMap = {};

            Object.keys(map).forEach(function forEach(key) {
                transformedMap[key[transformer]()] = map[key];
            });

            return transformedMap;

        },

        /**
         * @method registerComponent
         * @param {Object} component
         * @return {void}
         */
        registerComponent(component) {
            components.push(component);
        },

        /**
         * @method setupDelegation
         * @return {void}
         */
        setupDelegation() {

            let events = eventNames || (() => {

                eventNames = Object.keys($document.createElement('a')).filter((key) => {
                    return key.match(/^on/i);
                }).map((name) => name.replace(/^on/i, ''));

                return eventNames;

            })();

            events.forEach((eventType) => {

                $document.addEventListener(eventType, (event) => {

                    let eventName = `on${event.type}`;

                    event.path.forEach((item) => {

                        if (!item.getAttribute || !item.hasAttribute(REACTID_ATTRIBUTE)) {
                            return;
                        }

                        let model       = this.findById(item.getAttribute(REACTID_ATTRIBUTE));
                        let transformed = this.transformKeys(model.properties);

                        if (eventName in transformed) {
                            transformed[eventName].apply(model.component);
                        }

                    });

                });

            });

        }

    };

})(window.document);


// Remove reactid from default prop
// Setup events
// Replace "export default" when eval'ing