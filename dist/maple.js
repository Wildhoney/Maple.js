(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _bind = Function.prototype.bind;

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Component = require('./components/Component.js');

var _Component2 = _interopRequireWildcard(_Component);

var _Register = require('./components/Register.js');

var _Register2 = _interopRequireWildcard(_Register);

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
            new (_bind.apply(_Register2['default'], [null].concat(_toConsumableArray(modules))))();
        });
    };

    $window.Maple = Maple;
    $window.Maple.Component = _Component2['default'];
})(window, document);

},{"./components/Component.js":2,"./components/Register.js":4}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Component = (function () {
    function Component() {
        _classCallCheck(this, Component);
    }

    _createClass(Component, [{
        key: "addEventListener",

        /**
         * @constructor
         * @param {String} name
         * @return {Component}
         */
        value: function addEventListener(name) {

            this.props.dispatcher.addEventListener(name, { reference: this, callback: function callback(event) {
                    return event;
                } });
        }
    }, {
        key: "removeEventListener",

        /**
         * @method removeEventListener
         * @param {String} name
         * @return {void}
         */
        value: function removeEventListener(name) {
            this.props.dispatcher.removeEventListener(name, this);
        }
    }]);

    return Component;
})();

exports["default"] = Component;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @module Maple
 * @submodule Dispatcher
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Dispatcher = (function () {

    /**
     * @constructor
     * @return {Dispatcher}
     */

    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        this.events = {};
    }

    _createClass(Dispatcher, [{
        key: "addEventListener",

        /**
         * @method addEventListener
         * @param {String} name
         * @param {Object} [options={}]
         * @return {void}
         */
        value: function addEventListener(name) {
            var options = arguments[1] === undefined ? { reference: null, callback: function callback() {} } : arguments[1];

            if (!Array.isArray(this.events[name])) {
                this.events[name] = [];
            }

            this.events[name].push(options);
        }
    }, {
        key: "removeEventListener",

        /**
         * @method removeEventListener
         * @param {String} name
         * @param {Object} reference
         * @return {void}
         */
        value: function removeEventListener(name, reference) {
            return void { name: name, reference: reference };
        }
    }]);

    return Dispatcher;
})();

exports["default"] = Dispatcher;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
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

var _Dispatcher = require('./Dispatcher.js');

var _Dispatcher2 = _interopRequireWildcard(_Dispatcher);

