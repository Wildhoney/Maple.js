(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _bind = Function.prototype.bind;

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Register = require('./components/Register.js');

var _Register2 = _interopRequireWildcard(_Register);

(function main($window, $document) {

    'use strict';

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
    }

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
})(window, document);

},{"./components/Register.js":2}],2:[function(require,module,exports){
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

/**
 * @constant SELECTOR
 * @type {Object}
 */
var SELECTOR = {
    IMPORTS: 'link[rel="import"]',
    TEMPLATES: 'template',
    SCRIPTS: 'script[type="text/javascript"]'
};

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
        this.debug = true;

        this.register.apply(this, modules);
    }

    _createClass(Register, [{
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

            this.loadImports().forEach(function (promise) {

                promise.then(function (options) {

                    var scriptElements = options.scripts,
                        modulePath = options.path,
                        moduleName = options.name;

                    if (modules.length && ! ~modules.indexOf(moduleName)) {
                        return;
                    }

                    _logger2['default'].send(moduleName, _logger2['default'].type.module);

                    scriptElements.forEach(function (scriptElement) {

                        var scriptSrc = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                            scriptPath = '' + scriptSrc;

                        if (options.type === 'link') {
                            scriptSrc = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/');
                            scriptPath = '' + modulePath + '/' + scriptSrc;
                        }

                        System['import'](scriptPath).then(function (Register) {

                            var className = Register['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1],
                                component = _this.components[className] = Register['default'];

                            _this.registerElement(className, component, modulePath);
                        });
                    });
                });
            });
        }
    }, {
        key: 'loadImports',

        /**
         * Responsible for finding all of the HTML imports and returning a promise when each of the
         * HTML imports have been successfully imported. This allows us to access the `ownerDocument`
         * on each of the link elements knowing that it isn't null.
         *
         * @method loadImports
         * @return {Array}
         */
        value: function loadImports() {
            var _this2 = this;

            var importDocuments = _utility2['default'].toArray(document.querySelectorAll(SELECTOR.IMPORTS)),
                templateElements = _utility2['default'].toArray(document.querySelectorAll(SELECTOR.TEMPLATES));

            return [].concat(importDocuments, templateElements).map(function (model) {

                var type = model.nodeName.toLowerCase();

                return new Promise(function (resolve) {

                    switch (type) {
                        case 'link':
                            _this2.resolveLink(resolve, model);break;
                        case 'template':
                            _this2.resolveTemplate(resolve, model);break;
                    }
                });
            });
        }
    }, {
        key: 'resolveTemplate',

        /**
         * @method resolveTemplate
         * @param {Function} resolve
         * @param {HTMLTemplateElement} templateElement
         * @return {void}
         */
        value: function resolveTemplate(resolve, templateElement) {

            var scriptElements = _utility2['default'].toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS)),
                modulePath = _utility2['default'].getModulePath(scriptElements[0].getAttribute('src')),
                moduleName = _utility2['default'].getModuleName(scriptElements[0].getAttribute('src'));

            resolve({ scripts: scriptElements, path: modulePath, name: moduleName, type: 'template' });
        }
    }, {
        key: 'resolveLink',

        /**
         * @method resolveLink
         * @param {Function} resolve
         * @param {HTMLLinkElement} linkElement
         * @return {void}
         */
        value: function resolveLink(resolve, linkElement) {
            var _this3 = this;

            linkElement.addEventListener('load', function () {

                var scriptElements = _this3.findScripts(linkElement['import']),
                    modulePath = _utility2['default'].getModulePath(linkElement.getAttribute('href')),
                    moduleName = _utility2['default'].getModuleName(linkElement.getAttribute('href'));

                resolve({ scripts: scriptElements, path: modulePath, name: moduleName, type: 'link' });
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

            return _utility2['default'].toArray(document.querySelectorAll(SELECTOR.IMPORTS)).map(function (importDocument) {

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

            var templateElements = _utility2['default'].toArray(importDocument.querySelectorAll(SELECTOR.TEMPLATES)),
                allScriptElements = [];

            templateElements.forEach(function (templateElement) {

                var scriptElements = _utility2['default'].toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS));
                allScriptElements = [].concat(allScriptElements, scriptElements);
            });

            return allScriptElements;
        }
    }, {
        key: 'registerElement',

        /**
         * Responsible for creating the custom element using document.registerElement, and then appending
         * the associated React.js component.
         *
         * @method registerElement
         * @param {String} className
         * @param {Object} component
         * @param {String} modulePath
         * @return {void}
         */
        value: function registerElement(className, component, modulePath) {

            var elementName = _utility2['default'].toSnakeCase(className);

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
                        var _this4 = this;

                        component.defaultProps = {
                            path: modulePath,
                            element: this.cloneNode(true)
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
                            _this4.removeAttribute('unresolved');
                            _this4.setAttribute('resolved', '');
                        });
                    }

                }

            });

            document.registerElement(elementName, {
                prototype: prototype
            });
        }
    }]);

    return Register;
})();

