(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _events = require('./components/Events.js');

var _events2 = _interopRequireWildcard(_events);

var _stylesheets = require('./components/Stylesheets.js');

var _stylesheets2 = _interopRequireWildcard(_stylesheets);

(function main($window, $document) {

    'use strict';

    /**
     * @constant options
     * @type {Object}
     */
    var options = {
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

    var Maple = (function () {

        /**
         * @constructor
         * @return {Maple}
         */

        function Maple() {
            _classCallCheck(this, Maple);

            this.elements = [];
        }

        _createClass(Maple, [{
            key: 'throwException',

            /**
             * @method throwException
             * @throws Error
             * @param {String} message
             * @return {void}
             */
            value: function throwException(message) {
                throw new Error('Maple.js: ' + message + '.');
            }
        }, {
            key: 'component',

            /**
             * @method component
             * @param {String} name
             * @param {Object} blueprint
             * @return {void}
             */
            value: function component(name, blueprint) {

                var element = React.createClass(blueprint);
                this.elements[name] = this.createElement(name, React.createElement(element));
            }
        }, {
            key: 'createElement',

            /**
             * @method createElement
             * @param {String} name
             * @param {Object} element
             * @return {void}
             */
            value: function createElement(name, element) {

                var ownerDocument = $document.currentScript.ownerDocument,
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

                            var contentElement = ownerDocument.createElement('content'),
                                shadowRoot = this.createShadowRoot();

                            _stylesheets2['default'].associate(shadowRoot);
                            shadowRoot.appendChild(contentElement);
                            _events2['default'].delegate(contentElement, React.render(element, contentElement));
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
        }]);

        return Maple;
    })();

    $window.maple = new Maple();
})(window, document);

},{"./components/Events.js":2,"./components/Stylesheets.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {

    /**
     * @method delegate
     * @param {HTMLElement} contentElement
     * @param {ReactClass.createClass.Constructor} component
     * @return {void}
     */
    delegate: function delegate(contentElement, component) {

        var aElement = document.createElement('a'),
            events = [],
            eventEsque = /on[a-z]+/i;

        Object.keys(aElement).forEach(function (key) {

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
        function findEvents(_x, _x2, _x3) {
            var _again = true;

            _function: while (_again) {
                events = children = id = item = undefined;
                _again = false;
                var node = _x,
                    reactId = _x2,
                    eventName = _x3;

                var events = [];

                if (node._currentElement._store.props.hasOwnProperty(eventName)) {
                    events.push(node._currentElement._store.props[eventName]);
                }

                if (node._rootNodeID === reactId) {
                    return events;
                }

                var children = node._renderedChildren;

                for (var id in children) {

                    if (children.hasOwnProperty(id)) {

                        var item = children[id];

                        if (item._rootNodeID === reactId) {

                            if (item._instance.props.hasOwnProperty(eventName)) {
                                events.push(item._instance.props[eventName]);
                            }

                            return events;
                        }

                        if (item._renderedChildren) {
                            _x = item;
                            _x2 = reactId;
                            _x3 = eventName;
                            _again = true;
                            continue _function;
                        }
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

                var components = component._reactInternalInstance._renderedComponent._renderedComponent,
                    eventFn = 'on' + (event.type.charAt(0).toUpperCase() + event.type.slice(1)),
                    events = findEvents(components, event.target.getAttribute('data-reactid'), eventFn);

                events.forEach(function (eventFn) {
                    eventFn();
                });
            });
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var eventName = _step.value;

                createEvent(eventName);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

};
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {

    /**
     * @method toArray
     * @param {*} arrayLike
     * @return {Array}
     */
    toArray: function toArray(arrayLike) {
        return Array.prototype.slice.apply(arrayLike);
    },

    /**
     * @method associate
     * @param {Document} ownerDocument
     * @param {ShadowRoot} shadowRoot
     * @return {void}
     */
    associate: function associate(ownerDocument, shadowRoot) {
        var _this = this;

        this.toArray(document.querySelectorAll('link')).forEach(function (link) {

            if (link['import'] === ownerDocument) {
                (function () {

                    var path = link.getAttribute('href').split('/').slice(0, -1).join('/'),
                        templateElement = ownerDocument.querySelector('template').content,
                        cssDocuments = _this.toArray(templateElement.querySelectorAll(options.linkSelector)).map(function (model) {
                        return '' + path + '/' + model.getAttribute('href');
                    });

                    cssDocuments.forEach(function (cssDocument) {

                        var styleElement = $document.createElement('style');
                        styleElement.setAttribute('type', 'text/css');
                        styleElement.innerHTML = '@import url(' + cssDocument + ')';
                        shadowRoot.appendChild(styleElement);
                    });
                })();
            }
        });
    }

};
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9TdHlsZXNoZWV0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3NCQ0F3Qix3QkFBd0I7Ozs7MkJBQ3hCLDZCQUE2Qjs7OztBQUVyRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7Ozs7OztBQU1iLFFBQU0sT0FBTyxHQUFHO0FBQ1osb0JBQVksRUFBRSx1QkFBdUI7QUFDckMsc0JBQWMsRUFBRSxvQkFBb0I7QUFDcEMscUJBQWEsRUFBRSxnQkFBZ0I7QUFDL0IsbUJBQVcsRUFBRSxNQUFNO0tBQ3RCLENBQUM7Ozs7Ozs7O1FBT0ksS0FBSzs7Ozs7OztBQU1JLGlCQU5ULEtBQUssR0FNTztrQ0FOWixLQUFLOztBQU9ILGdCQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUN0Qjs7cUJBUkMsS0FBSzs7Ozs7Ozs7O21CQWdCTyx3QkFBQyxPQUFPLEVBQUU7QUFDcEIsc0JBQU0sSUFBSSxLQUFLLGdCQUFjLE9BQU8sT0FBSSxDQUFDO2FBQzVDOzs7Ozs7Ozs7O21CQVFRLG1CQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7O0FBRXZCLG9CQUFJLE9BQU8sR0FBVyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25ELG9CQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUss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WSxDQUFDLENBQUM7cUJBRXhDLENBQUMsQ0FBQzs7YUFFTjtTQUVKLENBQUMsQ0FBQztLQUVOOztDQUVKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBldmVudHMgICAgICBmcm9tICcuL2NvbXBvbmVudHMvRXZlbnRzLmpzJztcbmltcG9ydCBzdHlsZXNoZWV0cyBmcm9tICcuL2NvbXBvbmVudHMvU3R5bGVzaGVldHMuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IG9wdGlvbnNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGxpbmtTZWxlY3RvcjogJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICAgICAgaW1wb3J0U2VsZWN0b3I6ICdsaW5rW3JlbD1cImltcG9ydFwiXScsXG4gICAgICAgIGRhdGFBdHRyaWJ1dGU6ICdkYXRhLWNvbXBvbmVudCcsXG4gICAgICAgIGRhdGFFbGVtZW50OiAnaHRtbCdcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEByZXR1cm4ge01hcGxlfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0aHJvd0V4Y2VwdGlvblxuICAgICAgICAgKiBAdGhyb3dzIEVycm9yXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB0aHJvd0V4Y2VwdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcGxlLmpzOiAke21lc3NhZ2V9LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgY29tcG9uZW50XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBibHVlcHJpbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbXBvbmVudChuYW1lLCBibHVlcHJpbnQpIHtcblxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgICAgICAgICA9IFJlYWN0LmNyZWF0ZUNsYXNzKGJsdWVwcmludCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzW25hbWVdID0gdGhpcy5jcmVhdGVFbGVtZW50KG5hbWUsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVFbGVtZW50KG5hbWUsIGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgbGV0IG93bmVyRG9jdW1lbnQgICAgPSAkZG9jdW1lbnQuY3VycmVudFNjcmlwdC5vd25lckRvY3VtZW50LFxuICAgICAgICAgICAgICAgIGVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQHByb3BlcnR5IGNyZWF0ZWRDYWxsYmFja1xuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVzaGVldHMuYXNzb2NpYXRlKHNoYWRvd1Jvb3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihlbGVtZW50LCBjb250ZW50RWxlbWVudCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHByb3BlcnR5IE1lZ2FCdXR0b25cbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwge1xuICAgICAgICAgICAgICAgIHByb3RvdHlwZTogZWxlbWVudFByb3RvdHlwZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgJHdpbmRvdy5tYXBsZSA9IG5ldyBNYXBsZSgpO1xuXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3MuY3JlYXRlQ2xhc3MuQ29uc3RydWN0b3J9IGNvbXBvbmVudFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIGNvbXBvbmVudCkge1xuXG4gICAgICAgIGxldCBhRWxlbWVudCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuICAgICAgICAgICAgZXZlbnRzICAgICA9IFtdLFxuICAgICAgICAgICAgZXZlbnRFc3F1ZSA9IC9vblthLXpdKy9pO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGFFbGVtZW50KS5mb3JFYWNoKChrZXkpID0+IHtcblxuICAgICAgICAgICAgaWYgKGtleS5tYXRjaChldmVudEVzcXVlKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGtleS5yZXBsYWNlKC9eb24vLCAnJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRFdmVudHNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJlYWN0SWRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZmluZEV2ZW50cyhub2RlLCByZWFjdElkLCBldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgdmFyIGV2ZW50cyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAobm9kZS5fY3VycmVudEVsZW1lbnQuX3N0b3JlLnByb3BzLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBldmVudHMucHVzaChub2RlLl9jdXJyZW50RWxlbWVudC5fc3RvcmUucHJvcHNbZXZlbnROYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5fcmVuZGVyZWRDaGlsZHJlbjtcblxuICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gY2hpbGRyZW4pIHtcblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGNoaWxkcmVuW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5faW5zdGFuY2UucHJvcHMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGl0ZW0uX2luc3RhbmNlLnByb3BzW2V2ZW50TmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5fcmVuZGVyZWRDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRFdmVudHMoaXRlbSwgcmVhY3RJZCwgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUV2ZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGVFdmVudChldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgY29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudHMgPSBjb21wb25lbnQuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgID0gYG9uJHtldmVudC50eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZXZlbnQudHlwZS5zbGljZSgxKX1gLFxuICAgICAgICAgICAgICAgICAgICBldmVudHMgICAgID0gZmluZEV2ZW50cyhjb21wb25lbnRzLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKSwgZXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRGbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudEZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBldmVudE5hbWUgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICBjcmVhdGVFdmVudChldmVudE5hbWUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgYXNzb2NpYXRlXG4gICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudFxuICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Um9vdFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgYXNzb2NpYXRlKG93bmVyRG9jdW1lbnQsIHNoYWRvd1Jvb3QpIHtcblxuICAgICAgICB0aGlzLnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5mb3JFYWNoKChsaW5rKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChsaW5rLmltcG9ydCA9PT0gb3duZXJEb2N1bWVudCkge1xuXG4gICAgICAgICAgICAgICAgbGV0IHBhdGggICAgICAgICAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJykuc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJykuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgY3NzRG9jdW1lbnRzICAgID0gdGhpcy50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMubGlua1NlbGVjdG9yKSkubWFwKChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3BhdGh9LyR7bW9kZWwuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMuZm9yRWFjaCgoY3NzRG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGBAaW1wb3J0IHVybCgke2Nzc0RvY3VtZW50fSlgO1xuICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59OyJdfQ==
