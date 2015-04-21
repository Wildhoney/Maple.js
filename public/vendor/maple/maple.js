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
    LINKS: 'link[rel="import"]',
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

        this.register.apply(this, modules);
    }

    _createClass(Register, [{
        key: 'register',

        /**
         * @method register
         * @param {Array} modules
         * @return {void}
         */
        value: function register() {
            var _this = this;

            for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                modules[_key2] = arguments[_key2];
            }

            [].concat(this.loadLinks(), this.loadTemplates()).forEach(function (promise) {

                promise.then(function (details) {

                    if (modules.length && ! ~modules.indexOf(details.moduleName)) {
                        return;
                    }

                    (details.scripts || []).forEach(function (script) {

                        System['import'](script).then(function (moduleImport) {

                            var componentName = moduleImport['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1];
                            _this.registerElement(componentName, moduleImport['default'], details.modulePath);
                        });
                    });
                });
            });
        }
    }, {
        key: 'loadLinks',

        /**
         * @method loadLinks
         * @return {Promise[]}
         */
        value: function loadLinks() {
            var _this2 = this;

            return _utility2['default'].toArray(document.querySelectorAll(SELECTOR.LINKS)).map(function (linkElement) {

                return new Promise(function (resolve) {

                    linkElement.addEventListener('load', function () {

                        var modulePath = _utility2['default'].getModulePath(linkElement.getAttribute('href'));

                        resolve({
                            modulePath: modulePath,
                            moduleName: _utility2['default'].getModuleName(linkElement.getAttribute('href')),
                            scripts: _this2.findScripts(linkElement['import']).map(function (scriptElement) {
                                return '' + modulePath + '/' + scriptElement.getAttribute('src').split('.').slice(0, -1).join('/');
                            })
                        });
                    });
                });
            });
        }
    }, {
        key: 'loadTemplates',

        /**
         * @method loadTemplates
         * @return {Promise[]}
         */
        value: function loadTemplates() {

            return _utility2['default'].toArray(document.querySelectorAll(SELECTOR.TEMPLATES)).map(function (templateElement) {

                return new Promise(function (resolve) {

                    var scriptElements = _utility2['default'].toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS));

                    resolve({
                        modulePath: _utility2['default'].getModulePath(scriptElements[0].getAttribute('src')),
                        moduleName: _utility2['default'].getModuleName(scriptElements[0].getAttribute('src')),
                        scripts: scriptElements.map(function (scriptElement) {
                            return '' + scriptElement.getAttribute('src').split('.').slice(0, -1).join('/');
                        })
                    });
                });
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

            var elementName = _utility2['default'].toSnakeCase(className),
                prototype = Object.create(HTMLElement.prototype, {

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
                        var _this3 = this;

                        component.defaultProps = { path: modulePath, element: this.cloneNode(true) };

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
                            _this3.removeAttribute('unresolved');
                            _this3.setAttribute('resolved', '');
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

//export default class Register {
//
//    /**
//     * @constructor
//     * @param {Array} modules
//     * @return {Register}
//     */
//    constructor(...modules) {
//
//        this.components = [];
//        this.debug      = true;
//
//        this.register(...modules);
//
//    }
//
//    /**
//     * Entry point for the component initialisation. It accepts an optional parameter to initialise
//     * modules explicitly, otherwise this.findModules will be invoked, and modules will be found
//     * automatically from the current HTML imports of the document.
//     *
//     * @method delegate
//     * @param {Array} modules
//     * @return {void}
//     */
//    register(...modules) {
//
//        this.loadImports().forEach((promise) => {
//
//            promise.then((options) => {
//
//                let scriptElements = options.scripts,
//                    modulePath     = options.path,
//                    moduleName     = options.name;
//
//                if (modules.length && !~modules.indexOf(moduleName)) {
//                    return;
//                }
//
//                logger.send(moduleName, logger.type.module);
//
//                scriptElements.forEach((scriptElement) => {
//
//                    var scriptSrc  = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
//                        scriptPath = `${scriptSrc}`;
//
//                    if (options.type === 'link') {
//                        scriptSrc  = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/');
//                        scriptPath = `${modulePath}/${scriptSrc}`;
//                    }
//
//                    System.import(scriptPath).then((Register) => {
//
//                        let className = Register.default.toString().match(/(?:function|class)\s*([a-z]+)/i)[1],
//                            component = this.components[className] = Register.default;
//
//                        this.registerElement(className, component, modulePath);
//
//                    });
//
//                });
//
//            });
//
//        });
//
//    }
//
//    /**
//     * Responsible for finding all of the HTML imports and returning a promise when each of the
//     * HTML imports have been successfully imported. This allows us to access the `ownerDocument`
//     * on each of the link elements knowing that it isn't null.
//     *
//     * @method loadImports
//     * @return {Array}
//     */
//    loadImports() {
//
//        let importDocuments  = utility.toArray(document.querySelectorAll(SELECTOR.IMPORTS)),
//            templateElements = utility.toArray(document.querySelectorAll(SELECTOR.TEMPLATES));
//
//        return [].concat(importDocuments, templateElements).map((model) => {
//
//            let type = model.nodeName.toLowerCase();
//
//            return new Promise((resolve) => {
//
//                switch (type) {
//                    case ('link'):     this.resolveLink(resolve, model); break;
//                    case ('template'): this.resolveTemplate(resolve, model); break;
//                }
//
//            });
//
//        });
//
//    }
//
//    /**
//     * @method resolveTemplate
//     * @param {Function} resolve
//     * @param {HTMLTemplateElement} templateElement
//     * @return {void}
//     */
//    resolveTemplate(resolve, templateElement) {
//
//        let scriptElements = utility.toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS)),
//            modulePath     = utility.getModulePath(scriptElements[0].getAttribute('src')),
//            moduleName     = utility.getModuleName(scriptElements[0].getAttribute('src'));
//
//        resolve({ scripts: scriptElements, path: modulePath, name: moduleName, type: 'template' });
//
//    }
//
//    /**
//     * @method resolveLink
//     * @param {Function} resolve
//     * @param {HTMLLinkElement} linkElement
//     * @return {void}
//     */
//    resolveLink(resolve, linkElement) {
//
//        linkElement.addEventListener('load', () => {
//
//            let scriptElements = this.findScripts(linkElement.import),
//                modulePath     = utility.getModulePath(linkElement.getAttribute('href')),
//                moduleName     = utility.getModuleName(linkElement.getAttribute('href'));
//
//            resolve({ scripts: scriptElements, path: modulePath, name: moduleName, type: 'link' });
//
//        });
//
//    }
//
//    /**
//     * Responsible for finding all of the HTML imports in the current document. It will be invoked if
//     * the developer doesn't explicitly pass in an array of modules to load via the Maple constructor when
//     * instantiating a new application.
//     *
//     * @method findModules
//     * @return {Array}
//     */
//    findModules() {
//
//        return utility.toArray(document.querySelectorAll(SELECTOR.IMPORTS)).map((importDocument) => {
//
//            let importPath = utility.getImportPath(importDocument.getAttribute('href'));
//            return void importPath;
//
//        });
//
//    }
//
//    /**
//     * @method findScripts
//     * @param {Object} importDocument
//     * @return {Array}
//     */
//    findScripts(importDocument) {
//
//        let templateElements  = utility.toArray(importDocument.querySelectorAll(SELECTOR.TEMPLATES)),
//            allScriptElements = [];
//
//        templateElements.forEach((templateElement) => {
//
//            let scriptElements = utility.toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS));
//            allScriptElements = [].concat(allScriptElements, scriptElements);
//
//        });
//
//        return allScriptElements;
//
//    }
//
//    /**
//     * Responsible for creating the custom element using document.registerElement, and then appending
//     * the associated React.js component.
//     *
//     * @method registerElement
//     * @param {String} className
//     * @param {Object} component
//     * @param {String} modulePath
//     * @return {void}
//     */
//    registerElement(className, component, modulePath) {
//
//        let elementName = utility.toSnakeCase(className);
//
//        logger.send(`${elementName}`, logger.type.component);
//        let prototype   = Object.create(HTMLElement.prototype, {
//
//            /**
//             * @property attachedCallback
//             * @type {Object}
//             */
//            attachedCallback: {
//
//                /**
//                 * @method value
//                 * @return {void}
//                 */
//                value: function value() {
//
//                    component.defaultProps = {
//                        path:       modulePath,
//                        element:    this.cloneNode(true)
//                    };
//
//                    this.innerHTML = '';
//
//                    // Import attributes from the element and transfer to the React.js class.
//                    for (let index = 0, attributes = this.attributes; index < attributes.length; index++) {
//
//                        let attribute = attributes.item(index);
//
//                        if (attribute.value) {
//                            let name = attribute.name.replace(/^data-/i, '');
//                            component.defaultProps[name] = attribute.value;
//                        }
//
//                    }
//
//                    let renderedElement = React.createElement(component),
//                        contentElement  = document.createElement('content'),
//                        shadowRoot      = this.createShadowRoot();
//
//                    shadowRoot.appendChild(contentElement);
//                    events.delegate(contentElement, React.render(renderedElement, contentElement));
//
//                    Promise.all(css.associate(modulePath, shadowRoot)).then(() => {
//                        this.removeAttribute('unresolved');
//                        this.setAttribute('resolved', '');
//                    });
//
//                }
//
//            }
//
//        });
//
//        document.registerElement(elementName, {
//            prototype: prototype
//        });
//
//    }
//
//}

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

                //case (this.type.module):
                //    console.log(`%c Module: ${message} `, 'color: white; border-radius: 3px; padding: 2px 0; font-size: 9px; background: linear-gradient(to bottom,  #ef3232 0%,#d63a2c 100%)');
                //    break;

                case this.type.component:
                    console.log('%cComponent:%c ' + message, 'color: #d63a2c', 'color: black');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9SZWdpc3Rlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0V2ZW50cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0xvZ2dlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvVXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7d0JDQXNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7Ozs7O1FBT0ssS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakQscUZBQWdCLE9BQU8sT0FBRTtTQUM1QixDQUFDLENBQUM7S0FFTjs7QUFJTCxXQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUV6QixDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7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QUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2RDs7Ozs7OztBQU9ELHFCQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFO0FBQ3RCLG1CQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ25EOztLQUVKLENBQUM7Q0FFTCxDQUFBLEVBQUciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlZ2lzdGVyICBmcm9tICcuL2NvbXBvbmVudHMvUmVnaXN0ZXIuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKHR5cGVvZiBTeXN0ZW0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIFN5c3RlbS50cmFuc3BpbGVyID0gJ2JhYmVsJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbW9kdWxlIE1hcGxlXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICAgICAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gICAgICovXG4gICAgY2xhc3MgTWFwbGUge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoLi4ubW9kdWxlcykge1xuXG4gICAgICAgICAgICAkZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgUmVnaXN0ZXIoLi4ubW9kdWxlcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAkd2luZG93Lk1hcGxlID0gTWFwbGU7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsImltcG9ydCBldmVudHMgICAgIGZyb20gJy4vLi4vaGVscGVycy9FdmVudHMuanMnO1xuaW1wb3J0IGNzcyAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2dnZXIgICAgIGZyb20gJy4vLi4vaGVscGVycy9Mb2dnZXIuanMnO1xuXG4vKipcbiAqIEBjb25zdGFudCBTRUxFQ1RPUlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuY29uc3QgU0VMRUNUT1IgPSB7XG4gICAgTElOS1M6ICAgICAnbGlua1tyZWw9XCJpbXBvcnRcIl0nLFxuICAgIFRFTVBMQVRFUzogJ3RlbXBsYXRlJyxcbiAgICBTQ1JJUFRTOiAgICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXSdcbn07XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBSZWdpc3RlclxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0ZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge1JlZ2lzdGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlciguLi5tb2R1bGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVnaXN0ZXIoLi4ubW9kdWxlcykge1xuXG4gICAgICAgIFtdLmNvbmNhdCh0aGlzLmxvYWRMaW5rcygpLCB0aGlzLmxvYWRUZW1wbGF0ZXMoKSkuZm9yRWFjaCgocHJvbWlzZSkgPT4ge1xuXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oKGRldGFpbHMpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCAmJiAhfm1vZHVsZXMuaW5kZXhPZihkZXRhaWxzLm1vZHVsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAoZGV0YWlscy5zY3JpcHRzIHx8IFtdKS5mb3JFYWNoKChzY3JpcHQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdCkudGhlbigobW9kdWxlSW1wb3J0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnROYW1lID0gbW9kdWxlSW1wb3J0LmRlZmF1bHQudG9TdHJpbmcoKS5tYXRjaCgvKD86ZnVuY3Rpb258Y2xhc3MpXFxzKihbYS16XSspL2kpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoY29tcG9uZW50TmFtZSwgbW9kdWxlSW1wb3J0LmRlZmF1bHQsIGRldGFpbHMubW9kdWxlUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRMaW5rc1xuICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgKi9cbiAgICBsb2FkTGlua3MoKSB7XG5cbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLkxJTktTKSkubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZVBhdGggPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aDogbW9kdWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6IHV0aWxpdHkuZ2V0TW9kdWxlTmFtZShsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRzOiAgICB0aGlzLmZpbmRTY3JpcHRzKGxpbmtFbGVtZW50LmltcG9ydCkubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vZHVsZVBhdGh9LyR7c2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRUZW1wbGF0ZXNcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFRlbXBsYXRlcygpIHtcblxuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuVEVNUExBVEVTKSkubWFwKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TQ1JJUFRTKSk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aDogdXRpbGl0eS5nZXRNb2R1bGVQYXRoKHNjcmlwdEVsZW1lbnRzWzBdLmdldEF0dHJpYnV0ZSgnc3JjJykpLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiB1dGlsaXR5LmdldE1vZHVsZU5hbWUoc2NyaXB0RWxlbWVudHNbMF0uZ2V0QXR0cmlidXRlKCdzcmMnKSksXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdHM6ICAgIHNjcmlwdEVsZW1lbnRzLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3NjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyl9YFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZmluZFNjcmlwdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1wb3J0RG9jdW1lbnRcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kU2NyaXB0cyhpbXBvcnREb2N1bWVudCkge1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzICA9IHV0aWxpdHkudG9BcnJheShpbXBvcnREb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpLFxuICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXTtcblxuICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TQ1JJUFRTKSk7XG4gICAgICAgICAgICBhbGxTY3JpcHRFbGVtZW50cyA9IFtdLmNvbmNhdChhbGxTY3JpcHRFbGVtZW50cywgc2NyaXB0RWxlbWVudHMpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhbGxTY3JpcHRFbGVtZW50cztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50LCBhbmQgdGhlbiBhcHBlbmRpbmdcbiAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyRWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZVBhdGhcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyRWxlbWVudChjbGFzc05hbWUsIGNvbXBvbmVudCwgbW9kdWxlUGF0aCkge1xuXG4gICAgICAgIGxldCBlbGVtZW50TmFtZSA9IHV0aWxpdHkudG9TbmFrZUNhc2UoY2xhc3NOYW1lKSxcbiAgICAgICAgICAgIHByb3RvdHlwZSAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IG1vZHVsZVBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChjb21wb25lbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5kZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgUmVhY3QucmVuZGVyKHJlbmRlcmVkRWxlbWVudCwgY29udGVudEVsZW1lbnQpKTtcblxuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChjc3MuYXNzb2NpYXRlKG1vZHVsZVBhdGgsIHNoYWRvd1Jvb3QpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgncmVzb2x2ZWQnLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnROYW1lLCB7XG4gICAgICAgICAgICBwcm90b3R5cGU6IHByb3RvdHlwZVxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vL2V4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdGVyIHtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBjb25zdHJ1Y3RvclxuLy8gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuLy8gICAgICogQHJldHVybiB7UmVnaXN0ZXJ9XG4vLyAgICAgKi9cbi8vICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcbi8vXG4vLyAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG4vLyAgICAgICAgdGhpcy5kZWJ1ZyAgICAgID0gdHJ1ZTtcbi8vXG4vLyAgICAgICAgdGhpcy5yZWdpc3RlciguLi5tb2R1bGVzKTtcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBFbnRyeSBwb2ludCBmb3IgdGhlIGNvbXBvbmVudCBpbml0aWFsaXNhdGlvbi4gSXQgYWNjZXB0cyBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdG8gaW5pdGlhbGlzZVxuLy8gICAgICogbW9kdWxlcyBleHBsaWNpdGx5LCBvdGhlcndpc2UgdGhpcy5maW5kTW9kdWxlcyB3aWxsIGJlIGludm9rZWQsIGFuZCBtb2R1bGVzIHdpbGwgYmUgZm91bmRcbi8vICAgICAqIGF1dG9tYXRpY2FsbHkgZnJvbSB0aGUgY3VycmVudCBIVE1MIGltcG9ydHMgb2YgdGhlIGRvY3VtZW50LlxuLy8gICAgICpcbi8vICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbi8vICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbi8vICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgKi9cbi8vICAgIHJlZ2lzdGVyKC4uLm1vZHVsZXMpIHtcbi8vXG4vLyAgICAgICAgdGhpcy5sb2FkSW1wb3J0cygpLmZvckVhY2goKHByb21pc2UpID0+IHtcbi8vXG4vLyAgICAgICAgICAgIHByb21pc2UudGhlbigob3B0aW9ucykgPT4ge1xuLy9cbi8vICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IG9wdGlvbnMuc2NyaXB0cyxcbi8vICAgICAgICAgICAgICAgICAgICBtb2R1bGVQYXRoICAgICA9IG9wdGlvbnMucGF0aCxcbi8vICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lICAgICA9IG9wdGlvbnMubmFtZTtcbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAobW9kdWxlcy5sZW5ndGggJiYgIX5tb2R1bGVzLmluZGV4T2YobW9kdWxlTmFtZSkpIHtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgbG9nZ2VyLnNlbmQobW9kdWxlTmFtZSwgbG9nZ2VyLnR5cGUubW9kdWxlKTtcbi8vXG4vLyAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cy5mb3JFYWNoKChzY3JpcHRFbGVtZW50KSA9PiB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRTcmMgID0gc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0UGF0aCA9IGAke3NjcmlwdFNyY31gO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSAnbGluaycpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0U3JjICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdFBhdGggPSBgJHttb2R1bGVQYXRofS8ke3NjcmlwdFNyY31gO1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgU3lzdGVtLmltcG9ydChzY3JpcHRQYXRoKS50aGVuKChSZWdpc3RlcikgPT4ge1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IFJlZ2lzdGVyLmRlZmF1bHQudG9TdHJpbmcoKS5tYXRjaCgvKD86ZnVuY3Rpb258Y2xhc3MpXFxzKihbYS16XSspL2kpWzFdLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2NsYXNzTmFtZV0gPSBSZWdpc3Rlci5kZWZhdWx0O1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoY2xhc3NOYW1lLCBjb21wb25lbnQsIG1vZHVsZVBhdGgpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBSZXNwb25zaWJsZSBmb3IgZmluZGluZyBhbGwgb2YgdGhlIEhUTUwgaW1wb3J0cyBhbmQgcmV0dXJuaW5nIGEgcHJvbWlzZSB3aGVuIGVhY2ggb2YgdGhlXG4vLyAgICAgKiBIVE1MIGltcG9ydHMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbXBvcnRlZC4gVGhpcyBhbGxvd3MgdXMgdG8gYWNjZXNzIHRoZSBgb3duZXJEb2N1bWVudGBcbi8vICAgICAqIG9uIGVhY2ggb2YgdGhlIGxpbmsgZWxlbWVudHMga25vd2luZyB0aGF0IGl0IGlzbid0IG51bGwuXG4vLyAgICAgKlxuLy8gICAgICogQG1ldGhvZCBsb2FkSW1wb3J0c1xuLy8gICAgICogQHJldHVybiB7QXJyYXl9XG4vLyAgICAgKi9cbi8vICAgIGxvYWRJbXBvcnRzKCkge1xuLy9cbi8vICAgICAgICBsZXQgaW1wb3J0RG9jdW1lbnRzICA9IHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLklNUE9SVFMpKSxcbi8vICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpO1xuLy9cbi8vICAgICAgICByZXR1cm4gW10uY29uY2F0KGltcG9ydERvY3VtZW50cywgdGVtcGxhdGVFbGVtZW50cykubWFwKChtb2RlbCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgbGV0IHR5cGUgPSBtb2RlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuLy9cbi8vICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4vL1xuLy8gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgY2FzZSAoJ2xpbmsnKTogICAgIHRoaXMucmVzb2x2ZUxpbmsocmVzb2x2ZSwgbW9kZWwpOyBicmVhaztcbi8vICAgICAgICAgICAgICAgICAgICBjYXNlICgndGVtcGxhdGUnKTogdGhpcy5yZXNvbHZlVGVtcGxhdGUocmVzb2x2ZSwgbW9kZWwpOyBicmVhaztcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIHJlc29sdmVUZW1wbGF0ZVxuLy8gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZVxuLy8gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbi8vICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgKi9cbi8vICAgIHJlc29sdmVUZW1wbGF0ZShyZXNvbHZlLCB0ZW1wbGF0ZUVsZW1lbnQpIHtcbi8vXG4vLyAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuU0NSSVBUUykpLFxuLy8gICAgICAgICAgICBtb2R1bGVQYXRoICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlUGF0aChzY3JpcHRFbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoJ3NyYycpKSxcbi8vICAgICAgICAgICAgbW9kdWxlTmFtZSAgICAgPSB1dGlsaXR5LmdldE1vZHVsZU5hbWUoc2NyaXB0RWxlbWVudHNbMF0uZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4vL1xuLy8gICAgICAgIHJlc29sdmUoeyBzY3JpcHRzOiBzY3JpcHRFbGVtZW50cywgcGF0aDogbW9kdWxlUGF0aCwgbmFtZTogbW9kdWxlTmFtZSwgdHlwZTogJ3RlbXBsYXRlJyB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIHJlc29sdmVMaW5rXG4vLyAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlXG4vLyAgICAgKiBAcGFyYW0ge0hUTUxMaW5rRWxlbWVudH0gbGlua0VsZW1lbnRcbi8vICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgKi9cbi8vICAgIHJlc29sdmVMaW5rKHJlc29sdmUsIGxpbmtFbGVtZW50KSB7XG4vL1xuLy8gICAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4vL1xuLy8gICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB0aGlzLmZpbmRTY3JpcHRzKGxpbmtFbGVtZW50LmltcG9ydCksXG4vLyAgICAgICAgICAgICAgICBtb2R1bGVQYXRoICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlUGF0aChsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSksXG4vLyAgICAgICAgICAgICAgICBtb2R1bGVOYW1lICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlTmFtZShsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG4vL1xuLy8gICAgICAgICAgICByZXNvbHZlKHsgc2NyaXB0czogc2NyaXB0RWxlbWVudHMsIHBhdGg6IG1vZHVsZVBhdGgsIG5hbWU6IG1vZHVsZU5hbWUsIHR5cGU6ICdsaW5rJyB9KTtcbi8vXG4vLyAgICAgICAgfSk7XG4vL1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBIVE1MIGltcG9ydHMgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQuIEl0IHdpbGwgYmUgaW52b2tlZCBpZlxuLy8gICAgICogdGhlIGRldmVsb3BlciBkb2Vzbid0IGV4cGxpY2l0bHkgcGFzcyBpbiBhbiBhcnJheSBvZiBtb2R1bGVzIHRvIGxvYWQgdmlhIHRoZSBNYXBsZSBjb25zdHJ1Y3RvciB3aGVuXG4vLyAgICAgKiBpbnN0YW50aWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuLy8gICAgICpcbi8vICAgICAqIEBtZXRob2QgZmluZE1vZHVsZXNcbi8vICAgICAqIEByZXR1cm4ge0FycmF5fVxuLy8gICAgICovXG4vLyAgICBmaW5kTW9kdWxlcygpIHtcbi8vXG4vLyAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLklNUE9SVFMpKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG4vL1xuLy8gICAgICAgICAgICBsZXQgaW1wb3J0UGF0aCA9IHV0aWxpdHkuZ2V0SW1wb3J0UGF0aChpbXBvcnREb2N1bWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG4vLyAgICAgICAgICAgIHJldHVybiB2b2lkIGltcG9ydFBhdGg7XG4vL1xuLy8gICAgICAgIH0pO1xuLy9cbi8vICAgIH1cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBtZXRob2QgZmluZFNjcmlwdHNcbi8vICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbXBvcnREb2N1bWVudFxuLy8gICAgICogQHJldHVybiB7QXJyYXl9XG4vLyAgICAgKi9cbi8vICAgIGZpbmRTY3JpcHRzKGltcG9ydERvY3VtZW50KSB7XG4vL1xuLy8gICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzICA9IHV0aWxpdHkudG9BcnJheShpbXBvcnREb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpLFxuLy8gICAgICAgICAgICBhbGxTY3JpcHRFbGVtZW50cyA9IFtdO1xuLy9cbi8vICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuU0NSSVBUUykpO1xuLy8gICAgICAgICAgICBhbGxTY3JpcHRFbGVtZW50cyA9IFtdLmNvbmNhdChhbGxTY3JpcHRFbGVtZW50cywgc2NyaXB0RWxlbWVudHMpO1xuLy9cbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgcmV0dXJuIGFsbFNjcmlwdEVsZW1lbnRzO1xuLy9cbi8vICAgIH1cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIFJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50LCBhbmQgdGhlbiBhcHBlbmRpbmdcbi8vICAgICAqIHRoZSBhc3NvY2lhdGVkIFJlYWN0LmpzIGNvbXBvbmVudC5cbi8vICAgICAqXG4vLyAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyRWxlbWVudFxuLy8gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuLy8gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudFxuLy8gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZVBhdGhcbi8vICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgKi9cbi8vICAgIHJlZ2lzdGVyRWxlbWVudChjbGFzc05hbWUsIGNvbXBvbmVudCwgbW9kdWxlUGF0aCkge1xuLy9cbi8vICAgICAgICBsZXQgZWxlbWVudE5hbWUgPSB1dGlsaXR5LnRvU25ha2VDYXNlKGNsYXNzTmFtZSk7XG4vL1xuLy8gICAgICAgIGxvZ2dlci5zZW5kKGAke2VsZW1lbnROYW1lfWAsIGxvZ2dlci50eXBlLmNvbXBvbmVudCk7XG4vLyAgICAgICAgbGV0IHByb3RvdHlwZSAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuLy8gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuLy9cbi8vICAgICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuLy8gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbi8vICAgICAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGVmYXVsdFByb3BzID0ge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAgICAgICBtb2R1bGVQYXRoLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAgICB0aGlzLmNsb25lTm9kZSh0cnVlKVxuLy8gICAgICAgICAgICAgICAgICAgIH07XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCBhdHRyaWJ1dGVzIGZyb20gdGhlIGVsZW1lbnQgYW5kIHRyYW5zZmVyIHRvIHRoZSBSZWFjdC5qcyBjbGFzcy5cbi8vICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAsIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXM7IGluZGV4IDwgYXR0cmlidXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzLml0ZW0oaW5kZXgpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKC9eZGF0YS0vaSwgJycpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIGxldCByZW5kZXJlZEVsZW1lbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudCksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5kZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgUmVhY3QucmVuZGVyKHJlbmRlcmVkRWxlbWVudCwgY29udGVudEVsZW1lbnQpKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoY3NzLmFzc29jaWF0ZShtb2R1bGVQYXRoLCBzaGFkb3dSb290KSkudGhlbigoKSA9PiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdyZXNvbHZlZCcsICcnKTtcbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgIH0pO1xuLy9cbi8vICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZWxlbWVudE5hbWUsIHtcbi8vICAgICAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGVcbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy99IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtSZWFjdENsYXNzLmNyZWF0ZUNsYXNzLkNvbnN0cnVjdG9yfSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGFFbGVtZW50ICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXG4gICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IFtdLFxuICAgICAgICAgICAgICAgIGV2ZW50RXNxdWUgPSAvb25bYS16XSsvaTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYUVsZW1lbnQpLmZvckVhY2goKGtleSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGtleS5tYXRjaChldmVudEVzcXVlKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChrZXkucmVwbGFjZSgvXm9uLywgJycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0RXZlbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRFdmVudChldmVudE5hbWUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaE5hbWUgPSBuZXcgUmVnRXhwKGV2ZW50TmFtZSwgJ2knKSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiAgID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Lm1hdGNoKG1hdGNoTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRGbjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZmluZEV2ZW50c1xuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZWFjdElkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEV2ZW50cyhub2RlLCByZWFjdElkLCBldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBldmVudHMgICAgICA9IFtdLFxuICAgICAgICAgICAgICAgICAgICByb290RXZlbnRGbiA9IGdldEV2ZW50KGV2ZW50TmFtZSwgbm9kZS5fY3VycmVudEVsZW1lbnQuX3N0b3JlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb290RXZlbnRGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGV2ZW50IGluIHJvb3QhXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKHJvb3RFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChub2RlLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5fcmVuZGVyZWRDaGlsZHJlbjtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkIGluIGNoaWxkcmVuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGlkKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGNoaWxkcmVuW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3Jvb3ROb2RlSUQgPT09IHJlYWN0SWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIGl0ZW0uX2luc3RhbmNlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiBjaGlsZHJlbiFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goY2hpbGRFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3JlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmluZEV2ZW50cyhpdGVtLCByZWFjdElkLCBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgY3JlYXRlRXZlbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRzID0gY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICAgPSBgb24ke2V2ZW50LnR5cGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBmaW5kRXZlbnRzKGNvbXBvbmVudHMsIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVhY3RpZCcpLCBldmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRGbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbi5hcHBseShjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50TmFtZSBvZiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdGFudCB0eXBlXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBtb2R1bGU6ICdtb2R1bGUnLFxuICAgICAgICAgICAgY29tcG9uZW50OiAnY29tcG9uZW50J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHNlbmRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHNlbmQobWVzc2FnZSwgdHlwZSkge1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcblxuICAgICAgICAgICAgICAgIC8vY2FzZSAodGhpcy50eXBlLm1vZHVsZSk6XG4gICAgICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coYCVjIE1vZHVsZTogJHttZXNzYWdlfSBgLCAnY29sb3I6IHdoaXRlOyBib3JkZXItcmFkaXVzOiAzcHg7IHBhZGRpbmc6IDJweCAwOyBmb250LXNpemU6IDlweDsgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgICNlZjMyMzIgMCUsI2Q2M2EyYyAxMDAlKScpO1xuICAgICAgICAgICAgICAgIC8vICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAodGhpcy50eXBlLmNvbXBvbmVudCk6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlY0NvbXBvbmVudDolYyAke21lc3NhZ2V9YCwgJ2NvbG9yOiAjZDYzYTJjJywgJ2NvbG9yOiBibGFjaycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkgbGlua1NlbGVjdG9yXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBsaW5rU2VsZWN0b3I6ICdsaW5rW3R5cGU9XCJ0ZXh0L2Nzc1wiXScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgYXNzb2NpYXRlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb21wb25lbnRQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Um9vdFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZShjb21wb25lbnRQYXRoLCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IFtdO1xuXG4gICAgICAgICAgICB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5mb3JFYWNoKChsaW5rKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaHJlZiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaHJlZi5tYXRjaChjb21wb25lbnRQYXRoKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KGxpbmsuaW1wb3J0LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJykpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudHMuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMgICAgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmsnKSkubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7Y29tcG9uZW50UGF0aH0vJHtsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMuZm9yRWFjaCgoY3NzRG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZUVsZW1lbnQgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2goY3NzRG9jdW1lbnQpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBib2R5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzdHlsZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tID8gQXJyYXkuZnJvbShhcnJheUxpa2UpIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0TW9kdWxlUGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRNb2R1bGVQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRNb2R1bGVOYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE1vZHVsZU5hbWUoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkucG9wKCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7Il19
