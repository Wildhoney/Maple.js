(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Component = require('./components/Component.js');

var _Component2 = _interopRequireWildcard(_Component);

(function main($window, $document) {

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

        $document.addEventListener('DOMContentLoaded', function () {

            var _component = new _Component2['default'](true);
            _component.register.apply(_component, _toConsumableArray(modules));
        });
    };

    $window.Maple = Maple;
})(window, document);

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

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Component = (function () {

    /**
     * @constructor
     * @param {Boolean} debug
     * @return {Component}
     */

    function Component(debug) {
        _classCallCheck(this, Component);

        this.components = [];
        this.debug = debug || false;
    }

    _createClass(Component, [{
        key: 'getImports',

        /**
         * @method getImports
         * @return {Array}
         */
        value: function getImports() {

            var importDocuments = document.querySelectorAll('link[rel="import"]');

            return _utility2['default'].toArray(importDocuments).map(function (importDocument) {

                return new Promise(function (resolve) {
                    importDocument.addEventListener('load', function (event) {
                        return resolve(event.path[0]);
                    });
                });
            });
        }
    }, {
        key: 'findImport',

        /**
         * @method findImport
         * @param {String} className
         * @return {Object}
         */
        value: function findImport(className) {

            return this.linkElements.filter(function (linkElement) {

                var regExp = new RegExp('' + className + '/(?:.+?).html', 'i');

                if (linkElement.href.match(regExp)) {
                    return true;
                }
            })[0];
        }
    }, {
        key: 'findScripts',

        /**
         * @method findScripts
         * @param {Object} importDocument
         * @return {Array}
         */
        value: function findScripts(importDocument) {
            var templateElement = importDocument.querySelector('template');
            return _utility2['default'].toArray(templateElement.content.querySelectorAll('script[type="text/javascript"]'));
        }
    }, {
        key: 'registerCustomElement',

        /**
         * @method registerCustomElement
         * @param {String} className
         * @param {Object} component
         * @param {String} modulePath
         * @return {void}
         */
        value: function registerCustomElement(className, component, modulePath) {

            var elementName = _utility2['default'].toSnakeCase(className);
            this.log('Adding custom element "' + elementName + '"');
            var prototype = Object.create(HTMLElement.prototype, {

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

                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');

                        // Import attributes from the element and transfer to the React.js class.
                        component.defaultProps = {};
                        for (var index = 0, attributes = this.attributes; index < attributes.length; index++) {
                            var attribute = attributes.item(index);
                            if (attribute.value) {
                                component.defaultProps[attribute.name] = attribute.value;
                            }
                        }

                        var rendered = React.createElement(component),
                            contentElement = document.createElement('content'),
                            shadowRoot = this.createShadowRoot();

                        _css2['default'].associate(modulePath, shadowRoot);
                        shadowRoot.appendChild(contentElement);
                        _events2['default'].delegate(contentElement, React.render(rendered, contentElement));
                    }

                }

            });

            document.registerElement(elementName, {
                prototype: prototype
            });
        }
    }, {
        key: 'log',

        /**
         * @method log
         * @param {String} message
         * @return {void}
         */
        value: function log(message) {

            if (this.debug) {
                console.info('Maple.js: ' + message + '.');
            }
        }
    }, {
        key: 'register',

        /**
         * @method delegate
         * @param {Array} modules
         * @return {void}
         */
        value: function register() {
            var _this = this;

            for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
                modules[_key] = arguments[_key];
            }

            Promise.all(this.getImports()).then(function (linkElements) {

                _this.linkElements = linkElements;

                modules.forEach(function (name) {

                    name = {
                        camelcase: name,
                        underscore: _utility2['default'].toSnakeCase(name)
                    };

                    var importDocument = _this.findImport(name.underscore),
                        scriptElements = _this.findScripts(importDocument['import']),
                        modulePath = _utility2['default'].getImportPath(importDocument.getAttribute('href'));

                    _this.log('Registering module "' + name.camelcase + '" with path "' + modulePath + '"');

                    scriptElements.forEach(function (scriptElement) {

                        var scriptSrc = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                            scriptPath = '' + modulePath + '/' + scriptSrc;

                        System['import'](scriptPath).then(function (Component) {

                            var className = Component['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1];
                            var component = _this.components[className] = Component['default'];
                            _this.registerCustomElement(className, component, modulePath);
                        });
                    });
                });
            });
        }
    }]);

    return Component;
})();

