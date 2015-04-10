(function main($window, $document) {

    "use strict";

    /**
     * @constant options
     * @type {Object}
     */
    const options = {
        linkSelector: 'link[type="text/css"]',
        importSelector: 'link[rel="import"]',
        dataAttribute: 'data-component',
        dataElement: 'html'
    };

    /**
     * @module Maple
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/Maple.js
     */
    class Maple {

        /**
         * @constructor
         * @return {Maple}
         */
        constructor() {
            this.elements = [];
        }

        /**
         * @method throwException
         * @throws Error
         * @param {String} message
         * @return {void}
         */
        throwException(message) {
            throw new Error(`Maple.js: ${message}.`);
        }

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        }

        /**
         * @method component
         * @param {String} name
         * @param {Object} blueprint
         * @return {void}
         */
        component(name, blueprint) {

            let element         = React.createClass(blueprint);
            this.elements[name] = this.createElement(name, React.createElement(element));

        }

        /**
         * @method associateCSS
         * @param {Document} ownerDocument
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associateCSS(ownerDocument, shadowRoot) {

            this.toArray($document.querySelectorAll('link')).forEach((link) => {

                if (link.import === ownerDocument) {

                    let path            = link.getAttribute('href').split('/').slice(0, -1).join('/'),
                        templateElement = ownerDocument.querySelector('template').content,
                        cssDocuments    = this.toArray(templateElement.querySelectorAll(options.linkSelector)).map((model) => {
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

        /**
         * @method delegateEvents
         * @param {HTMLElement} contentElement
         * @param {ReactClass.createClass.Constructor} component
         * @return {void}
         */
        delegateEvents(contentElement, component) {

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
                            return findEvents(item, reactId);
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
                        eventFn    = `on${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`;
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

        /**
         * @method createElement
         * @param {String} name
         * @param {Object} element
         * @return {void}
         */
        createElement(name, element) {

            let ownerDocument    = $document.currentScript.ownerDocument,
                delegateEvents   = this.delegateEvents.bind(this),
                associateCSS     = this.associateCSS.bind(this, ownerDocument),
                elementPrototype = Object.create(HTMLElement.prototype, {

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

                        let contentElement = ownerDocument.createElement('content'),
                            shadowRoot     = this.createShadowRoot();

                        associateCSS(shadowRoot);
                        shadowRoot.appendChild(contentElement);

                        var component = React.render(element, contentElement);

                        delegateEvents(contentElement, component);

                    }

                }

            });

            /**
             * @property MegaButton
             * @type {Object}
             */
            $document.registerElement(name, {
                prototype: elementPrototype
            });

        }

    }

    $window.maple = new Maple();

})(window, document);