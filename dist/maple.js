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

                promise.then(function (linkElement) {

                    var scriptElements = _this.findScripts(linkElement['import']),
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

            var importDocuments = document.querySelectorAll(SELECTOR.IMPORTS);

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
                        var _this2 = this;

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
                            _this2.removeAttribute('unresolved');
                            _this2.setAttribute('resolved', '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9SZWdpc3Rlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0V2ZW50cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0xvZ2dlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvVXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7d0JDQXNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7Ozs7O1FBT0ssS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakQscUZBQWdCLE9BQU8sT0FBRTtTQUM1QixDQUFDLENBQUM7S0FFTjs7QUFJTCxXQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUV6QixDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7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Q0FBQzs7QUFFYixXQUFPOzs7Ozs7OztBQVFILG1CQUFXLEVBQUEscUJBQUMsU0FBUyxFQUFnQjtnQkFBZCxNQUFNLGdDQUFHLEdBQUc7O0FBQy9CLG1CQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLO3VCQUFJLEtBQUs7YUFBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pHOzs7Ozs7O0FBT0QsZUFBTyxFQUFBLGlCQUFDLFNBQVMsRUFBRTtBQUNmLG1CQUFPLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEY7Ozs7Ozs7QUFPRCxxQkFBYSxFQUFBLHVCQUFDLFVBQVUsRUFBRTtBQUN0QixtQkFBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkQ7Ozs7Ozs7QUFPRCxxQkFBYSxFQUFBLHVCQUFDLFVBQVUsRUFBRTtBQUN0QixtQkFBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNuRDs7S0FFSixDQUFDO0NBRUwsQ0FBQSxFQUFHIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZWdpc3RlciAgZnJvbSAnLi9jb21wb25lbnRzL1JlZ2lzdGVyLmpzJztcblxuKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmICh0eXBlb2YgU3lzdGVtICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBTeXN0ZW0udHJhbnNwaWxlciA9ICdiYWJlbCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICAgICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IFJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgJHdpbmRvdy5NYXBsZSA9IE1hcGxlO1xuXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCJpbXBvcnQgZXZlbnRzICAgICBmcm9tICcuLy4uL2hlbHBlcnMvRXZlbnRzLmpzJztcbmltcG9ydCBjc3MgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9TdHlsZXNoZWV0cy5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgICBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgbG9nZ2VyICAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nZ2VyLmpzJztcblxuLyoqXG4gKiBAY29uc3RhbnQgU0VMRUNUT1JcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IFNFTEVDVE9SID0ge1xuICAgIElNUE9SVFM6ICAgJ2xpbmtbcmVsPVwiaW1wb3J0XCJdJyxcbiAgICBURU1QTEFURVM6ICd0ZW1wbGF0ZScsXG4gICAgU0NSSVBUUzogICAnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nXG59O1xuXG4vKipcbiAqIEBtb2R1bGUgTWFwbGVcbiAqIEBzdWJtb2R1bGUgUmVnaXN0ZXJcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdGVyIHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgKiBAcmV0dXJuIHtSZWdpc3Rlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG4gICAgICAgIHRoaXMuZGVidWcgICAgICA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlciguLi5tb2R1bGVzKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVudHJ5IHBvaW50IGZvciB0aGUgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLiBJdCBhY2NlcHRzIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0byBpbml0aWFsaXNlXG4gICAgICogbW9kdWxlcyBleHBsaWNpdGx5LCBvdGhlcndpc2UgdGhpcy5maW5kTW9kdWxlcyB3aWxsIGJlIGludm9rZWQsIGFuZCBtb2R1bGVzIHdpbGwgYmUgZm91bmRcbiAgICAgKiBhdXRvbWF0aWNhbGx5IGZyb20gdGhlIGN1cnJlbnQgSFRNTCBpbXBvcnRzIG9mIHRoZSBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZWdpc3RlciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgdGhpcy5sb2FkSW1wb3J0cygpLmZvckVhY2goKHByb21pc2UpID0+IHtcblxuICAgICAgICAgICAgcHJvbWlzZS50aGVuKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdGhpcy5maW5kU2NyaXB0cyhsaW5rRWxlbWVudC5pbXBvcnQpLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVQYXRoICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlUGF0aChsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSksXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgICAgID0gdXRpbGl0eS5nZXRNb2R1bGVOYW1lKGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblxuICAgICAgICAgICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCAmJiAhfm1vZHVsZXMuaW5kZXhPZihtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9nZ2VyLnNlbmQobW9kdWxlTmFtZSwgbG9nZ2VyLnR5cGUubW9kdWxlKTtcblxuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnRzLmZvckVhY2goKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NyaXB0U3JjICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRQYXRoID0gYCR7bW9kdWxlUGF0aH0vJHtzY3JpcHRTcmN9YDtcblxuICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKFJlZ2lzdGVyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBSZWdpc3Rlci5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbY2xhc3NOYW1lXSA9IFJlZ2lzdGVyLmRlZmF1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgSFRNTCBpbXBvcnRzIGFuZCByZXR1cm5pbmcgYSBwcm9taXNlIHdoZW4gZWFjaCBvZiB0aGVcbiAgICAgKiBIVE1MIGltcG9ydHMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbXBvcnRlZC4gVGhpcyBhbGxvd3MgdXMgdG8gYWNjZXNzIHRoZSBgb3duZXJEb2N1bWVudGBcbiAgICAgKiBvbiBlYWNoIG9mIHRoZSBsaW5rIGVsZW1lbnRzIGtub3dpbmcgdGhhdCBpdCBpc24ndCBudWxsLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkSW1wb3J0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGxvYWRJbXBvcnRzKCkge1xuXG4gICAgICAgIGxldCBpbXBvcnREb2N1bWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLklNUE9SVFMpO1xuXG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoaW1wb3J0RG9jdW1lbnRzKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGltcG9ydERvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBldmVudCA9PiByZXNvbHZlKGV2ZW50LnBhdGhbMF0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBIVE1MIGltcG9ydHMgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQuIEl0IHdpbGwgYmUgaW52b2tlZCBpZlxuICAgICAqIHRoZSBkZXZlbG9wZXIgZG9lc24ndCBleHBsaWNpdGx5IHBhc3MgaW4gYW4gYXJyYXkgb2YgbW9kdWxlcyB0byBsb2FkIHZpYSB0aGUgTWFwbGUgY29uc3RydWN0b3Igd2hlblxuICAgICAqIGluc3RhbnRpYXRpbmcgYSBuZXcgYXBwbGljYXRpb24uXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZpbmRNb2R1bGVzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZmluZE1vZHVsZXMoKSB7XG5cbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLklNUE9SVFMpKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbXBvcnRQYXRoID0gdXRpbGl0eS5nZXRJbXBvcnRQYXRoKGltcG9ydERvY3VtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIGltcG9ydFBhdGg7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGZpbmRTY3JpcHRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltcG9ydERvY3VtZW50XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZmluZFNjcmlwdHMoaW1wb3J0RG9jdW1lbnQpIHtcblxuICAgICAgICBsZXQgdGVtcGxhdGVFbGVtZW50cyAgPSB1dGlsaXR5LnRvQXJyYXkoaW1wb3J0RG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5URU1QTEFURVMpKSxcbiAgICAgICAgICAgIGFsbFNjcmlwdEVsZW1lbnRzID0gW107XG5cbiAgICAgICAgdGVtcGxhdGVFbGVtZW50cy5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuU0NSSVBUUykpO1xuICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXS5jb25jYXQoYWxsU2NyaXB0RWxlbWVudHMsIHNjcmlwdEVsZW1lbnRzKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWxsU2NyaXB0RWxlbWVudHM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCwgYW5kIHRoZW4gYXBwZW5kaW5nXG4gICAgICogdGhlIGFzc29jaWF0ZWQgUmVhY3QuanMgY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCByZWdpc3RlckVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2R1bGVQYXRoXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZWdpc3RlckVsZW1lbnQoY2xhc3NOYW1lLCBjb21wb25lbnQsIG1vZHVsZVBhdGgpIHtcblxuICAgICAgICBsZXQgZWxlbWVudE5hbWUgPSB1dGlsaXR5LnRvU25ha2VDYXNlKGNsYXNzTmFtZSk7XG5cbiAgICAgICAgbG9nZ2VyLnNlbmQoYCR7ZWxlbWVudE5hbWV9YCwgbG9nZ2VyLnR5cGUuY29tcG9uZW50KTtcbiAgICAgICAgbGV0IHByb3RvdHlwZSAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAgICAgICBtb2R1bGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogICAgdGhpcy5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCBhdHRyaWJ1dGVzIGZyb20gdGhlIGVsZW1lbnQgYW5kIHRyYW5zZmVyIHRvIHRoZSBSZWFjdC5qcyBjbGFzcy5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzLml0ZW0oaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKC9eZGF0YS0vaSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHNbbmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCByZW5kZXJlZEVsZW1lbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290ICAgICAgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNvbnRlbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBSZWFjdC5yZW5kZXIocmVuZGVyZWRFbGVtZW50LCBjb250ZW50RWxlbWVudCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGNzcy5hc3NvY2lhdGUobW9kdWxlUGF0aCwgc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3VucmVzb2x2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdyZXNvbHZlZCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZWxlbWVudE5hbWUsIHtcbiAgICAgICAgICAgIHByb3RvdHlwZTogcHJvdG90eXBlXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtSZWFjdENsYXNzLmNyZWF0ZUNsYXNzLkNvbnN0cnVjdG9yfSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGFFbGVtZW50ICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXG4gICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IFtdLFxuICAgICAgICAgICAgICAgIGV2ZW50RXNxdWUgPSAvb25bYS16XSsvaTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYUVsZW1lbnQpLmZvckVhY2goKGtleSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGtleS5tYXRjaChldmVudEVzcXVlKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChrZXkucmVwbGFjZSgvXm9uLywgJycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0RXZlbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRFdmVudChldmVudE5hbWUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaE5hbWUgPSBuZXcgUmVnRXhwKGV2ZW50TmFtZSwgJ2knKSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiAgID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Lm1hdGNoKG1hdGNoTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRGbjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZmluZEV2ZW50c1xuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZWFjdElkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEV2ZW50cyhub2RlLCByZWFjdElkLCBldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBldmVudHMgICAgICA9IFtdLFxuICAgICAgICAgICAgICAgICAgICByb290RXZlbnRGbiA9IGdldEV2ZW50KGV2ZW50TmFtZSwgbm9kZS5fY3VycmVudEVsZW1lbnQuX3N0b3JlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb290RXZlbnRGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGV2ZW50IGluIHJvb3QhXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKHJvb3RFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChub2RlLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5fcmVuZGVyZWRDaGlsZHJlbjtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkIGluIGNoaWxkcmVuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGlkKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGNoaWxkcmVuW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3Jvb3ROb2RlSUQgPT09IHJlYWN0SWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIGl0ZW0uX2luc3RhbmNlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiBjaGlsZHJlbiFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goY2hpbGRFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3JlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmluZEV2ZW50cyhpdGVtLCByZWFjdElkLCBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgY3JlYXRlRXZlbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRzID0gY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICAgPSBgb24ke2V2ZW50LnR5cGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBmaW5kRXZlbnRzKGNvbXBvbmVudHMsIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVhY3RpZCcpLCBldmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRGbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbi5hcHBseShjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50TmFtZSBvZiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdGFudCB0eXBlXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBtb2R1bGU6ICdtb2R1bGUnLFxuICAgICAgICAgICAgY29tcG9uZW50OiAnY29tcG9uZW50J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHNlbmRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHNlbmQobWVzc2FnZSwgdHlwZSkge1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcblxuICAgICAgICAgICAgICAgIGNhc2UgKHRoaXMudHlwZS5tb2R1bGUpOlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgTW9kdWxlOiAke21lc3NhZ2V9IGAsICdjb2xvcjogd2hpdGU7IGJvcmRlci1yYWRpdXM6IDNweDsgcGFkZGluZzogMnB4IDA7IGZvbnQtc2l6ZTogOXB4OyBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAgI2VmMzIzMiAwJSwjZDYzYTJjIDEwMCUpJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAodGhpcy50eXBlLmNvbXBvbmVudCk6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBDb21wb25lbnQ6IDwke21lc3NhZ2V9PmAsICdmb250LXNpemU6IDlweDsgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjc1KScpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkgbGlua1NlbGVjdG9yXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBsaW5rU2VsZWN0b3I6ICdsaW5rW3R5cGU9XCJ0ZXh0L2Nzc1wiXScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgYXNzb2NpYXRlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb21wb25lbnRQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Um9vdFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZShjb21wb25lbnRQYXRoLCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IFtdO1xuXG4gICAgICAgICAgICB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5mb3JFYWNoKChsaW5rKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaHJlZiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaHJlZi5tYXRjaChjb21wb25lbnRQYXRoKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KGxpbmsuaW1wb3J0LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJykpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudHMuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMgICAgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmsnKSkubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7Y29tcG9uZW50UGF0aH0vJHtsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMuZm9yRWFjaCgoY3NzRG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZUVsZW1lbnQgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2goY3NzRG9jdW1lbnQpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBib2R5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzdHlsZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tID8gQXJyYXkuZnJvbShhcnJheUxpa2UpIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0TW9kdWxlUGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRNb2R1bGVQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRNb2R1bGVOYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE1vZHVsZU5hbWUoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkucG9wKCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7Il19