exports['default'] = Component;
module.exports = exports['default'];

},{"./../helpers/Events.js":3,"./../helpers/Stylesheets.js":4,"./../helpers/Utility.js":5}],3:[function(require,module,exports){
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

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

exports['default'] = (function main($document) {

    'use strict';

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
        associate: function associate(componentPath, shadowRoot) {

            _utility2['default'].toArray(document.querySelectorAll('link')).forEach(function (link) {

                var href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    var templateElement = link['import'].querySelector('template'),
                        templateContent = templateElement.content,
                        cssDocuments = _utility2['default'].toArray(templateContent.querySelectorAll('link')).map(function (linkElement) {
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

},{"./../helpers/Utility.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    return {

        /**
         * @method toSnakeCase
         * @param {String} camelCase
         * @param {String} [joiner='-']
         * @return {String}
         */
        toSnakeCase: function toSnakeCase(camelCase) {
            var joiner = arguments[1] === undefined ? '-' : arguments[1];

            return camelCase.split(/([A-Z][a-z]{0,})/g).filter(function (parts) {
                return parts;
            }).join(joiner).toLowerCase();
        },

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray: function toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        },

        /**
         * @method getImportPath
         * @param {String} importPath
         * @return {String}
         */
        getImportPath: function getImportPath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        }

    };
})();

module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TdHlsZXNoZWV0cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt5QkNBc0IsMkJBQTJCOzs7O0FBRWpELENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRTs7QUFFL0IsZ0JBQVksQ0FBQzs7Ozs7Ozs7UUFPUCxLQUFLOzs7Ozs7O0FBT0ksYUFQVCxLQUFLLEdBT2lCOzBDQUFULE9BQU87QUFBUCxtQkFBTzs7OzhCQVBwQixLQUFLOztBQVNILGlCQUFTLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBTTs7QUFFakQsZ0JBQUksVUFBVSxHQUFHLDJCQUFjLElBQUksQ0FBQyxDQUFDO0FBQ3JDLHNCQUFVLENBQUMsUUFBUSxNQUFBLENBQW5CLFVBQVUscUJBQWEsT0FBTyxFQUFDLENBQUM7U0FFbkMsQ0FBQyxDQUFDO0tBRU47O0FBSUwsV0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Q0FFekIsQ0FBQSxDQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O3NCQ2pDRCx3QkFBd0I7Ozs7bUJBQ3hCLDZCQUE2Qjs7Ozt1QkFDN0IseUJBQXlCOzs7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dGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudHMvQ29tcG9uZW50LmpzJztcblxuKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IF9jb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KHRydWUpO1xuICAgICAgICAgICAgICAgIF9jb21wb25lbnQucmVnaXN0ZXIoLi4ubW9kdWxlcyk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgICR3aW5kb3cuTWFwbGUgPSBNYXBsZTtcblxufSkod2luZG93LCBkb2N1bWVudCk7IiwiaW1wb3J0IGV2ZW50cyAgZnJvbSAnLi8uLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5pbXBvcnQgY3NzICAgICBmcm9tICcuLy4uL2hlbHBlcnMvU3R5bGVzaGVldHMuanMnO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG4vKipcbiAqIEBtb2R1bGUgTWFwbGVcbiAqIEBzdWJtb2R1bGUgQ29tcG9uZW50XG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZWJ1Z1xuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkZWJ1Zykge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5kZWJ1ZyAgICAgID0gZGVidWcgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRJbXBvcnRzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0SW1wb3J0cygpIHtcblxuICAgICAgICBsZXQgaW1wb3J0RG9jdW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJpbXBvcnRcIl0nKTtcblxuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGltcG9ydERvY3VtZW50cykubWFwKChpbXBvcnREb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBpbXBvcnREb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZXZlbnQgPT4gcmVzb2x2ZShldmVudC5wYXRoWzBdKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZmluZEltcG9ydFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZmluZEltcG9ydChjbGFzc05hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5saW5rRWxlbWVudHMuZmlsdGVyKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcmVnRXhwID0gbmV3IFJlZ0V4cChgJHtjbGFzc05hbWV9XFwvKD86Lis/KVxcLmh0bWxgLCAnaScpO1xuXG4gICAgICAgICAgICBpZiAobGlua0VsZW1lbnQuaHJlZi5tYXRjaChyZWdFeHApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlbMF07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGZpbmRTY3JpcHRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltcG9ydERvY3VtZW50XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZmluZFNjcmlwdHMoaW1wb3J0RG9jdW1lbnQpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGltcG9ydERvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCByZWdpc3RlckN1c3RvbUVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2R1bGVQYXRoXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZWdpc3RlckN1c3RvbUVsZW1lbnQoY2xhc3NOYW1lLCBjb21wb25lbnQsIG1vZHVsZVBhdGgpIHtcblxuICAgICAgICBsZXQgZWxlbWVudE5hbWUgPSB1dGlsaXR5LnRvU25ha2VDYXNlKGNsYXNzTmFtZSk7XG4gICAgICAgIHRoaXMubG9nKGBBZGRpbmcgY3VzdG9tIGVsZW1lbnQgXCIke2VsZW1lbnROYW1lfVwiYCk7XG4gICAgICAgIGxldCBwcm90b3R5cGUgICA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHByb3BlcnR5IGNyZWF0ZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgncmVzb2x2ZWQnLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudCBhbmQgdHJhbnNmZXIgdG8gdGhlIFJlYWN0LmpzIGNsYXNzLlxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGVmYXVsdFByb3BzID0ge307XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wc1thdHRyaWJ1dGUubmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWQgICAgICAgPSBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3NzLmFzc29jaWF0ZShtb2R1bGVQYXRoLCBzaGFkb3dSb290KTtcbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5kZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgUmVhY3QucmVuZGVyKHJlbmRlcmVkLCBjb250ZW50RWxlbWVudCkpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnROYW1lLCB7XG4gICAgICAgICAgICBwcm90b3R5cGU6IHByb3RvdHlwZVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9nXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGxvZyhtZXNzYWdlKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhgTWFwbGUuanM6ICR7bWVzc2FnZX0uYCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZWdpc3RlciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5nZXRJbXBvcnRzKCkpLnRoZW4oKGxpbmtFbGVtZW50cykgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmxpbmtFbGVtZW50cyA9IGxpbmtFbGVtZW50cztcblxuICAgICAgICAgICAgbW9kdWxlcy5mb3JFYWNoKChuYW1lKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBuYW1lID0ge1xuICAgICAgICAgICAgICAgICAgICBjYW1lbGNhc2U6ICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICB1bmRlcnNjb3JlOiB1dGlsaXR5LnRvU25ha2VDYXNlKG5hbWUpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGxldCBpbXBvcnREb2N1bWVudCA9IHRoaXMuZmluZEltcG9ydChuYW1lLnVuZGVyc2NvcmUpLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cyA9IHRoaXMuZmluZFNjcmlwdHMoaW1wb3J0RG9jdW1lbnQuaW1wb3J0KSxcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldEltcG9ydFBhdGgoaW1wb3J0RG9jdW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFJlZ2lzdGVyaW5nIG1vZHVsZSBcIiR7bmFtZS5jYW1lbGNhc2V9XCIgd2l0aCBwYXRoIFwiJHttb2R1bGVQYXRofVwiYCk7XG5cbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cy5mb3JFYWNoKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcmlwdFNyYyAgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0UGF0aCA9IGAke21vZHVsZVBhdGh9LyR7c2NyaXB0U3JjfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgU3lzdGVtLmltcG9ydChzY3JpcHRQYXRoKS50aGVuKChDb21wb25lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IENvbXBvbmVudC5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbY2xhc3NOYW1lXSA9IENvbXBvbmVudC5kZWZhdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckN1c3RvbUVsZW1lbnQoY2xhc3NOYW1lLCBjb21wb25lbnQsIG1vZHVsZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtSZWFjdENsYXNzLmNyZWF0ZUNsYXNzLkNvbnN0cnVjdG9yfSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGFFbGVtZW50ICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXG4gICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IFtdLFxuICAgICAgICAgICAgICAgIGV2ZW50RXNxdWUgPSAvb25bYS16XSsvaTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYUVsZW1lbnQpLmZvckVhY2goKGtleSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGtleS5tYXRjaChldmVudEVzcXVlKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChrZXkucmVwbGFjZSgvXm9uLywgJycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0RXZlbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRFdmVudChldmVudE5hbWUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaE5hbWUgPSBuZXcgUmVnRXhwKGV2ZW50TmFtZSwgJ2knKSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiAgID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Lm1hdGNoKG1hdGNoTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRGbjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZmluZEV2ZW50c1xuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZWFjdElkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEV2ZW50cyhub2RlLCByZWFjdElkLCBldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBldmVudHMgICAgICA9IFtdLFxuICAgICAgICAgICAgICAgICAgICByb290RXZlbnRGbiA9IGdldEV2ZW50KGV2ZW50TmFtZSwgbm9kZS5fY3VycmVudEVsZW1lbnQuX3N0b3JlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb290RXZlbnRGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGV2ZW50IGluIHJvb3QhXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKHJvb3RFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChub2RlLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5fcmVuZGVyZWRDaGlsZHJlbjtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkIGluIGNoaWxkcmVuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGlkKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGNoaWxkcmVuW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3Jvb3ROb2RlSUQgPT09IHJlYWN0SWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIGl0ZW0uX2luc3RhbmNlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiBjaGlsZHJlbiFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goY2hpbGRFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3JlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmluZEV2ZW50cyhpdGVtLCByZWFjdElkLCBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgY3JlYXRlRXZlbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRzID0gY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICAgPSBgb24ke2V2ZW50LnR5cGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBmaW5kRXZlbnRzKGNvbXBvbmVudHMsIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVhY3RpZCcpLCBldmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRGbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbi5hcHBseShjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50TmFtZSBvZiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGxpbmtTZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZShjb21wb25lbnRQYXRoLCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLmZvckVhY2goKGxpbmspID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBocmVmID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgIGlmIChocmVmLm1hdGNoKGNvbXBvbmVudFBhdGgpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGxpbmsuaW1wb3J0LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cyAgICA9IHV0aWxpdHkudG9BcnJheSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2NvbXBvbmVudFBhdGh9LyR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cy5mb3JFYWNoKChjc3NEb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYEBpbXBvcnQgdXJsKCR7Y3NzRG9jdW1lbnR9KWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRJbXBvcnRQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldEltcG9ydFBhdGgoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyJdfQ==
