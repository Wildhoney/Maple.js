(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Component = require('./components/Component.js');

var _Component2 = _interopRequireWildcard(_Component);

(function main($window) {

    'use strict';

    /**
     * @module Maple
     * @link https://github.com/Wildhoney/Maple.js
     * @author Adam Timberlake
     */

    var Maple =

    /**
     * @constructor
     * @param {Array} modules
     * @return {void}
     */
    function Maple() {
        for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
            modules[_key] = arguments[_key];
        }

        _classCallCheck(this, Maple);

        document.addEventListener('DOMContentLoaded', function () {

            var _component = new _Component2['default']();
            _component.register.apply(_component, _toConsumableArray(modules));
        });
    };

    $window.Maple = Maple;
})(window);

},{"./components/Component.js":2}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _events = require('./../helpers/Events.js');

var _events2 = _interopRequireWildcard(_events);

var _css = require('./../helpers/Stylesheets.js');

var _css2 = _interopRequireWildcard(_css);

/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Component = (function () {

    /**
     * @constructor
     * @return {Component}
     */

    function Component() {
        _classCallCheck(this, Component);

        this.components = [];
    }

    _createClass(Component, [{
        key: 'getImports',

        /**
         * @method getImports
         * @return {Array}
         */
        value: function getImports() {

            var importDocuments = document.querySelectorAll('link[rel="import"]');

            return this.toArray(importDocuments).map(function (importDocument) {

                return new Promise(function (resolve, reject) {
                    importDocument.addEventListener('load', resolve(event.path[0]));
                });
            });

            //return this.toArray(document.querySelectorAll('link[rel="import"]')).map((linkElement) => {
            //
            //    linkElement.addEventListener('load', (link) => {
            //
            //        console.log(link.path[0].import);
            //
            //    });
            //
            //    return {
            //        href: linkElement.getAttribute('href'),
            //        document: linkElement.ownerDocument
            //    };
            //
            //});
        }
    }, {
        key: 'findImport',

        /**
         * @method findImport
         * @param {String} elementName
         * @return {Object}
         */
        value: function findImport(elementName) {

            return this.imports.filter(function (link) {

                var regExp = new RegExp('' + elementName + '/(?:.+?).html', 'i');

                if (link.href.match(regExp)) {
                    return link;
                }
            })[0];
        }
    }, {
        key: 'toArray',

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        value: function toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        }
    }, {
        key: 'moduleDocument',

        /**
         * @method moduleDocument
         * @param {String} elementName
         * @return {void}
         */
        value: function moduleDocument(elementName) {}
    }, {
        key: 'register',

        /**
         * @method delegate
         * @param {Array} modules
         * @return {void}
         */
        value: function register() {
            for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
                modules[_key] = arguments[_key];
            }

            Promise.all(this.getImports()).then(function (linkElements) {});

            //modules.forEach((name) => {
            //
            //    let elementName     = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
            //        documentElement = this.moduleDocument(elementName);
            //
            //    let prototype     = Object.create(HTMLElement.prototype, {
            //
            //        /**
            //         * @property createdCallback
            //         * @type {Object}
            //         */
            //        createdCallback: {
            //
            //            /**
            //             * @method value
            //             * @return {void}
            //             */
            //            value: function value() {
            //
            //                //this.innerHTML = '';
            //                //
            //                //// Todo: Make all of this dynamic!
            //                //let path = 'app/components/user-calendar';
            //                //
            //                //System.import(`${path}/calendar`).then((Component) => {
            //                //
            //                //    let element        = React.createElement(Component.default),
            //                //        contentElement = document.createElement('content'),
            //                //        shadowRoot     = this.createShadowRoot();
            //                //
            //                //    //console.log(Component.default.toString());
            //                //
            //                //    css.associate(path, shadowRoot);
            //                //    shadowRoot.appendChild(contentElement);
            //                //
            //                //    let component = React.render(element, contentElement);
            //                //    events.delegate(contentElement, component);
            //                //
            //                //});
            //
            //            }
            //
            //        }
            //
            //    });
            //
            //    document.registerElement(elementName, {
            //        prototype: prototype
            //    });
            //
            //});
        }
    }]);

    return Component;
})();

exports['default'] = Component;
module.exports = exports['default'];