/**
 * @module Maple
 * @submodule Register
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Register = (function () {

    /**
     * @constructor
     * @param {Array} modules
     * @return {Register}
     */

    function Register() {
        for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
            modules[_key] = arguments[_key];
        }

        _classCallCheck(this, Register);

        this.components = [];
        this.dispatcher = new _Dispatcher2['default']();
        this.debug = true;

        this.register.apply(this, modules);
    }

    _createClass(Register, [{
        key: 'getImports',

        /**
         * Responsible for finding all of the HTML imports and returning a promise when each of the
         * HTML imports have been successfully imported. This allows us to access the `ownerDocument`
         * on each of the link elements knowing that it isn't null.
         *
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
        key: 'findModules',

        /**
         * Responsible for finding all of the HTML imports in the current document. It will be invoked if
         * the developer doesn't explicitly pass in an array of modules to load via the Maple constructor when
         * instantiating a new application.
         *
         * @method findModules
         * @return {Array}
         */
        value: function findModules() {

            return _utility2['default'].toArray(document.querySelectorAll('link[rel="import"]')).map(function (importDocument) {

                var importPath = _utility2['default'].getImportPath(importDocument.getAttribute('href'));
                return void importPath;
            });
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
         * Responsible for creating the custom element using document.registerElement, and then appending
         * the associated React.js component.
         *
         * @method registerCustomElement
         * @param {String} className
         * @param {Object} component
         * @param {String} modulePath
         * @return {void}
         */
        value: function registerCustomElement(className, component, modulePath) {

            var elementName = _utility2['default'].toSnakeCase(className),
                dispatcher = this.dispatcher;

            this.log('Adding custom element "' + elementName + '"');
            var prototype = Object.create(HTMLElement.prototype, {

                /**
                 * @property attachedCallback
                 * @type {Object}
                 */
                attachedCallback: {

                    /**
                     * @method value
                     * @return {void}
                     */
                    value: function value() {

                        component.defaultProps = {
                            element: this.cloneNode(true),
                            dispatcher: dispatcher
                        };

                        this.innerHTML = '';
                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');

                        // Import attributes from the element and transfer to the React.js class.
                        for (var index = 0, attributes = this.attributes; index < attributes.length; index++) {

                            var attribute = attributes.item(index);

                            if (attribute.value) {
                                var _name = attribute.name.replace(/^data-/i, '');
                                component.defaultProps[_name] = attribute.value;
                            }
                        }

                        var renderedElement = React.createElement(component),
                            contentElement = document.createElement('content'),
                            shadowRoot = this.createShadowRoot();

                        _css2['default'].associate(modulePath, shadowRoot);
                        shadowRoot.appendChild(contentElement);
                        _events2['default'].delegate(contentElement, React.render(renderedElement, contentElement));
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
         * Entry point for the component initialisation. It accepts an optional parameter to initialise
         * modules explicitly, otherwise this.findModules will be invoked, and modules will be found
         * automatically from the current HTML imports of the document.
         *
         * @method delegate
         * @param {Array} modules
         * @return {void}
         */
        value: function register() {
            var _this = this;

            for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                modules[_key2] = arguments[_key2];
            }

            this.getImports().forEach(function (promise) {

                promise.then(function (linkElement) {

                    var scriptElements = _this.findScripts(linkElement['import']),
                        modulePath = _utility2['default'].getModulePath(linkElement.getAttribute('href')),
                        moduleName = _utility2['default'].getModuleName(linkElement.getAttribute('href'));

                    if (modules.length && ! ~modules.indexOf(moduleName)) {
                        return;
                    }

                    _this.log('Registering "' + moduleName + '" module at "' + modulePath + '"');

                    scriptElements.forEach(function (scriptElement) {

                        var scriptSrc = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                            scriptPath = '' + modulePath + '/' + scriptSrc;

                        System['import'](scriptPath).then(function (Register) {

                            var className = Register['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1],
                                component = _this.components[className] = Register['default'];

                            _this.registerCustomElement(className, component, modulePath);
                        });
                    });
                });
            });
        }
    }]);

    return Register;
})();

exports['default'] = Register;
module.exports = exports['default'];

},{"./../helpers/Events.js":5,"./../helpers/Stylesheets.js":6,"./../helpers/Utility.js":7,"./Dispatcher.js":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./../helpers/Utility.js":7}],7:[function(require,module,exports){
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
         * @method getModulePath
         * @param {String} importPath
         * @return {String}
         */
        getModulePath: function getModulePath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        },

        /**
         * @method getModuleName
         * @param {String} importPath
         * @return {String}
         */
        getModuleName: function getModuleName(importPath) {
            return importPath.split('/').slice(0, -1).pop();
        }

    };
})();

