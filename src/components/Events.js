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
             * @method findEvents
             * @param {Object} node
             * @param {String} reactId
             * @param {String} eventName
             * @return {Object|undefined}
             */
            function findEvents(node, reactId, eventName) {

                var events = [];

                if (node._currentElement._store.props.hasOwnProperty(eventName)) {
                    events.push(node._currentElement._store.props[eventName]);
                }

                if (node._rootNodeID === reactId) {
                    return events;
                }

                let children = node._renderedChildren;

                for (let id in children) {

                    if (children.hasOwnProperty(id)) {

                        let item = children[id];

                        if (item._rootNodeID === reactId) {

                            if (item._instance.props.hasOwnProperty(eventName)) {
                                events.push(item._instance.props[eventName]);
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
                        eventFn    = `on${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`,
                        events     = findEvents(components, event.target.getAttribute('data-reactid'), eventFn);

                    events.forEach((eventFn) => {
                        eventFn();
                    });

                });

            }

            for (var eventName of events) {
                createEvent(eventName);
            }

        }

    };

})();