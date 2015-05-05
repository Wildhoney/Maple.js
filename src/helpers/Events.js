export default (function main() {

    "use strict";

    return {

        /**
         * @method delegate
         * @param {HTMLElement} contentElement
         * @param {ReactClass.createClass.Constructor} component
         * @return {void}
         */
        delegate(contentElement, component) {

            let aElement   = document.createElement('a'),
                events     = [],
                eventEsque = /on[a-z]+/i;

            Object.keys(aElement).forEach((key) => {

                if (key.match(eventEsque)) {
                    events.push(key.replace(/^on/, ''));
                }

            });

            /**
             * @method getEvent
             * @param {String} eventName
             * @param {Object} properties
             * @return {Boolean}
             */
            function getEvent(eventName, properties) {

                let matchName = new RegExp(eventName, 'i'),
                    eventFn   = null;

                Object.keys(properties).forEach((property) => {

                    let propertyName = property.match(matchName);

                    if (propertyName) {
                        eventFn = properties[propertyName];
                    }

                });

                return eventFn;

            }

            /**
             * @method findEvents
             * @param {Object} node
             * @param {String} reactId
             * @param {String} eventName
             * @return {Array}
             */
            function findEvents(node, reactId, eventName) {

                let events      = [],
                    rootEventFn = getEvent(eventName, node._currentElement._store.props);

                if (rootEventFn) {

                    // Found event in root!
                    events.push(rootEventFn);

                }

                if (node._rootNodeID === reactId) {
                    return events;
                }

                let children = node._renderedChildren;

                for (let id in children) {

                    if (children.hasOwnProperty(id)) {

                        let item = children[id];

                        if (item._rootNodeID === reactId) {

                            let childEventFn = getEvent(eventName, item._instance.props);

                            if (childEventFn) {

                                // Found event in children!
                                events.push(childEventFn);

                            }

                            return events;

                        }

                        if (item._renderedChildren) {
                            return findEvents(item, reactId, eventName);
                        }

                    }

                }

            }

            /**
             * @method createEvent
             * @return {void}
             */
            function createEvent(eventName) {

                contentElement.addEventListener(eventName, function onClick(event) {

                    if (!(event.target instanceof HTMLElement)) {
                        return;
                    }

                    let components = component._reactInternalInstance._renderedComponent._renderedComponent,
                        eventFn    = `on${event.type}`,
                        events     = findEvents(components, event.target.getAttribute('data-reactid'), eventFn);

                    if (events) {

                        events.forEach((eventFn) => {
                            eventFn.apply(component);
                        });

                    }

                });

            }

            for (let eventName of events) {
                createEvent(eventName);
            }

        }

    };

})();