module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9EaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2NvbXBvbmVudHMvUmVnaXN0ZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TdHlsZXNoZWV0cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O3lCQ0FzQiwyQkFBMkI7Ozs7d0JBQzNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7Ozs7Ozs7O1FBT1AsS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakQscUZBQWdCLE9BQU8sT0FBRTtTQUM1QixDQUFDLENBQUM7S0FFTjs7QUFJTCxXQUFPLENBQUMsS0FBSyxHQUFhLEtBQUssQ0FBQztBQUNoQyxXQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMseUJB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QUFBLEtBQUs7dUJBQUksS0FBSzthQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakc7Ozs7Ozs7QUFPRCxlQUFPLEVBQUEsaUJBQUMsU0FBUyxFQUFFO0FBQ2YsbUJBQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pEOzs7Ozs7O0FBT0QscUJBQWEsRUFBQSx1QkFBQyxVQUFVLEVBQUU7QUFDdEIsbUJBQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZEOzs7Ozs7O0FBT0QscUJBQWEsRUFBQSx1QkFBQyxVQUFVLEVBQUU7QUFDdEIsbUJBQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDbkQ7O0tBRUosQ0FBQztDQUVMLENBQUEsRUFBRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9Db21wb25lbnQuanMnO1xuaW1wb3J0IFJlZ2lzdGVyICBmcm9tICcuL2NvbXBvbmVudHMvUmVnaXN0ZXIuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICAgICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IFJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgJHdpbmRvdy5NYXBsZSAgICAgICAgICAgPSBNYXBsZTtcbiAgICAkd2luZG93Lk1hcGxlLkNvbXBvbmVudCA9IENvbXBvbmVudDtcblxufSkod2luZG93LCBkb2N1bWVudCk7IiwiLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIENvbXBvbmVudFxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIobmFtZSkge1xuXG4gICAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIHsgcmVmZXJlbmNlOiB0aGlzLCBjYWxsYmFjazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQ7XG4gICAgICAgIH19KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZW1vdmVFdmVudExpc3RlbmVyKG5hbWUpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgdGhpcyk7XG4gICAgfVxuXG59IiwiLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIERpc3BhdGNoZXJcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc3BhdGNoZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHJldHVybiB7RGlzcGF0Y2hlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGFkZEV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIobmFtZSwgb3B0aW9ucyA9IHsgcmVmZXJlbmNlOiBudWxsLCBjYWxsYmFjazogKCkgPT4ge30gfSkge1xuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLmV2ZW50c1tuYW1lXSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW25hbWVdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50c1tuYW1lXS5wdXNoKG9wdGlvbnMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmZXJlbmNlXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHJlZmVyZW5jZSkge1xuICAgICAgICByZXR1cm4gdm9pZCB7IG5hbWUsIHJlZmVyZW5jZSB9O1xuICAgIH1cblxufSIsImltcG9ydCBldmVudHMgICAgIGZyb20gJy4vLi4vaGVscGVycy9FdmVudHMuanMnO1xuaW1wb3J0IGNzcyAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4vRGlzcGF0Y2hlci5qcyc7XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBSZWdpc3RlclxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0ZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge1JlZ2lzdGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyAgICAgID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBIVE1MIGltcG9ydHMgYW5kIHJldHVybmluZyBhIHByb21pc2Ugd2hlbiBlYWNoIG9mIHRoZVxuICAgICAqIEhUTUwgaW1wb3J0cyBoYXZlIGJlZW4gc3VjY2Vzc2Z1bGx5IGltcG9ydGVkLiBUaGlzIGFsbG93cyB1cyB0byBhY2Nlc3MgdGhlIGBvd25lckRvY3VtZW50YFxuICAgICAqIG9uIGVhY2ggb2YgdGhlIGxpbmsgZWxlbWVudHMga25vd2luZyB0aGF0IGl0IGlzbid0IG51bGwuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEltcG9ydHNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRJbXBvcnRzKCkge1xuXG4gICAgICAgIGxldCBpbXBvcnREb2N1bWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cImltcG9ydFwiXScpO1xuXG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoaW1wb3J0RG9jdW1lbnRzKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGltcG9ydERvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBldmVudCA9PiByZXNvbHZlKGV2ZW50LnBhdGhbMF0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBIVE1MIGltcG9ydHMgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQuIEl0IHdpbGwgYmUgaW52b2tlZCBpZlxuICAgICAqIHRoZSBkZXZlbG9wZXIgZG9lc24ndCBleHBsaWNpdGx5IHBhc3MgaW4gYW4gYXJyYXkgb2YgbW9kdWxlcyB0byBsb2FkIHZpYSB0aGUgTWFwbGUgY29uc3RydWN0b3Igd2hlblxuICAgICAqIGluc3RhbnRpYXRpbmcgYSBuZXcgYXBwbGljYXRpb24uXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZpbmRNb2R1bGVzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZmluZE1vZHVsZXMoKSB7XG5cbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cImltcG9ydFwiXScpKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbXBvcnRQYXRoID0gdXRpbGl0eS5nZXRJbXBvcnRQYXRoKGltcG9ydERvY3VtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIGltcG9ydFBhdGg7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGZpbmRTY3JpcHRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltcG9ydERvY3VtZW50XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZmluZFNjcmlwdHMoaW1wb3J0RG9jdW1lbnQpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGltcG9ydERvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBjdXN0b20gZWxlbWVudCB1c2luZyBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQsIGFuZCB0aGVuIGFwcGVuZGluZ1xuICAgICAqIHRoZSBhc3NvY2lhdGVkIFJlYWN0LmpzIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVnaXN0ZXJDdXN0b21FbGVtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kdWxlUGF0aFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVnaXN0ZXJDdXN0b21FbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKSB7XG5cbiAgICAgICAgbGV0IGVsZW1lbnROYW1lID0gdXRpbGl0eS50b1NuYWtlQ2FzZShjbGFzc05hbWUpLFxuICAgICAgICAgICAgZGlzcGF0Y2hlciAgPSB0aGlzLmRpc3BhdGNoZXI7XG5cbiAgICAgICAgdGhpcy5sb2coYEFkZGluZyBjdXN0b20gZWxlbWVudCBcIiR7ZWxlbWVudE5hbWV9XCJgKTtcbiAgICAgICAgbGV0IHByb3RvdHlwZSAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAgICB0aGlzLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXI6IGRpc3BhdGNoZXJcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgncmVzb2x2ZWQnLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudCBhbmQgdHJhbnNmZXIgdG8gdGhlIFJlYWN0LmpzIGNsYXNzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAsIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXM7IGluZGV4IDwgYXR0cmlidXRlcy5sZW5ndGg7IGluZGV4KyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoL15kYXRhLS9pLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkRWxlbWVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzcy5hc3NvY2lhdGUobW9kdWxlUGF0aCwgc2hhZG93Um9vdCk7XG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZWxlbWVudE5hbWUsIHtcbiAgICAgICAgICAgIHByb3RvdHlwZTogcHJvdG90eXBlXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2dcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9nKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGBNYXBsZS5qczogJHttZXNzYWdlfS5gKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW50cnkgcG9pbnQgZm9yIHRoZSBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uIEl0IGFjY2VwdHMgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRvIGluaXRpYWxpc2VcbiAgICAgKiBtb2R1bGVzIGV4cGxpY2l0bHksIG90aGVyd2lzZSB0aGlzLmZpbmRNb2R1bGVzIHdpbGwgYmUgaW52b2tlZCwgYW5kIG1vZHVsZXMgd2lsbCBiZSBmb3VuZFxuICAgICAqIGF1dG9tYXRpY2FsbHkgZnJvbSB0aGUgY3VycmVudCBIVE1MIGltcG9ydHMgb2YgdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWxlZ2F0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICB0aGlzLmdldEltcG9ydHMoKS5mb3JFYWNoKChwcm9taXNlKSA9PiB7XG5cbiAgICAgICAgICAgIHByb21pc2UudGhlbigobGlua0VsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IHRoaXMuZmluZFNjcmlwdHMobGlua0VsZW1lbnQuaW1wb3J0KSxcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlTmFtZShsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlcy5sZW5ndGggJiYgIX5tb2R1bGVzLmluZGV4T2YobW9kdWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBSZWdpc3RlcmluZyBcIiR7bW9kdWxlTmFtZX1cIiBtb2R1bGUgYXQgXCIke21vZHVsZVBhdGh9XCJgKTtcblxuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnRzLmZvckVhY2goKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NyaXB0U3JjICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRQYXRoID0gYCR7bW9kdWxlUGF0aH0vJHtzY3JpcHRTcmN9YDtcblxuICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKFJlZ2lzdGVyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBSZWdpc3Rlci5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbY2xhc3NOYW1lXSA9IFJlZ2lzdGVyLmRlZmF1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJDdXN0b21FbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7UmVhY3RDbGFzcy5jcmVhdGVDbGFzcy5Db25zdHJ1Y3Rvcn0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBkZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgY29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBhRWxlbWVudCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICBldmVudEVzcXVlID0gL29uW2Etel0rL2k7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFFbGVtZW50KS5mb3JFYWNoKChrZXkpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2goZXZlbnRFc3F1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goa2V5LnJlcGxhY2UoL15vbi8sICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEV2ZW50XG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xuICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RXZlbnQoZXZlbnROYW1lLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hOYW1lID0gbmV3IFJlZ0V4cChldmVudE5hbWUsICdpJyksXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5tYXRjaChtYXRjaE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50Rm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGZpbmRFdmVudHNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVhY3RJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRFdmVudHMobm9kZSwgcmVhY3RJZCwgZXZlbnROYW1lKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRzICAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIG5vZGUuX2N1cnJlbnRFbGVtZW50Ll9zdG9yZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocm9vdEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiByb290IVxuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChyb290RXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZCBpbiBjaGlsZHJlbikge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBjaGlsZHJlbltpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRFdmVudEZuID0gZ2V0RXZlbnQoZXZlbnROYW1lLCBpdGVtLl9pbnN0YW5jZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRFdmVudEZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgZXZlbnQgaW4gY2hpbGRyZW4hXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGNoaWxkRXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yZW5kZXJlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRFdmVudHMoaXRlbSwgcmVhY3RJZCwgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUV2ZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVFdmVudChldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50cyA9IGNvbXBvbmVudC5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgID0gYG9uJHtldmVudC50eXBlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMgICAgID0gZmluZEV2ZW50cyhjb21wb25lbnRzLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKSwgZXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50Rm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4uYXBwbHkoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudE5hbWUgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBsaW5rU2VsZWN0b3JcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGxpbmtTZWxlY3RvcjogJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBhc3NvY2lhdGVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNvbXBvbmVudFBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTaGFkb3dSb290fSBzaGFkb3dSb290XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBhc3NvY2lhdGUoY29tcG9uZW50UGF0aCwgc2hhZG93Um9vdCkge1xuXG4gICAgICAgICAgICB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5mb3JFYWNoKChsaW5rKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaHJlZiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaHJlZi5tYXRjaChjb21wb25lbnRQYXRoKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnQgPSBsaW5rLmltcG9ydC5xdWVyeVNlbGVjdG9yKCd0ZW1wbGF0ZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDb250ZW50ID0gdGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMgICAgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmsnKSkubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtjb21wb25lbnRQYXRofS8ke2xpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMuZm9yRWFjaCgoY3NzRG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlRWxlbWVudCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGBAaW1wb3J0IHVybCgke2Nzc0RvY3VtZW50fSlgO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KShkb2N1bWVudCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9TbmFrZUNhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2pvaW5lcj0nLSddXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRvU25ha2VDYXNlKGNhbWVsQ2FzZSwgam9pbmVyID0gJy0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FtZWxDYXNlLnNwbGl0KC8oW0EtWl1bYS16XXswLH0pL2cpLmZpbHRlcihwYXJ0cyA9PiBwYXJ0cykuam9pbihqb2luZXIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0TW9kdWxlUGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRNb2R1bGVQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRNb2R1bGVOYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE1vZHVsZU5hbWUoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkucG9wKCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7Il19
