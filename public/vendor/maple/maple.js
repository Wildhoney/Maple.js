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

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Component = (function (_React$Component) {
    function Component() {
        _classCallCheck(this, Component);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Component, _React$Component);

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
})(React.Component);

exports["default"] = Component;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
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
        var _this = this;

        _classCallCheck(this, Dispatcher);

        this.events = [];

        setTimeout(function () {
            return _this.fireEvent('people');
        }, 5500);
    }

    _createClass(Dispatcher, [{
        key: 'fireEvent',

        /**
         * @method fireEvent
         * @param {String} name
         * @return {void}
         */
        value: function fireEvent(name) {

            var eventFns = this.events.filter(function (event) {
                return event.name === name;
            }),
                people = ['Buster', 'Miss Kittens', 'Kipper', 'Splodge', 'Mango'];

            eventFns.forEach(function (event) {
                event.reference.setState({ names: people.join(',') });
            });
        }
    }, {
        key: 'addEventListener',

        /**
         * @method addEventListener
         * @param {String} name
         * @param {Object} [options={}]
         * @return {void}
         */
        value: function addEventListener(name) {
            var options = arguments[1] === undefined ? { reference: null, callback: function callback() {} } : arguments[1];

            this.events.push({
                name: name,
                reference: options.reference,
                callback: options.callback
            });
        }
    }, {
        key: 'removeEventListener',

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

exports['default'] = Dispatcher;
module.exports = exports['default'];

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

var _logger = require('./../helpers/Logger.js');

var _logger2 = _interopRequireWildcard(_logger);

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

            var importDocuments = document.querySelectorAll('link[rel="import"][resource="component"]');

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

            var templateElements = _utility2['default'].toArray(importDocument.querySelectorAll('template')),
                allScriptElements = [];

            templateElements.forEach(function (templateElement) {

                var scriptElements = _utility2['default'].toArray(templateElement.content.querySelectorAll('script[type="text/javascript"]'));
                allScriptElements = [].concat(allScriptElements, scriptElements);
            });

            return allScriptElements;
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

            _logger2['default'].send('' + elementName, _logger2['default'].type.component);
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
                        var _this = this;

                        component.defaultProps = {
                            path: modulePath,
                            element: this.cloneNode(true),
                            dispatcher: dispatcher
                        };

                        this.innerHTML = '';

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

                        shadowRoot.appendChild(contentElement);
                        _events2['default'].delegate(contentElement, React.render(renderedElement, contentElement));

                        Promise.all(_css2['default'].associate(modulePath, shadowRoot)).then(function () {
                            _this.removeAttribute('unresolved');
                            _this.setAttribute('resolved', '');
                        });
                    }

                }

            });

            document.registerElement(elementName, {
                prototype: prototype
            });
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
            var _this2 = this;

            for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                modules[_key2] = arguments[_key2];
            }

            this.getImports().forEach(function (promise) {

                promise.then(function (linkElement) {

                    var scriptElements = _this2.findScripts(linkElement['import']),
                        modulePath = _utility2['default'].getModulePath(linkElement.getAttribute('href')),
                        moduleName = _utility2['default'].getModuleName(linkElement.getAttribute('href'));

                    if (modules.length && ! ~modules.indexOf(moduleName)) {
                        return;
                    }

                    _logger2['default'].send(moduleName, _logger2['default'].type.module);

                    scriptElements.forEach(function (scriptElement) {

                        var scriptSrc = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                            scriptPath = '' + modulePath + '/' + scriptSrc;

                        System['import'](scriptPath).then(function (Register) {

                            var className = Register['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1],
                                component = _this2.components[className] = Register['default'];

                            _this2.registerCustomElement(className, component, modulePath);
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

},{"./../helpers/Events.js":5,"./../helpers/Logger.js":6,"./../helpers/Stylesheets.js":7,"./../helpers/Utility.js":8,"./Dispatcher.js":3}],5:[function(require,module,exports){
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

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    return {

        /**
         * @constant type
         * @type {Object}
         */
        type: {
            module: 'module',
            component: 'component'
        },

        /**
         * @method send
         * @param {String} message
         * @param {String} type
         * @return {void}
         */
        send: function send(message, type) {

            switch (type) {

                case this.type.module:
                    console.log('%c Module: ' + message + ' ', 'color: white; border-radius: 3px; padding: 2px 0; font-size: 9px; background: linear-gradient(to bottom,  #ef3232 0%,#d63a2c 100%)');
                    break;

                case this.type.component:
                    console.log('%c Component: <' + message + '>', 'font-size: 9px; color: rgba(0, 0, 0, .75)');
                    break;

                default:
                    console.log(message);

            }
        }

    };
})();

module.exports = exports['default'];

},{}],7:[function(require,module,exports){
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
         * @return {Array}
         */
        associate: function associate(componentPath, shadowRoot) {

            var promises = [];

            _utility2['default'].toArray(document.querySelectorAll('link')).forEach(function (link) {

                var href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    var templateElements = _utility2['default'].toArray(link['import'].querySelectorAll('template'));

                    templateElements.forEach(function (templateElement) {

                        var templateContent = templateElement.content,
                            cssDocuments = _utility2['default'].toArray(templateContent.querySelectorAll('link')).map(function (linkElement) {
                            return '' + componentPath + '/' + linkElement.getAttribute('href');
                        });

                        cssDocuments.forEach(function (cssDocument) {

                            var styleElement = $document.createElement('style');
                            styleElement.setAttribute('type', 'text/css');

                            promises.push(new Promise(function (resolve) {

                                fetch(cssDocument).then(function (response) {
                                    return response.text();
                                }).then(function (body) {
                                    styleElement.innerHTML = body;
                                    shadowRoot.appendChild(styleElement);
                                    resolve(styleElement.innerHTML);
                                });
                            }));
                        });
                    });
                }
            });

            return promises;
        }

    };
})(document);

module.exports = exports['default'];

},{"./../helpers/Utility.js":8}],8:[function(require,module,exports){
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
            return Array.from ? Array.from(arrayLike) : Array.prototype.slice.apply(arrayLike);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9EaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2NvbXBvbmVudHMvUmVnaXN0ZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2dnZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TdHlsZXNoZWV0cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O3lCQ0FzQiwyQkFBMkI7Ozs7d0JBQzNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7Ozs7Ozs7O1FBT1AsS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakQscUZBQWdCLE9BQU8sT0FBRTtTQUM1QixDQUFDLENBQUM7S0FFTjs7QUFJTCxXQUFP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QUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0Rjs7Ozs7OztBQU9ELHFCQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFO0FBQ3RCLG1CQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2RDs7Ozs7OztBQU9ELHFCQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFO0FBQ3RCLG1CQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ25EOztLQUVKLENBQUM7Q0FFTCxDQUFBLEVBQUciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudHMvQ29tcG9uZW50LmpzJztcbmltcG9ydCBSZWdpc3RlciAgZnJvbSAnLi9jb21wb25lbnRzL1JlZ2lzdGVyLmpzJztcblxuKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBSZWdpc3RlciguLi5tb2R1bGVzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgICR3aW5kb3cuTWFwbGUgICAgICAgICAgID0gTWFwbGU7XG4gICAgJHdpbmRvdy5NYXBsZS5Db21wb25lbnQgPSBDb21wb25lbnQ7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsIi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBDb21wb25lbnRcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKi9cbiAgICBhZGRFdmVudExpc3RlbmVyKG5hbWUpIHtcblxuICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCB7IHJlZmVyZW5jZTogdGhpcywgY2FsbGJhY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgICB9fSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lKSB7XG4gICAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2hlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHRoaXMpO1xuICAgIH1cblxufSIsIi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBEaXNwYXRjaGVyXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNwYXRjaGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEByZXR1cm4ge0Rpc3BhdGNoZXJ9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5ldmVudHMgPSBbXTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmlyZUV2ZW50KCdwZW9wbGUnKSwgNTUwMCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGZpcmVFdmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBmaXJlRXZlbnQobmFtZSkge1xuXG4gICAgICAgIGxldCBldmVudEZucyA9IHRoaXMuZXZlbnRzLmZpbHRlcigoZXZlbnQpID0+IGV2ZW50Lm5hbWUgPT09IG5hbWUpLFxuICAgICAgICAgICAgcGVvcGxlICAgPSBbJ0J1c3RlcicsICdNaXNzIEtpdHRlbnMnLCAnS2lwcGVyJywgJ1NwbG9kZ2UnLCAnTWFuZ28nXTtcblxuICAgICAgICBldmVudEZucy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucmVmZXJlbmNlLnNldFN0YXRlKHsgbmFtZXM6IHBlb3BsZS5qb2luKCcsJykgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBhZGRFdmVudExpc3RlbmVyKG5hbWUsIG9wdGlvbnMgPSB7IHJlZmVyZW5jZTogbnVsbCwgY2FsbGJhY2s6ICgpID0+IHt9IH0pIHtcblxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICByZWZlcmVuY2U6IG9wdGlvbnMucmVmZXJlbmNlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IG9wdGlvbnMuY2FsbGJhY2tcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgcmVmZXJlbmNlKSB7XG4gICAgICAgIHJldHVybiB2b2lkIHsgbmFtZSwgcmVmZXJlbmNlIH07XG4gICAgfVxuXG59IiwiaW1wb3J0IGV2ZW50cyAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5pbXBvcnQgY3NzICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvU3R5bGVzaGVldHMuanMnO1xuaW1wb3J0IHV0aWxpdHkgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZ2dlciAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0xvZ2dlci5qcyc7XG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuL0Rpc3BhdGNoZXIuanMnO1xuXG4vKipcbiAqIEBtb2R1bGUgTWFwbGVcbiAqIEBzdWJtb2R1bGUgUmVnaXN0ZXJcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgKiBAcmV0dXJuIHtSZWdpc3Rlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gICAgICAgIHRoaXMuZGVidWcgICAgICA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlciguLi5tb2R1bGVzKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgSFRNTCBpbXBvcnRzIGFuZCByZXR1cm5pbmcgYSBwcm9taXNlIHdoZW4gZWFjaCBvZiB0aGVcbiAgICAgKiBIVE1MIGltcG9ydHMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbXBvcnRlZC4gVGhpcyBhbGxvd3MgdXMgdG8gYWNjZXNzIHRoZSBgb3duZXJEb2N1bWVudGBcbiAgICAgKiBvbiBlYWNoIG9mIHRoZSBsaW5rIGVsZW1lbnRzIGtub3dpbmcgdGhhdCBpdCBpc24ndCBudWxsLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRJbXBvcnRzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0SW1wb3J0cygpIHtcblxuICAgICAgICBsZXQgaW1wb3J0RG9jdW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJpbXBvcnRcIl1bcmVzb3VyY2U9XCJjb21wb25lbnRcIl0nKTtcblxuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGltcG9ydERvY3VtZW50cykubWFwKChpbXBvcnREb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBpbXBvcnREb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZXZlbnQgPT4gcmVzb2x2ZShldmVudC5wYXRoWzBdKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgSFRNTCBpbXBvcnRzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50LiBJdCB3aWxsIGJlIGludm9rZWQgaWZcbiAgICAgKiB0aGUgZGV2ZWxvcGVyIGRvZXNuJ3QgZXhwbGljaXRseSBwYXNzIGluIGFuIGFycmF5IG9mIG1vZHVsZXMgdG8gbG9hZCB2aWEgdGhlIE1hcGxlIGNvbnN0cnVjdG9yIHdoZW5cbiAgICAgKiBpbnN0YW50aWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBmaW5kTW9kdWxlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGZpbmRNb2R1bGVzKCkge1xuXG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJpbXBvcnRcIl0nKSkubWFwKChpbXBvcnREb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW1wb3J0UGF0aCA9IHV0aWxpdHkuZ2V0SW1wb3J0UGF0aChpbXBvcnREb2N1bWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG4gICAgICAgICAgICByZXR1cm4gdm9pZCBpbXBvcnRQYXRoO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBmaW5kU2NyaXB0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbXBvcnREb2N1bWVudFxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGZpbmRTY3JpcHRzKGltcG9ydERvY3VtZW50KSB7XG5cbiAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudHMgID0gdXRpbGl0eS50b0FycmF5KGltcG9ydERvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJykpLFxuICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXTtcblxuICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSk7XG4gICAgICAgICAgICBhbGxTY3JpcHRFbGVtZW50cyA9IFtdLmNvbmNhdChhbGxTY3JpcHRFbGVtZW50cywgc2NyaXB0RWxlbWVudHMpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhbGxTY3JpcHRFbGVtZW50cztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50LCBhbmQgdGhlbiBhcHBlbmRpbmdcbiAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZVBhdGhcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChjbGFzc05hbWUsIGNvbXBvbmVudCwgbW9kdWxlUGF0aCkge1xuXG4gICAgICAgIGxldCBlbGVtZW50TmFtZSA9IHV0aWxpdHkudG9TbmFrZUNhc2UoY2xhc3NOYW1lKSxcbiAgICAgICAgICAgIGRpc3BhdGNoZXIgID0gdGhpcy5kaXNwYXRjaGVyO1xuXG4gICAgICAgIGxvZ2dlci5zZW5kKGAke2VsZW1lbnROYW1lfWAsIGxvZ2dlci50eXBlLmNvbXBvbmVudCk7XG4gICAgICAgIGxldCBwcm90b3R5cGUgICA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHByb3BlcnR5IGF0dGFjaGVkQ2FsbGJhY2tcbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGF0dGFjaGVkQ2FsbGJhY2s6IHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgdmFsdWVcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGVmYXVsdFByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogICAgICAgbW9kdWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICAgIHRoaXMuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlclxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudCBhbmQgdHJhbnNmZXIgdG8gdGhlIFJlYWN0LmpzIGNsYXNzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAsIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXM7IGluZGV4IDwgYXR0cmlidXRlcy5sZW5ndGg7IGluZGV4KyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoL15kYXRhLS9pLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkRWxlbWVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoY3NzLmFzc29jaWF0ZShtb2R1bGVQYXRoLCBzaGFkb3dSb290KSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChlbGVtZW50TmFtZSwge1xuICAgICAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGVcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbnRyeSBwb2ludCBmb3IgdGhlIGNvbXBvbmVudCBpbml0aWFsaXNhdGlvbi4gSXQgYWNjZXB0cyBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdG8gaW5pdGlhbGlzZVxuICAgICAqIG1vZHVsZXMgZXhwbGljaXRseSwgb3RoZXJ3aXNlIHRoaXMuZmluZE1vZHVsZXMgd2lsbCBiZSBpbnZva2VkLCBhbmQgbW9kdWxlcyB3aWxsIGJlIGZvdW5kXG4gICAgICogYXV0b21hdGljYWxseSBmcm9tIHRoZSBjdXJyZW50IEhUTUwgaW1wb3J0cyBvZiB0aGUgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVnaXN0ZXIoLi4ubW9kdWxlcykge1xuXG4gICAgICAgIHRoaXMuZ2V0SW1wb3J0cygpLmZvckVhY2goKHByb21pc2UpID0+IHtcblxuICAgICAgICAgICAgcHJvbWlzZS50aGVuKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdGhpcy5maW5kU2NyaXB0cyhsaW5rRWxlbWVudC5pbXBvcnQpLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVQYXRoICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlUGF0aChsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSksXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgICAgID0gdXRpbGl0eS5nZXRNb2R1bGVOYW1lKGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICAgICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCAmJiAhfm1vZHVsZXMuaW5kZXhPZihtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9nZ2VyLnNlbmQobW9kdWxlTmFtZSwgbG9nZ2VyLnR5cGUubW9kdWxlKTtcblxuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnRzLmZvckVhY2goKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NyaXB0U3JjICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRQYXRoID0gYCR7bW9kdWxlUGF0aH0vJHtzY3JpcHRTcmN9YDtcblxuICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKFJlZ2lzdGVyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBSZWdpc3Rlci5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbY2xhc3NOYW1lXSA9IFJlZ2lzdGVyLmRlZmF1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJDdXN0b21FbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7UmVhY3RDbGFzcy5jcmVhdGVDbGFzcy5Db25zdHJ1Y3Rvcn0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBkZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgY29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBhRWxlbWVudCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICBldmVudEVzcXVlID0gL29uW2Etel0rL2k7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFFbGVtZW50KS5mb3JFYWNoKChrZXkpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2goZXZlbnRFc3F1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goa2V5LnJlcGxhY2UoL15vbi8sICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEV2ZW50XG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xuICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RXZlbnQoZXZlbnROYW1lLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hOYW1lID0gbmV3IFJlZ0V4cChldmVudE5hbWUsICdpJyksXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5tYXRjaChtYXRjaE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50Rm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGZpbmRFdmVudHNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVhY3RJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRFdmVudHMobm9kZSwgcmVhY3RJZCwgZXZlbnROYW1lKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRzICAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIG5vZGUuX2N1cnJlbnRFbGVtZW50Ll9zdG9yZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocm9vdEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiByb290IVxuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChyb290RXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZCBpbiBjaGlsZHJlbikge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBjaGlsZHJlbltpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRFdmVudEZuID0gZ2V0RXZlbnQoZXZlbnROYW1lLCBpdGVtLl9pbnN0YW5jZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRFdmVudEZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgZXZlbnQgaW4gY2hpbGRyZW4hXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGNoaWxkRXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yZW5kZXJlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRFdmVudHMoaXRlbSwgcmVhY3RJZCwgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUV2ZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVFdmVudChldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50cyA9IGNvbXBvbmVudC5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgID0gYG9uJHtldmVudC50eXBlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMgICAgID0gZmluZEV2ZW50cyhjb21wb25lbnRzLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKSwgZXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50Rm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4uYXBwbHkoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudE5hbWUgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RhbnQgdHlwZVxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgbW9kdWxlOiAnbW9kdWxlJyxcbiAgICAgICAgICAgIGNvbXBvbmVudDogJ2NvbXBvbmVudCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBzZW5kXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZW5kKG1lc3NhZ2UsIHR5cGUpIHtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICh0aGlzLnR5cGUubW9kdWxlKTpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIE1vZHVsZTogJHttZXNzYWdlfSBgLCAnY29sb3I6IHdoaXRlOyBib3JkZXItcmFkaXVzOiAzcHg7IHBhZGRpbmc6IDJweCAwOyBmb250LXNpemU6IDlweDsgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgICNlZjMyMzIgMCUsI2Q2M2EyYyAxMDAlKScpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgKHRoaXMudHlwZS5jb21wb25lbnQpOlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgQ29tcG9uZW50OiA8JHttZXNzYWdlfT5gLCAnZm9udC1zaXplOiA5cHg7IGNvbG9yOiByZ2JhKDAsIDAsIDAsIC43NSknKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGxpbmtTZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBhc3NvY2lhdGUoY29tcG9uZW50UGF0aCwgc2hhZG93Um9vdCkge1xuXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmsnKSkuZm9yRWFjaCgobGluaykgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhyZWYubWF0Y2goY29tcG9uZW50UGF0aCkpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheShsaW5rLmltcG9ydC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVDb250ZW50ID0gdGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzRG9jdW1lbnRzICAgID0gdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLm1hcCgobGlua0VsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2NvbXBvbmVudFBhdGh9LyR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzRG9jdW1lbnRzLmZvckVhY2goKGNzc0RvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoKGNzc0RvY3VtZW50KS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UudGV4dCgpKS50aGVuKChib2R5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYm9keTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc3R5bGVFbGVtZW50LmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlcztcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KShkb2N1bWVudCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9TbmFrZUNhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2pvaW5lcj0nLSddXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRvU25ha2VDYXNlKGNhbWVsQ2FzZSwgam9pbmVyID0gJy0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FtZWxDYXNlLnNwbGl0KC8oW0EtWl1bYS16XXswLH0pL2cpLmZpbHRlcihwYXJ0cyA9PiBwYXJ0cykuam9pbihqb2luZXIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSA/IEFycmF5LmZyb20oYXJyYXlMaWtlKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldE1vZHVsZVBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TW9kdWxlUGF0aChpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0TW9kdWxlTmFtZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRNb2R1bGVOYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyJdfQ==