exports['default'] = Register;
module.exports = exports['default'];

},{"./../helpers/Events.js":3,"./../helpers/Logger.js":4,"./../helpers/Stylesheets.js":5,"./../helpers/Utility.js":6}],3:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./../helpers/Utility.js":6}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9SZWdpc3Rlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0V2ZW50cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0xvZ2dlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvVXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7d0JDQXNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7Ozs7O1FBT0ssS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakQscUZBQWdCLE9BQU8sT0FBRTtTQUM1QixDQUFDLENBQUM7S0FFTjs7QUFJTCxXQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUV6QixDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7c0JDbENFLHdCQUF3Qjs7OzttQkFDeEIsNkJBQTZCOzs7O3VCQUM3Qix5QkFBeUI7Ozs7c0JBQ3pCLHdCQUF3Qjs7Ozs7Ozs7QUFNL0MsSUFBTSxRQUFRLEdBQUc7QUFDYixXQUFPLEVBQUksb0JBQW9CO0FBQy9CLGFBQVMsRUFBRSxVQUFVO0FBQ3JCLFdBQU8sRUFBSSxnQ0FBZ0M7Q0FDOUMsQ0FBQzs7Ozs7Ozs7O0lBUW1CLFFBQVE7Ozs7Ozs7O0FBT2QsYUFQTSxRQUFRLEdBT0Q7MENBQVQsT0FBTztBQUFQLG1CQUFPOzs7OEJBUEwsUUFBUTs7QUFTckIsWUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsWUFBSSxDQUFDLEtBQUssR0FBUSxJQUFJLENBQUM7O0FBRXZCLFlBQUksQ0FBQyxRQUFRLE1BQUEsQ0FBYixJQUFJLEVBQWEsT0FBTyxDQUFDLENBQUM7S0FFN0I7O2lCQWRnQixRQUFROzs7Ozs7Ozs7Ozs7ZUF5QmpCLG9CQUFhOzs7K0NBQVQsT0FBTztBQUFQLHVCQUFPOzs7QUFFZixnQkFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSzs7QUFFcEMsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRXRCLHdCQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTzt3QkFDaEMsVUFBVSxHQUFPLE9BQU8sQ0FBQyxJQUFJO3dCQUM3QixVQUFVLEdBQU8sT0FBTyxDQUFDLElBQUksQ0FBQzs7QUFFbEMsd0JBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNqRCwrQkFBTztxQkFDVjs7QUFFRCx3Q0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLG9CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFNUMsa0NBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxhQUFhLEVBQUs7O0FBRXRDLDRCQUFJLFNBQVMsR0FBSSxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs0QkFDaEYsVUFBVSxRQUFNLFNBQVMsQUFBRSxDQUFDOztBQUVoQyw0QkFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUN6QixxQ0FBUyxHQUFJLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakYsc0NBQVUsUUFBTSxVQUFVLFNBQUksU0FBUyxBQUFFLENBQUM7eUJBQzdDOztBQUVELDhCQUFNLFVBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRLEVBQUs7O0FBRXpDLGdDQUFJLFNBQVMsR0FBRyxRQUFRLFdBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ2xGLFNBQVMsR0FBRyxNQUFLLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLFdBQVEsQ0FBQzs7QUFFOUQsa0NBQUssZUFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7eUJBRTFELENBQUMsQ0FBQztxQkFFTixDQUFDLENBQUM7aUJBRU4sQ0FBQyxDQUFDO2FBRU4sQ0FBQyxDQUFDO1NBRU47Ozs7Ozs7Ozs7OztlQVVVLHVCQUFHOzs7QUFFVixnQkFBSSxlQUFlLEdBQUkscUJBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9FLGdCQUFnQixHQUFHLHFCQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7O0FBRXRGLG1CQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFLOztBQUUvRCxvQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFeEMsdUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTVCLDRCQUFRLElBQUk7QUFDUiw2QkFBTSxNQUFNO0FBQU8sbUNBQUssV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUMzRCw2QkFBTSxVQUFVO0FBQUcsbUNBQUssZUFBZSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxBQUFDLE1BQU07QUFBQSxxQkFDbEU7aUJBRUosQ0FBQyxDQUFDO2FBRU4sQ0FBQyxDQUFDO1NBRU47Ozs7Ozs7Ozs7ZUFRYyx5QkFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFOztBQUV0QyxnQkFBSSxjQUFjLEdBQUcscUJBQVEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM1RixVQUFVLEdBQU8scUJBQVEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdFLFVBQVUsR0FBTyxxQkFBUSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVsRixtQkFBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FFOUY7Ozs7Ozs7Ozs7ZUFRVSxxQkFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFOzs7QUFFOUIsdUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBTTs7QUFFdkMsb0JBQUksY0FBYyxHQUFHLE9BQUssV0FBVyxDQUFDLFdBQVcsVUFBTyxDQUFDO29CQUNyRCxVQUFVLEdBQU8scUJBQVEsYUFBYSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3hFLFVBQVUsR0FBTyxxQkFBUSxhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUU3RSx1QkFBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFFMUYsQ0FBQyxDQUFDO1NBRU47Ozs7Ozs7Ozs7OztlQVVVLHVCQUFHOztBQUVWLG1CQUFPLHFCQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsY0FBYyxFQUFLOztBQUV4RixvQkFBSSxVQUFVLEdBQUcscUJBQVEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM1RSx1QkFBTyxLQUFLLFVBQVUsQ0FBQzthQUUxQixDQUFDLENBQUM7U0FFTjs7Ozs7Ozs7O2VBT1UscUJBQUMsY0FBYyxFQUFFOztBQUV4QixnQkFBSSxnQkFBZ0IsR0FBSSxxQkFBUSxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEYsaUJBQWlCLEdBQUcsRUFBRSxDQUFDOztBQUUzQiw0QkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxlQUFlLEVBQUs7O0FBRTFDLG9CQUFJLGNBQWMsR0FBRyxxQkFBUSxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNqRyxpQ0FBaUIsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBRXBFLENBQUMsQ0FBQzs7QUFFSCxtQkFBTyxpQkFBaUIsQ0FBQztTQUU1Qjs7Ozs7Ozs7Ozs7Ozs7ZUFZYyx5QkFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRTs7QUFFOUMsZ0JBQUksV0FBVyxHQUFHLHFCQUFRLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakQsZ0NBQU8sSUFBSSxNQUFJLFdBQVcsRUFBSSxvQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckQsZ0JBQUksU0FBUyxHQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTs7Ozs7O0FBTW5ELGdDQUFnQixFQUFFOzs7Ozs7QUFNZCx5QkFBSyxFQUFFLFNBQVMsS0FBSyxHQUFHOzs7QUFFcEIsaUNBQVMsQ0FBQyxZQUFZLEdBQUc7QUFDckIsZ0NBQUksRUFBUSxVQUFVO0FBQ3RCLG1DQUFPLEVBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7eUJBQ25DLENBQUM7O0FBRUYsNEJBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEIsNkJBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFOztBQUVsRixnQ0FBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdkMsZ0NBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNqQixvQ0FBSSxLQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELHlDQUFTLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7NkJBQ2xEO3lCQUVKOztBQUVELDRCQUFJLGVBQWUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQzs0QkFDaEQsY0FBYyxHQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDOzRCQUNuRCxVQUFVLEdBQVEsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRTlDLGtDQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLDRDQUFPLFFBQVEsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQzs7QUFFL0UsK0JBQU8sQ0FBQyxHQUFHLENBQUMsaUJBQUksU0FBUyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzFELG1DQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuQyxtQ0FBSyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3lCQUNyQyxDQUFDLENBQUM7cUJBRU47O2lCQUVKOzthQUVKLENBQUMsQ0FBQzs7QUFFSCxvQkFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUU7QUFDbEMseUJBQVMsRUFBRSxTQUFTO2FBQ3ZCLENBQUMsQ0FBQztTQUVOOzs7V0FwUGdCLFFBQVE7OztxQkFBUixRQUFROzs7Ozs7Ozs7O3FCQ3JCZCxDQUFDLFNBQVMsSUFBSSxHQUFHOztBQUU1QixnQkFBWSxDQUFDOztBQUViLFdBQU87Ozs7Ozs7O0FBUUgsZ0JBQVEsRUFBQSxrQkFBQyxjQUFjLEVBQUUsU0FBUyxFQUFFOztBQUVoQyxnQkFBSSxRQUFRLEdBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7Z0JBQ3hDLE1BQU0sR0FBTyxFQUFFO2dCQUNmLFVBQVUsR0FBRyxXQUFXLENBQUM7O0FBRTdCLGtCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSzs7QUFFbkMsb0JBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUN2QiwwQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN2QzthQUVKLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRSCxxQkFBUyxRQUFRLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRTs7QUFFckMsb0JBQUksU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7b0JBQ3RDLE9BQU8sR0FBSyxJQUFJLENBQUM7O0FBRXJCLHNCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSzs7QUFFMUMsd0JBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTdDLHdCQUFJLFlBQVksRUFBRTtBQUNkLCtCQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUN0QztpQkFFSixDQUFDLENBQUM7O0FBRUgsdUJBQU8sT0FBTyxDQUFDO2FBRWxCOzs7Ozs7Ozs7QUFTRCxxQkFBUyxVQUFVOzs7MENBQTJCO0FBRXRDLDBCQUFNLEdBQ04sV0FBVyxHQWFYLFFBQVEsR0FFSCxFQUFFLEdBSUMsSUFBSSxHQUlBLFlBQVk7O3dCQTFCWixJQUFJO3dCQUFFLE9BQU87d0JBQUUsU0FBUzs7QUFFeEMsd0JBQUksTUFBTSxHQUFRLEVBQUU7d0JBQ2hCLFdBQVcsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV6RSx3QkFBSSxXQUFXLEVBQUU7OztBQUdiLDhCQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3FCQUU1Qjs7QUFFRCx3QkFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFBRTtBQUM5QiwrQkFBTyxNQUFNLENBQUM7cUJBQ2pCOztBQUVELHdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7O0FBRXRDLHlCQUFLLElBQUksRUFBRSxJQUFJLFFBQVEsRUFBRTs7QUFFckIsNEJBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRTs7QUFFN0IsZ0NBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFeEIsZ0NBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUU7O0FBRTlCLG9DQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTdELG9DQUFJLFlBQVksRUFBRTs7O0FBR2QsMENBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUNBRTdCOztBQUVELHVDQUFPLE1BQU0sQ0FBQzs2QkFFakI7O0FBRUQsZ0NBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO3FDQUNOLElBQUk7c0NBQUUsT0FBTztzQ0FBRSxTQUFTOzs7NkJBQzdDO3lCQUVKO3FCQUVKO2lCQUVKO2FBQUE7Ozs7OztBQU1ELHFCQUFTLFdBQVcsQ0FBQyxTQUFTLEVBQUU7O0FBRTVCLDhCQUFjLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRTs7QUFFL0Qsd0JBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQUU7QUFDeEMsK0JBQU87cUJBQ1Y7O0FBRUQsd0JBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0I7d0JBQ25GLE9BQU8sVUFBVyxLQUFLLENBQUMsSUFBSSxBQUFFO3dCQUM5QixNQUFNLEdBQU8sVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFNUYsMEJBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDeEIsK0JBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQzVCLENBQUMsQ0FBQztpQkFFTixDQUFDLENBQUM7YUFFTjs7Ozs7OztBQUVELHFDQUFzQixNQUFNO3dCQUFuQixTQUFTOztBQUNkLCtCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzFCOzs7Ozs7Ozs7Ozs7Ozs7U0FFSjs7S0FFSixDQUFDO0NBRUwsQ0FBQSxFQUFHOzs7Ozs7Ozs7OztxQkMzSVcsQ0FBQyxTQUFTLElBQUksR0FBRzs7QUFFNUIsZ0JBQVksQ0FBQzs7QUFFYixXQUFPOzs7Ozs7QUFNSCxZQUFJLEVBQUU7QUFDRixrQkFBTSxFQUFFLFFBQVE7QUFDaEIscUJBQVMsRUFBRSxXQUFXO1NBQ3pCOzs7Ozs7OztBQVFELFlBQUksRUFBQSxjQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7O0FBRWhCLG9CQUFRLElBQUk7O0FBRVIscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQ2xCLDJCQUFPLENBQUMsR0FBRyxpQkFBZSxPQUFPLFFBQUssb0lBQW9JLENBQUMsQ0FBQztBQUM1SywwQkFBTTs7QUFBQSxBQUVWLHFCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztBQUNyQiwyQkFBTyxDQUFDLEdBQUcscUJBQW1CLE9BQU8sUUFBSywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3ZGLDBCQUFNOztBQUFBLEFBRVY7QUFDSSwyQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFBQSxhQUU1QjtTQUVKOztLQUVKLENBQUM7Q0FFTCxDQUFBLEVBQUc7Ozs7Ozs7Ozs7Ozs7dUJDMUNnQix5QkFBeUI7Ozs7cUJBRTlCLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFOztBQUVyQyxnQkFBWSxDQUFDOztBQUViLFdBQU87Ozs7OztBQU1ILG9CQUFZLEVBQUUsdUJBQXVCOzs7Ozs7OztBQVFyQyxpQkFBUyxFQUFBLG1CQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUU7O0FBRWpDLGdCQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLGlDQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRWpFLG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVyQyxvQkFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFOztBQUUzQix3QkFBSSxnQkFBZ0IsR0FBRyxxQkFBUSxPQUFPLENBQUMsSUFBSSxVQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7QUFFakYsb0NBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsZUFBZSxFQUFLOztBQUUxQyw0QkFBSSxlQUFlLEdBQUcsZUFBZSxDQUFDLE9BQU87NEJBQ3pDLFlBQVksR0FBTSxxQkFBUSxPQUFPLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsV0FBVyxFQUFLO0FBQzdGLHdDQUFVLGFBQWEsU0FBSSxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFHO3lCQUNqRSxDQUFDLENBQUM7O0FBRVAsb0NBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxXQUFXLEVBQUs7O0FBRWxDLGdDQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELHdDQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFOUMsb0NBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRW5DLHFDQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUTsyQ0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO2lDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbEUsZ0RBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQzlCLDhDQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JDLDJDQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lDQUNuQyxDQUFDLENBQUM7NkJBRU4sQ0FBQyxDQUFDLENBQUM7eUJBRVAsQ0FBQyxDQUFDO3FCQUVOLENBQUMsQ0FBQztpQkFFTjthQUVKLENBQUMsQ0FBQzs7QUFFSCxtQkFBTyxRQUFRLENBQUM7U0FFbkI7O0tBRUosQ0FBQztDQUVMLENBQUEsQ0FBRSxRQUFRLENBQUM7Ozs7Ozs7Ozs7O3FCQ3BFRyxDQUFDLFNBQVMsSUFBSSxHQUFHOztBQUU1QixnQkFBWSxDQUFDOztBQUViLFdBQU87Ozs7Ozs7O0FBUUgsbUJBQVcsRUFBQSxxQkFBQyxTQUFTLEVBQWdCO2dCQUFkLE1BQU0sZ0NBQUcsR0FBRzs7QUFDL0IsbUJBQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEtBQUs7dUJBQUksS0FBSzthQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakc7Ozs7Ozs7QUFPRCxlQUFPLEVBQUEsaUJBQUMsU0FBUyxFQUFFO0FBQ2YsbUJBQU8sS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0Rjs7Ozs7OztBQU9ELHFCQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFO0FBQ3RCLG1CQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2RDs7Ozs7OztBQU9ELHFCQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFO0FBQ3RCLG1CQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ25EOztLQUVKLENBQUM7Q0FFTCxDQUFBLEVBQUciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlZ2lzdGVyICBmcm9tICcuL2NvbXBvbmVudHMvUmVnaXN0ZXIuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKHR5cGVvZiBTeXN0ZW0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIFN5c3RlbS50cmFuc3BpbGVyID0gJ2JhYmVsJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbW9kdWxlIE1hcGxlXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICAgICAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gICAgICovXG4gICAgY2xhc3MgTWFwbGUge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoLi4ubW9kdWxlcykge1xuXG4gICAgICAgICAgICAkZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgUmVnaXN0ZXIoLi4ubW9kdWxlcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAkd2luZG93Lk1hcGxlID0gTWFwbGU7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsImltcG9ydCBldmVudHMgICAgIGZyb20gJy4vLi4vaGVscGVycy9FdmVudHMuanMnO1xuaW1wb3J0IGNzcyAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2dnZXIgICAgIGZyb20gJy4vLi4vaGVscGVycy9Mb2dnZXIuanMnO1xuXG4vKipcbiAqIEBjb25zdGFudCBTRUxFQ1RPUlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuY29uc3QgU0VMRUNUT1IgPSB7XG4gICAgSU1QT1JUUzogICAnbGlua1tyZWw9XCJpbXBvcnRcIl0nLFxuICAgIFRFTVBMQVRFUzogJ3RlbXBsYXRlJyxcbiAgICBTQ1JJUFRTOiAgICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXSdcbn07XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBSZWdpc3RlclxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0ZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge1JlZ2lzdGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5kZWJ1ZyAgICAgID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW50cnkgcG9pbnQgZm9yIHRoZSBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uIEl0IGFjY2VwdHMgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRvIGluaXRpYWxpc2VcbiAgICAgKiBtb2R1bGVzIGV4cGxpY2l0bHksIG90aGVyd2lzZSB0aGlzLmZpbmRNb2R1bGVzIHdpbGwgYmUgaW52b2tlZCwgYW5kIG1vZHVsZXMgd2lsbCBiZSBmb3VuZFxuICAgICAqIGF1dG9tYXRpY2FsbHkgZnJvbSB0aGUgY3VycmVudCBIVE1MIGltcG9ydHMgb2YgdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWxlZ2F0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICB0aGlzLmxvYWRJbXBvcnRzKCkuZm9yRWFjaCgocHJvbWlzZSkgPT4ge1xuXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oKG9wdGlvbnMpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IG9wdGlvbnMuc2NyaXB0cyxcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSBvcHRpb25zLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgICAgID0gb3B0aW9ucy5uYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZXMubGVuZ3RoICYmICF+bW9kdWxlcy5pbmRleE9mKG1vZHVsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsb2dnZXIuc2VuZChtb2R1bGVOYW1lLCBsb2dnZXIudHlwZS5tb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudHMuZm9yRWFjaCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRTcmMgID0gc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdFBhdGggPSBgJHtzY3JpcHRTcmN9YDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSAnbGluaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdFNyYyAgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0UGF0aCA9IGAke21vZHVsZVBhdGh9LyR7c2NyaXB0U3JjfWA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKFJlZ2lzdGVyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBSZWdpc3Rlci5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbY2xhc3NOYW1lXSA9IFJlZ2lzdGVyLmRlZmF1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgSFRNTCBpbXBvcnRzIGFuZCByZXR1cm5pbmcgYSBwcm9taXNlIHdoZW4gZWFjaCBvZiB0aGVcbiAgICAgKiBIVE1MIGltcG9ydHMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbXBvcnRlZC4gVGhpcyBhbGxvd3MgdXMgdG8gYWNjZXNzIHRoZSBgb3duZXJEb2N1bWVudGBcbiAgICAgKiBvbiBlYWNoIG9mIHRoZSBsaW5rIGVsZW1lbnRzIGtub3dpbmcgdGhhdCBpdCBpc24ndCBudWxsLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkSW1wb3J0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGxvYWRJbXBvcnRzKCkge1xuXG4gICAgICAgIGxldCBpbXBvcnREb2N1bWVudHMgID0gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuSU1QT1JUUykpLFxuICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpO1xuXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQoaW1wb3J0RG9jdW1lbnRzLCB0ZW1wbGF0ZUVsZW1lbnRzKS5tYXAoKG1vZGVsKSA9PiB7XG5cbiAgICAgICAgICAgIGxldCB0eXBlID0gbW9kZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAoJ2xpbmsnKTogICAgIHRoaXMucmVzb2x2ZUxpbmsocmVzb2x2ZSwgbW9kZWwpOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAoJ3RlbXBsYXRlJyk6IHRoaXMucmVzb2x2ZVRlbXBsYXRlKHJlc29sdmUsIG1vZGVsKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVzb2x2ZVRlbXBsYXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZVxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZXNvbHZlVGVtcGxhdGUocmVzb2x2ZSwgdGVtcGxhdGVFbGVtZW50KSB7XG5cbiAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuU0NSSVBUUykpLFxuICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgoc2NyaXB0RWxlbWVudHNbMF0uZ2V0QXR0cmlidXRlKCdzcmMnKSksXG4gICAgICAgICAgICBtb2R1bGVOYW1lICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlTmFtZShzY3JpcHRFbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoJ3NyYycpKTtcblxuICAgICAgICByZXNvbHZlKHsgc2NyaXB0czogc2NyaXB0RWxlbWVudHMsIHBhdGg6IG1vZHVsZVBhdGgsIG5hbWU6IG1vZHVsZU5hbWUsIHR5cGU6ICd0ZW1wbGF0ZScgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlc29sdmVMaW5rXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZVxuICAgICAqIEBwYXJhbSB7SFRNTExpbmtFbGVtZW50fSBsaW5rRWxlbWVudFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVzb2x2ZUxpbmsocmVzb2x2ZSwgbGlua0VsZW1lbnQpIHtcblxuICAgICAgICBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB0aGlzLmZpbmRTY3JpcHRzKGxpbmtFbGVtZW50LmltcG9ydCksXG4gICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpLFxuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgICAgID0gdXRpbGl0eS5nZXRNb2R1bGVOYW1lKGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICAgICAgcmVzb2x2ZSh7IHNjcmlwdHM6IHNjcmlwdEVsZW1lbnRzLCBwYXRoOiBtb2R1bGVQYXRoLCBuYW1lOiBtb2R1bGVOYW1lLCB0eXBlOiAnbGluaycgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zaWJsZSBmb3IgZmluZGluZyBhbGwgb2YgdGhlIEhUTUwgaW1wb3J0cyBpbiB0aGUgY3VycmVudCBkb2N1bWVudC4gSXQgd2lsbCBiZSBpbnZva2VkIGlmXG4gICAgICogdGhlIGRldmVsb3BlciBkb2Vzbid0IGV4cGxpY2l0bHkgcGFzcyBpbiBhbiBhcnJheSBvZiBtb2R1bGVzIHRvIGxvYWQgdmlhIHRoZSBNYXBsZSBjb25zdHJ1Y3RvciB3aGVuXG4gICAgICogaW5zdGFudGlhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZmluZE1vZHVsZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kTW9kdWxlcygpIHtcblxuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuSU1QT1JUUykpLm1hcCgoaW1wb3J0RG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IGltcG9ydFBhdGggPSB1dGlsaXR5LmdldEltcG9ydFBhdGgoaW1wb3J0RG9jdW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgaW1wb3J0UGF0aDtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZmluZFNjcmlwdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1wb3J0RG9jdW1lbnRcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kU2NyaXB0cyhpbXBvcnREb2N1bWVudCkge1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzICA9IHV0aWxpdHkudG9BcnJheShpbXBvcnREb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpLFxuICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXTtcblxuICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TQ1JJUFRTKSk7XG4gICAgICAgICAgICBhbGxTY3JpcHRFbGVtZW50cyA9IFtdLmNvbmNhdChhbGxTY3JpcHRFbGVtZW50cywgc2NyaXB0RWxlbWVudHMpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhbGxTY3JpcHRFbGVtZW50cztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50LCBhbmQgdGhlbiBhcHBlbmRpbmdcbiAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyRWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZVBhdGhcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyRWxlbWVudChjbGFzc05hbWUsIGNvbXBvbmVudCwgbW9kdWxlUGF0aCkge1xuXG4gICAgICAgIGxldCBlbGVtZW50TmFtZSA9IHV0aWxpdHkudG9TbmFrZUNhc2UoY2xhc3NOYW1lKTtcblxuICAgICAgICBsb2dnZXIuc2VuZChgJHtlbGVtZW50TmFtZX1gLCBsb2dnZXIudHlwZS5jb21wb25lbnQpO1xuICAgICAgICBsZXQgcHJvdG90eXBlICAgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAgICB0aGlzLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudCBhbmQgdHJhbnNmZXIgdG8gdGhlIFJlYWN0LmpzIGNsYXNzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAsIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXM7IGluZGV4IDwgYXR0cmlidXRlcy5sZW5ndGg7IGluZGV4KyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoL15kYXRhLS9pLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkRWxlbWVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoY3NzLmFzc29jaWF0ZShtb2R1bGVQYXRoLCBzaGFkb3dSb290KSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChlbGVtZW50TmFtZSwge1xuICAgICAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGVcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBkZWxlZ2F0ZVxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3MuY3JlYXRlQ2xhc3MuQ29uc3RydWN0b3J9IGNvbXBvbmVudFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIGNvbXBvbmVudCkge1xuXG4gICAgICAgICAgICBsZXQgYUVsZW1lbnQgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcbiAgICAgICAgICAgICAgICBldmVudHMgICAgID0gW10sXG4gICAgICAgICAgICAgICAgZXZlbnRFc3F1ZSA9IC9vblthLXpdKy9pO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhRWxlbWVudCkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoa2V5Lm1hdGNoKGV2ZW50RXNxdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGtleS5yZXBsYWNlKC9eb24vLCAnJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBnZXRFdmVudFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEV2ZW50KGV2ZW50TmFtZSwgcHJvcGVydGllcykge1xuXG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoTmFtZSA9IG5ldyBSZWdFeHAoZXZlbnROYW1lLCAnaScpLFxuICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHkubWF0Y2gobWF0Y2hOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuID0gcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBldmVudEZuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBmaW5kRXZlbnRzXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJlYWN0SWRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kRXZlbnRzKG5vZGUsIHJlYWN0SWQsIGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50cyAgICAgID0gW10sXG4gICAgICAgICAgICAgICAgICAgIHJvb3RFdmVudEZuID0gZ2V0RXZlbnQoZXZlbnROYW1lLCBub2RlLl9jdXJyZW50RWxlbWVudC5fc3RvcmUucHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvb3RFdmVudEZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgZXZlbnQgaW4gcm9vdCFcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2gocm9vdEV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuX3Jvb3ROb2RlSUQgPT09IHJlYWN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBub2RlLl9yZW5kZXJlZENoaWxkcmVuO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gY2hpbGRyZW4pIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaWQpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gY2hpbGRyZW5baWRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkRXZlbnRGbiA9IGdldEV2ZW50KGV2ZW50TmFtZSwgaXRlbS5faW5zdGFuY2UucHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkRXZlbnRGbikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGV2ZW50IGluIGNoaWxkcmVuIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChjaGlsZEV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5fcmVuZGVyZWRDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5kRXZlbnRzKGl0ZW0sIHJlYWN0SWQsIGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBjcmVhdGVFdmVudFxuICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlRXZlbnQoZXZlbnROYW1lKSB7XG5cbiAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gb25DbGljayhldmVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudHMgPSBjb21wb25lbnQuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiAgICA9IGBvbiR7ZXZlbnQudHlwZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IGZpbmRFdmVudHMoY29tcG9uZW50cywgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1yZWFjdGlkJyksIGV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudEZuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuLmFwcGx5KGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnROYW1lIG9mIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0YW50IHR5cGVcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgIG1vZHVsZTogJ21vZHVsZScsXG4gICAgICAgICAgICBjb21wb25lbnQ6ICdjb21wb25lbnQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2Qgc2VuZFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgc2VuZChtZXNzYWdlLCB0eXBlKSB7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAodGhpcy50eXBlLm1vZHVsZSk6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBNb2R1bGU6ICR7bWVzc2FnZX0gYCwgJ2NvbG9yOiB3aGl0ZTsgYm9yZGVyLXJhZGl1czogM3B4OyBwYWRkaW5nOiAycHggMDsgZm9udC1zaXplOiA5cHg7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICAjZWYzMjMyIDAlLCNkNjNhMmMgMTAwJSknKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICh0aGlzLnR5cGUuY29tcG9uZW50KTpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIENvbXBvbmVudDogPCR7bWVzc2FnZX0+YCwgJ2ZvbnQtc2l6ZTogOXB4OyBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNzUpJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBsaW5rU2VsZWN0b3JcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGxpbmtTZWxlY3RvcjogJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBhc3NvY2lhdGVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNvbXBvbmVudFBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTaGFkb3dSb290fSBzaGFkb3dSb290XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgYXNzb2NpYXRlKGNvbXBvbmVudFBhdGgsIHNoYWRvd1Jvb3QpIHtcblxuICAgICAgICAgICAgbGV0IHByb21pc2VzID0gW107XG5cbiAgICAgICAgICAgIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLmZvckVhY2goKGxpbmspID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBocmVmID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgIGlmIChocmVmLm1hdGNoKGNvbXBvbmVudFBhdGgpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkobGluay5pbXBvcnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50cy5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlQ29udGVudCA9IHRlbXBsYXRlRWxlbWVudC5jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cyAgICA9IHV0aWxpdHkudG9BcnJheSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtjb21wb25lbnRQYXRofS8ke2xpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cy5mb3JFYWNoKChjc3NEb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlRWxlbWVudCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZXRjaChjc3NEb2N1bWVudCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKSkudGhlbigoYm9keSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGJvZHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHN0eWxlRWxlbWVudC5pbm5lckhUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvU25ha2VDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYW1lbENhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtqb2luZXI9Jy0nXVxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0b1NuYWtlQ2FzZShjYW1lbENhc2UsIGpvaW5lciA9ICctJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbWVsQ2FzZS5zcGxpdCgvKFtBLVpdW2Etel17MCx9KS9nKS5maWx0ZXIocGFydHMgPT4gcGFydHMpLmpvaW4oam9pbmVyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20gPyBBcnJheS5mcm9tKGFycmF5TGlrZSkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRNb2R1bGVQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE1vZHVsZVBhdGgoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldE1vZHVsZU5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TW9kdWxlTmFtZShpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiXX0=
