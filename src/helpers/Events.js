import utility from './Utility.js';

/**
 * @method overrideStopPropagation
 * @see: http://bit.ly/1dPpxHl
 * @return {void}
 */
(function overrideStopPropagation() {

    "use strict";

    let overriddenStop = Event.prototype.stopPropagation;

    Event.prototype.stopPropagation = function stopPropagation() {
        this.isPropagationStopped = true;
        overriddenStop.apply(this, arguments);
    };

})();

export default (function main($document) {

    "use strict";

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
         * Recursively discover a component via its React ID that is set as a data attribute
         * on each React element.
         *
         * @method findById
         * @param id {String}
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

                if (renderedComponent._renderedComponent) {

                    let children = renderedComponent._renderedComponent._renderedChildren;

                    if (children) {
                        Object.keys(children).forEach((index) => {
                            find(children[index], currentComponent);
                        });
                    }

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

            /**
             * Determines all of the event types supported by the current browser. Will cache the results
             * of this discovery for performance benefits.
             *
             * @property events
             * @type {Array}
             */
            let events = eventNames || (() => {

                eventNames = Object.keys($document.createElement('a')).filter((key) => {
                    return key.match(/^on/i);
                }).map((name) => name.replace(/^on/i, ''));

                return eventNames;

            })();

            events.forEach((eventType) => {

                $document.addEventListener(eventType, (event) => {

                    let eventName = `on${event.type}`,
                        eventList = [];

                    event.path.forEach((item) => {

                        if (event.isPropagationStopped) {

                            // Method `stopPropagation` was invoked on the current event, which prevents
                            // us from propagating any further.
                            return;

                        }

                        if (!item.getAttribute || !item.hasAttribute(utility.ATTRIBUTE_REACTID)) {

                            // Current element is not a valid React element because it doesn't have a
                            // React ID data attribute.
                            return;

                        }

                        // Attempt to field the component by the associated React ID.
                        let model = this.findById(item.getAttribute(utility.ATTRIBUTE_REACTID));

                        if (model && model.properties) {

                            // Transform the current React events into lower case keys, so that we can pair them
                            // up with the event types.
                            let transformed = this.transformKeys(model.properties);

                            if (eventName in transformed) {

                                // We defer the invocation of the event method, because otherwise React.js
                                // will re-render, and the React IDs will then be "out of sync" for this event.
                                eventList.push(transformed[eventName].bind(model.component, event));

                            }

                        }

                    });

                    // Invoke each found event for the event type.
                    eventList.forEach((eventInvocation) => eventInvocation());

                });

            });

        }

    };

})(window.document);