//let importDocument = this.findImport(elementName),
//    scriptElements = importDocument.document.querySelectorAll('script[type="text/javascript"]');
//
//console.log(importDocument);

},{"./../helpers/Events.js":3,"./../helpers/Stylesheets.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    return {

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
             * @method getEvent
             * @param {String} eventName
             * @param {Object} properties
             * @return {Boolean}
             */
            function getEvent(eventName, properties) {

                var matchName = new RegExp(eventName, 'i'),
                    eventFn = null;

                Object.keys(properties).forEach(function (property) {

                    var propertyName = property.match(matchName);

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
            function findEvents(_x, _x2, _x3) {
                var _again = true;

                _function: while (_again) {
                    events = rootEventFn = children = id = item = childEventFn = undefined;
                    _again = false;
                    var node = _x,
                        reactId = _x2,
                        eventName = _x3;

                    var events = [],
                        rootEventFn = getEvent(eventName, node._currentElement._store.props);

                    if (rootEventFn) {

                        // Found event in root!
                        events.push(rootEventFn);
                    }

                    if (node._rootNodeID === reactId) {
                        return events;
                    }

                    var children = node._renderedChildren;

                    for (var id in children) {

                        if (children.hasOwnProperty(id)) {

                            var item = children[id];

                            if (item._rootNodeID === reactId) {

                                var childEventFn = getEvent(eventName, item._instance.props);

                                if (childEventFn) {

                                    // Found event in children!
                                    events.push(childEventFn);
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
                        eventFn = 'on' + event.type,
                        events = findEvents(components, event.target.getAttribute('data-reactid'), eventFn);

                    events.forEach(function (eventFn) {
                        eventFn.apply(component);
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
})();

module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main($document) {

    'use strict';

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
        toArray: function toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        },

        /**
         * @method associate
         * @param {String} componentPath
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associate: function associate(componentPath, shadowRoot) {
            var _this = this;

            this.toArray(document.querySelectorAll('link')).forEach(function (link) {

                var href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    var templateElement = link['import'].querySelector('template'),
                        templateContent = templateElement.content,
                        cssDocuments = _this.toArray(templateContent.querySelectorAll('link')).map(function (linkElement) {
                        return '' + componentPath + '/' + linkElement.getAttribute('href');
                    });

                    cssDocuments.forEach(function (cssDocument) {

                        var styleElement = $document.createElement('style');
                        styleElement.setAttribute('type', 'text/css');
                        styleElement.innerHTML = '@import url(' + cssDocument + ')';
                        shadowRoot.appendChild(styleElement);
                    });
                }
            });
        }

    };
})(document);

module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TdHlsZXNoZWV0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3lCQ0FzQiwyQkFBMkI7Ozs7QUFFakQsQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRXBCLGdCQUFZLENBQUM7Ozs7Ozs7O1FBT1AsS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxnQkFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07O0FBRWhELGdCQUFJLFVBQVUsR0FBRyw0QkFBZSxDQUFDO0FBQ2pDLHNCQUFVLENBQUMsUUFBUSxNQUFBLENBQW5CLFVBQVUscUJBQWEsT0FBTyxFQUFDLENBQUM7U0FFbkMsQ0FBQyxDQUFDO0tBRU47O0FBSUwsV0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Q0FFekIsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7c0JDakNTLHdCQUF3Qjs7OzttQkFDeEIsNkJBQTZCOzs7Ozs7Ozs7OztJQVE1QixTQUFTOzs7Ozs7O0FBTWYsYUFOTSxTQUFTLEdBTVo7OEJBTkcsU0FBUzs7QUFPdEIsWUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7S0FDeEI7O2lCQVJnQixT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Z0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRTlELG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVyQyxvQkFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFOztBQUUzQix3QkFBSSxlQUFlLEdBQUcsSUFBSSxVQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQzt3QkFDdkQsZUFBZSxHQUFHLGVBQWUsQ0FBQyxPQUFPO3dCQUN6QyxZQUFZLEdBQU0sTUFBSyxPQUFPLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsV0FBVyxFQUFLO0FBQzFGLG9DQUFVLGFBQWEsU0FBSSxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFHO3FCQUNqRSxDQUFDLENBQUM7O0FBRVAsZ0NBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxXQUFXLEVBQUs7O0FBRWxDLDRCQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELG9DQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM5QyxvQ0FBWSxDQUFDLFNBQVMsb0JBQWtCLFdBQVcsTUFBRyxDQUFDO0FBQ3ZELGtDQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUV4QyxDQUFDLENBQUM7aUJBRU47YUFFSixDQUFDLENBQUM7U0FFTjs7S0FFSixDQUFDO0NBRUwsQ0FBQSxDQUFFLFFBQVEsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9Db21wb25lbnQuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgX2NvbXBvbmVudCA9IG5ldyBDb21wb25lbnQoKTtcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50LnJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAkd2luZG93Lk1hcGxlID0gTWFwbGU7XG5cbn0pKHdpbmRvdyk7IiwiaW1wb3J0IGV2ZW50cyAgZnJvbSAnLi8uLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5pbXBvcnQgY3NzICAgICBmcm9tICcuLy4uL2hlbHBlcnMvU3R5bGVzaGVldHMuanMnO1xuXG4vKipcbiAqIEBtb2R1bGUgTWFwbGVcbiAqIEBzdWJtb2R1bGUgQ29tcG9uZW50XG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldEltcG9ydHNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRJbXBvcnRzKCkge1xuXG4gICAgICAgIGxldCBpbXBvcnREb2N1bWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cImltcG9ydFwiXScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoaW1wb3J0RG9jdW1lbnRzKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaW1wb3J0RG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlc29sdmUoZXZlbnQucGF0aFswXSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9yZXR1cm4gdGhpcy50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwiaW1wb3J0XCJdJykpLm1hcCgobGlua0VsZW1lbnQpID0+IHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgbGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChsaW5rKSA9PiB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBjb25zb2xlLmxvZyhsaW5rLnBhdGhbMF0uaW1wb3J0KTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIHJldHVybiB7XG4gICAgICAgIC8vICAgICAgICBocmVmOiBsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50OiBsaW5rRWxlbWVudC5vd25lckRvY3VtZW50XG4gICAgICAgIC8vICAgIH07XG4gICAgICAgIC8vXG4gICAgICAgIC8vfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGZpbmRJbXBvcnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZmluZEltcG9ydChlbGVtZW50TmFtZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmltcG9ydHMuZmlsdGVyKChsaW5rKSA9PiB7XG5cbiAgICAgICAgICAgIGxldCByZWdFeHAgPSBuZXcgUmVnRXhwKGAke2VsZW1lbnROYW1lfVxcLyg/Oi4rPylcXC5odG1sYCwgJ2knKTtcblxuICAgICAgICAgICAgaWYgKGxpbmsuaHJlZi5tYXRjaChyZWdFeHApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbms7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlbMF07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIG1vZHVsZURvY3VtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnROYW1lXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBtb2R1bGVEb2N1bWVudChlbGVtZW50TmFtZSkge1xuXG4gICAgICAgIC8vbGV0IGltcG9ydERvY3VtZW50ID0gdGhpcy5maW5kSW1wb3J0KGVsZW1lbnROYW1lKSxcbiAgICAgICAgLy8gICAgc2NyaXB0RWxlbWVudHMgPSBpbXBvcnREb2N1bWVudC5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXScpO1xuICAgICAgICAvL1xuICAgICAgICAvL2NvbnNvbGUubG9nKGltcG9ydERvY3VtZW50KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZWdpc3RlciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5nZXRJbXBvcnRzKCkpLnRoZW4oKGxpbmtFbGVtZW50cykgPT4ge1xuXG4gICAgICAgICAgICBcblxuICAgICAgICB9KTtcblxuICAgICAgICAvL21vZHVsZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICBsZXQgZWxlbWVudE5hbWUgICAgID0gbmFtZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnRFbGVtZW50ID0gdGhpcy5tb2R1bGVEb2N1bWVudChlbGVtZW50TmFtZSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIGxldCBwcm90b3R5cGUgICAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIC8qKlxuICAgICAgICAvLyAgICAgICAgICogQHByb3BlcnR5IGNyZWF0ZWRDYWxsYmFja1xuICAgICAgICAvLyAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgLy8gICAgICAgICAqL1xuICAgICAgICAvLyAgICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgLyoqXG4gICAgICAgIC8vICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAvLyAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgIC8vICAgICAgICAgICAgICovXG4gICAgICAgIC8vICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL3RoaXMuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vLy8gVG9kbzogTWFrZSBhbGwgb2YgdGhpcyBkeW5hbWljIVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL2xldCBwYXRoID0gJ2FwcC9jb21wb25lbnRzL3VzZXItY2FsZW5kYXInO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL1N5c3RlbS5pbXBvcnQoYCR7cGF0aH0vY2FsZW5kYXJgKS50aGVuKChDb21wb25lbnQpID0+IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgLy8gICAgbGV0IGVsZW1lbnQgICAgICAgID0gUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb25lbnQuZGVmYXVsdCksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vICAgICAgICBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgLy8gICAgICAgIHNoYWRvd1Jvb3QgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vICAgIC8vY29uc29sZS5sb2coQ29tcG9uZW50LmRlZmF1bHQudG9TdHJpbmcoKSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vICAgIGNzcy5hc3NvY2lhdGUocGF0aCwgc2hhZG93Um9vdCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC8vICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvLyAgICBsZXQgY29tcG9uZW50ID0gUmVhY3QucmVuZGVyKGVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgLy8gICAgZXZlbnRzLmRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBjb21wb25lbnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAvL30pO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChlbGVtZW50TmFtZSwge1xuICAgICAgICAvLyAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGVcbiAgICAgICAgLy8gICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vfSk7XG5cbiAgICB9XG5cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBkZWxlZ2F0ZVxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3MuY3JlYXRlQ2xhc3MuQ29uc3RydWN0b3J9IGNvbXBvbmVudFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIGNvbXBvbmVudCkge1xuXG4gICAgICAgICAgICBsZXQgYUVsZW1lbnQgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcbiAgICAgICAgICAgICAgICBldmVudHMgICAgID0gW10sXG4gICAgICAgICAgICAgICAgZXZlbnRFc3F1ZSA9IC9vblthLXpdKy9pO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhRWxlbWVudCkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoa2V5Lm1hdGNoKGV2ZW50RXNxdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGtleS5yZXBsYWNlKC9eb24vLCAnJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBnZXRFdmVudFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEV2ZW50KGV2ZW50TmFtZSwgcHJvcGVydGllcykge1xuXG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoTmFtZSA9IG5ldyBSZWdFeHAoZXZlbnROYW1lLCAnaScpLFxuICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHkubWF0Y2gobWF0Y2hOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuID0gcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBldmVudEZuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBmaW5kRXZlbnRzXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJlYWN0SWRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kRXZlbnRzKG5vZGUsIHJlYWN0SWQsIGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50cyAgICAgID0gW10sXG4gICAgICAgICAgICAgICAgICAgIHJvb3RFdmVudEZuID0gZ2V0RXZlbnQoZXZlbnROYW1lLCBub2RlLl9jdXJyZW50RWxlbWVudC5fc3RvcmUucHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvb3RFdmVudEZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgZXZlbnQgaW4gcm9vdCFcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2gocm9vdEV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuX3Jvb3ROb2RlSUQgPT09IHJlYWN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBub2RlLl9yZW5kZXJlZENoaWxkcmVuO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gY2hpbGRyZW4pIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaWQpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gY2hpbGRyZW5baWRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkRXZlbnRGbiA9IGdldEV2ZW50KGV2ZW50TmFtZSwgaXRlbS5faW5zdGFuY2UucHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkRXZlbnRGbikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGV2ZW50IGluIGNoaWxkcmVuIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChjaGlsZEV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5fcmVuZGVyZWRDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5kRXZlbnRzKGl0ZW0sIHJlYWN0SWQsIGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBjcmVhdGVFdmVudFxuICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlRXZlbnQoZXZlbnROYW1lKSB7XG5cbiAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gb25DbGljayhldmVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudHMgPSBjb21wb25lbnQuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiAgICA9IGBvbiR7ZXZlbnQudHlwZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IGZpbmRFdmVudHMoY29tcG9uZW50cywgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1yZWFjdGlkJyksIGV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudEZuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuLmFwcGx5KGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnROYW1lIG9mIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGxpbmtTZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZShjb21wb25lbnRQYXRoLCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIHRoaXMudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLmZvckVhY2goKGxpbmspID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBocmVmID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgIGlmIChocmVmLm1hdGNoKGNvbXBvbmVudFBhdGgpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGxpbmsuaW1wb3J0LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cyAgICA9IHRoaXMudG9BcnJheSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2NvbXBvbmVudFBhdGh9LyR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cy5mb3JFYWNoKChjc3NEb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYEBpbXBvcnQgdXJsKCR7Y3NzRG9jdW1lbnR9KWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiXX0=
