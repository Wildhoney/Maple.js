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
    STYLES: 'link[type="text/css"]',
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

                    (details.components || []).forEach(function (component) {

                        (component.scripts || []).forEach(function (script) {

                            System['import'](script).then(function (moduleImport) {

                                var componentName = moduleImport['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1];
                                _this.registerElement(componentName, moduleImport['default'], details.modulePath, component.styles);
                            });
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

            return _utility2['default'].toArray(document.querySelectorAll(SELECTOR.LINKS)).map(function (linkElement) {

                return new Promise(function (resolve) {

                    linkElement.addEventListener('load', function () {

                        var modulePath = _utility2['default'].getModulePath(linkElement.getAttribute('href'));

                        resolve({
                            modulePath: modulePath,
                            moduleName: _utility2['default'].getModuleName(linkElement.getAttribute('href')),
                            components: _utility2['default'].toArray(linkElement['import'].querySelectorAll(SELECTOR.TEMPLATES)).map(function (templateElement) {
                                return {
                                    scripts: _utility2['default'].toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS)).map(function (scriptElement) {
                                        return '' + modulePath + '/' + scriptElement.getAttribute('src').split('.').slice(0, -1).join('/');
                                    }),
                                    styles: _utility2['default'].toArray(templateElement.content.querySelectorAll(SELECTOR.STYLES)).map(function (linkElement) {
                                        return '' + modulePath + '/' + linkElement.getAttribute('href').split('.').slice(0, -1).join('/');
                                    })
                                };
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
                        components: scriptElements.map(function (scriptElement) {
                            return {
                                scripts: ['' + scriptElement.getAttribute('src').split('.').slice(0, -1).join('/')],
                                styles: ['' + scriptElement.getAttribute('src').split('.').slice(0, -1).join('/')]
                            };
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
         * @param {Array} styles
         * @return {void}
         */
        value: function registerElement(className, component, modulePath, styles) {

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

                        //Promise.all(css.associate(modulePath, shadowRoot)).then(() => {
                        //    this.removeAttribute('unresolved');
                        //    this.setAttribute('resolved', '');
                        //});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9SZWdpc3Rlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0V2ZW50cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL0xvZ2dlci5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvVXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7d0JDQXNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7Ozs7O1FBT0ssS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakQscUZBQWdCLE9BQU8sT0FBRTtTQUM1QixDQUFDLENBQUM7S0FFTjs7QUFJTCxXQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUV6QixDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7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QVEsQ0FBQztTQUVuQjs7S0FFSixDQUFDO0NBRUwsQ0FBQSxDQUFFLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7cUJDcEVHLENBQUMsU0FBUyxJQUFJLEdBQUc7O0FBRTVCLGdCQUFZLENBQUM7O0FBRWIsV0FBTzs7Ozs7Ozs7QUFRSCxtQkFBVyxFQUFBLHFCQUFDLFNBQVMsRUFBZ0I7Z0JBQWQsTUFBTSxnQ0FBRyxHQUFHOztBQUMvQixtQkFBTyxTQUFTLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSzt1QkFBSSxLQUFLO2FBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqRzs7Ozs7OztBQU9ELGVBQU8sRUFBQSxpQkFBQyxTQUFTLEVBQUU7QUFDZixtQkFBTyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RGOzs7Ozs7O0FBT0QscUJBQWEsRUFBQSx1QkFBQyxVQUFVLEVBQUU7QUFDdEIsbUJBQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZEOzs7Ozs7O0FBT0QscUJBQWEsRUFBQSx1QkFBQyxVQUFVLEVBQUU7QUFDdEIsbUJBQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDbkQ7O0tBRUosQ0FBQztDQUVMLENBQUEsRUFBRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVnaXN0ZXIgIGZyb20gJy4vY29tcG9uZW50cy9SZWdpc3Rlci5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgPSAnYmFiZWwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBSZWdpc3RlciguLi5tb2R1bGVzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgICR3aW5kb3cuTWFwbGUgPSBNYXBsZTtcblxufSkod2luZG93LCBkb2N1bWVudCk7IiwiaW1wb3J0IGV2ZW50cyAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5pbXBvcnQgY3NzICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvU3R5bGVzaGVldHMuanMnO1xuaW1wb3J0IHV0aWxpdHkgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZ2dlciAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0xvZ2dlci5qcyc7XG5cbi8qKlxuICogQGNvbnN0YW50IFNFTEVDVE9SXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5jb25zdCBTRUxFQ1RPUiA9IHtcbiAgICBMSU5LUzogICAgICdsaW5rW3JlbD1cImltcG9ydFwiXScsXG4gICAgVEVNUExBVEVTOiAndGVtcGxhdGUnLFxuICAgIFNUWUxFUzogICAgJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICBTQ1JJUFRTOiAgICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXSdcbn07XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBSZWdpc3RlclxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0ZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge1JlZ2lzdGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlciguLi5tb2R1bGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVnaXN0ZXIoLi4ubW9kdWxlcykge1xuXG4gICAgICAgIFtdLmNvbmNhdCh0aGlzLmxvYWRMaW5rcygpLCB0aGlzLmxvYWRUZW1wbGF0ZXMoKSkuZm9yRWFjaCgocHJvbWlzZSkgPT4ge1xuXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oKGRldGFpbHMpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCAmJiAhfm1vZHVsZXMuaW5kZXhPZihkZXRhaWxzLm1vZHVsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAoZGV0YWlscy5jb21wb25lbnRzIHx8IFtdKS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAoY29tcG9uZW50LnNjcmlwdHMgfHwgW10pLmZvckVhY2goKHNjcmlwdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdCkudGhlbigobW9kdWxlSW1wb3J0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50TmFtZSA9IG1vZHVsZUltcG9ydC5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudChjb21wb25lbnROYW1lLCBtb2R1bGVJbXBvcnQuZGVmYXVsdCwgZGV0YWlscy5tb2R1bGVQYXRoLCBjb21wb25lbnQuc3R5bGVzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRMaW5rc1xuICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgKi9cbiAgICBsb2FkTGlua3MoKSB7XG5cbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLkxJTktTKSkubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZVBhdGggPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aDogbW9kdWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6IHV0aWxpdHkuZ2V0TW9kdWxlTmFtZShsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzOiB1dGlsaXR5LnRvQXJyYXkobGlua0VsZW1lbnQuaW1wb3J0LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuVEVNUExBVEVTKSkubWFwKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRzOiB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TQ1JJUFRTKSkubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9kdWxlUGF0aH0vJHtzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLycpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6ICB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TVFlMRVMpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9kdWxlUGF0aH0vJHtsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRUZW1wbGF0ZXNcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFRlbXBsYXRlcygpIHtcblxuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuVEVNUExBVEVTKSkubWFwKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TQ1JJUFRTKSk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aDogdXRpbGl0eS5nZXRNb2R1bGVQYXRoKHNjcmlwdEVsZW1lbnRzWzBdLmdldEF0dHJpYnV0ZSgnc3JjJykpLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiB1dGlsaXR5LmdldE1vZHVsZU5hbWUoc2NyaXB0RWxlbWVudHNbMF0uZ2V0QXR0cmlidXRlKCdzcmMnKSksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM6IHNjcmlwdEVsZW1lbnRzLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRzOiBbYCR7c2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKX1gXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6ICBbYCR7c2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKX1gXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZmluZFNjcmlwdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1wb3J0RG9jdW1lbnRcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kU2NyaXB0cyhpbXBvcnREb2N1bWVudCkge1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzICA9IHV0aWxpdHkudG9BcnJheShpbXBvcnREb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpLFxuICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXTtcblxuICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TQ1JJUFRTKSk7XG4gICAgICAgICAgICBhbGxTY3JpcHRFbGVtZW50cyA9IFtdLmNvbmNhdChhbGxTY3JpcHRFbGVtZW50cywgc2NyaXB0RWxlbWVudHMpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhbGxTY3JpcHRFbGVtZW50cztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50LCBhbmQgdGhlbiBhcHBlbmRpbmdcbiAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyRWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZVBhdGhcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzdHlsZXNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyRWxlbWVudChjbGFzc05hbWUsIGNvbXBvbmVudCwgbW9kdWxlUGF0aCwgc3R5bGVzKSB7XG5cbiAgICAgICAgbGV0IGVsZW1lbnROYW1lID0gdXRpbGl0eS50b1NuYWtlQ2FzZShjbGFzc05hbWUpLFxuICAgICAgICAgICAgcHJvdG90eXBlICAgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IHsgcGF0aDogbW9kdWxlUGF0aCwgZWxlbWVudDogdGhpcy5jbG9uZU5vZGUodHJ1ZSkgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCBhdHRyaWJ1dGVzIGZyb20gdGhlIGVsZW1lbnQgYW5kIHRyYW5zZmVyIHRvIHRoZSBSZWFjdC5qcyBjbGFzcy5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzLml0ZW0oaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKC9eZGF0YS0vaSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHNbbmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCByZW5kZXJlZEVsZW1lbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290ICAgICAgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNvbnRlbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBSZWFjdC5yZW5kZXIocmVuZGVyZWRFbGVtZW50LCBjb250ZW50RWxlbWVudCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUHJvbWlzZS5hbGwoY3NzLmFzc29jaWF0ZShtb2R1bGVQYXRoLCBzaGFkb3dSb290KSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuc2V0QXR0cmlidXRlKCdyZXNvbHZlZCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgLy99KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChlbGVtZW50TmFtZSwge1xuICAgICAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGVcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLy9leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWdpc3RlciB7XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAY29uc3RydWN0b3Jcbi8vICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbi8vICAgICAqIEByZXR1cm4ge1JlZ2lzdGVyfVxuLy8gICAgICovXG4vLyAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG4vL1xuLy8gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xuLy8gICAgICAgIHRoaXMuZGVidWcgICAgICA9IHRydWU7XG4vL1xuLy8gICAgICAgIHRoaXMucmVnaXN0ZXIoLi4ubW9kdWxlcyk7XG4vL1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogRW50cnkgcG9pbnQgZm9yIHRoZSBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uIEl0IGFjY2VwdHMgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRvIGluaXRpYWxpc2Vcbi8vICAgICAqIG1vZHVsZXMgZXhwbGljaXRseSwgb3RoZXJ3aXNlIHRoaXMuZmluZE1vZHVsZXMgd2lsbCBiZSBpbnZva2VkLCBhbmQgbW9kdWxlcyB3aWxsIGJlIGZvdW5kXG4vLyAgICAgKiBhdXRvbWF0aWNhbGx5IGZyb20gdGhlIGN1cnJlbnQgSFRNTCBpbXBvcnRzIG9mIHRoZSBkb2N1bWVudC5cbi8vICAgICAqXG4vLyAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4vLyAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICovXG4vLyAgICByZWdpc3RlciguLi5tb2R1bGVzKSB7XG4vL1xuLy8gICAgICAgIHRoaXMubG9hZEltcG9ydHMoKS5mb3JFYWNoKChwcm9taXNlKSA9PiB7XG4vL1xuLy8gICAgICAgICAgICBwcm9taXNlLnRoZW4oKG9wdGlvbnMpID0+IHtcbi8vXG4vLyAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSBvcHRpb25zLnNjcmlwdHMsXG4vLyAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSBvcHRpb25zLnBhdGgsXG4vLyAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZSAgICAgPSBvcHRpb25zLm5hbWU7XG4vL1xuLy8gICAgICAgICAgICAgICAgaWYgKG1vZHVsZXMubGVuZ3RoICYmICF+bW9kdWxlcy5pbmRleE9mKG1vZHVsZU5hbWUpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGxvZ2dlci5zZW5kKG1vZHVsZU5hbWUsIGxvZ2dlci50eXBlLm1vZHVsZSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudHMuZm9yRWFjaCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0U3JjICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdFBhdGggPSBgJHtzY3JpcHRTcmN9YDtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ2xpbmsnKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdFNyYyAgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRQYXRoID0gYCR7bW9kdWxlUGF0aH0vJHtzY3JpcHRTcmN9YDtcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIFN5c3RlbS5pbXBvcnQoc2NyaXB0UGF0aCkudGhlbigoUmVnaXN0ZXIpID0+IHtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSBSZWdpc3Rlci5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tjbGFzc05hbWVdID0gUmVnaXN0ZXIuZGVmYXVsdDtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgfSk7XG4vL1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBIVE1MIGltcG9ydHMgYW5kIHJldHVybmluZyBhIHByb21pc2Ugd2hlbiBlYWNoIG9mIHRoZVxuLy8gICAgICogSFRNTCBpbXBvcnRzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgaW1wb3J0ZWQuIFRoaXMgYWxsb3dzIHVzIHRvIGFjY2VzcyB0aGUgYG93bmVyRG9jdW1lbnRgXG4vLyAgICAgKiBvbiBlYWNoIG9mIHRoZSBsaW5rIGVsZW1lbnRzIGtub3dpbmcgdGhhdCBpdCBpc24ndCBudWxsLlxuLy8gICAgICpcbi8vICAgICAqIEBtZXRob2QgbG9hZEltcG9ydHNcbi8vICAgICAqIEByZXR1cm4ge0FycmF5fVxuLy8gICAgICovXG4vLyAgICBsb2FkSW1wb3J0cygpIHtcbi8vXG4vLyAgICAgICAgbGV0IGltcG9ydERvY3VtZW50cyAgPSB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5JTVBPUlRTKSksXG4vLyAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5URU1QTEFURVMpKTtcbi8vXG4vLyAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChpbXBvcnREb2N1bWVudHMsIHRlbXBsYXRlRWxlbWVudHMpLm1hcCgobW9kZWwpID0+IHtcbi8vXG4vLyAgICAgICAgICAgIGxldCB0eXBlID0gbW9kZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbi8vXG4vLyAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNhc2UgKCdsaW5rJyk6ICAgICB0aGlzLnJlc29sdmVMaW5rKHJlc29sdmUsIG1vZGVsKTsgYnJlYWs7XG4vLyAgICAgICAgICAgICAgICAgICAgY2FzZSAoJ3RlbXBsYXRlJyk6IHRoaXMucmVzb2x2ZVRlbXBsYXRlKHJlc29sdmUsIG1vZGVsKTsgYnJlYWs7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgfSk7XG4vL1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQG1ldGhvZCByZXNvbHZlVGVtcGxhdGVcbi8vICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVcbi8vICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4vLyAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICovXG4vLyAgICByZXNvbHZlVGVtcGxhdGUocmVzb2x2ZSwgdGVtcGxhdGVFbGVtZW50KSB7XG4vL1xuLy8gICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheSh0ZW1wbGF0ZUVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlNDUklQVFMpKSxcbi8vICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgoc2NyaXB0RWxlbWVudHNbMF0uZ2V0QXR0cmlidXRlKCdzcmMnKSksXG4vLyAgICAgICAgICAgIG1vZHVsZU5hbWUgICAgID0gdXRpbGl0eS5nZXRNb2R1bGVOYW1lKHNjcmlwdEVsZW1lbnRzWzBdLmdldEF0dHJpYnV0ZSgnc3JjJykpO1xuLy9cbi8vICAgICAgICByZXNvbHZlKHsgc2NyaXB0czogc2NyaXB0RWxlbWVudHMsIHBhdGg6IG1vZHVsZVBhdGgsIG5hbWU6IG1vZHVsZU5hbWUsIHR5cGU6ICd0ZW1wbGF0ZScgfSk7XG4vL1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQG1ldGhvZCByZXNvbHZlTGlua1xuLy8gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZVxuLy8gICAgICogQHBhcmFtIHtIVE1MTGlua0VsZW1lbnR9IGxpbmtFbGVtZW50XG4vLyAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICovXG4vLyAgICByZXNvbHZlTGluayhyZXNvbHZlLCBsaW5rRWxlbWVudCkge1xuLy9cbi8vICAgICAgICBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gdGhpcy5maW5kU2NyaXB0cyhsaW5rRWxlbWVudC5pbXBvcnQpLFxuLy8gICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldE1vZHVsZVBhdGgobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpLFxuLy8gICAgICAgICAgICAgICAgbW9kdWxlTmFtZSAgICAgPSB1dGlsaXR5LmdldE1vZHVsZU5hbWUobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuLy9cbi8vICAgICAgICAgICAgcmVzb2x2ZSh7IHNjcmlwdHM6IHNjcmlwdEVsZW1lbnRzLCBwYXRoOiBtb2R1bGVQYXRoLCBuYW1lOiBtb2R1bGVOYW1lLCB0eXBlOiAnbGluaycgfSk7XG4vL1xuLy8gICAgICAgIH0pO1xuLy9cbi8vICAgIH1cbi8vXG4vLyAgICAvKipcbi8vICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgSFRNTCBpbXBvcnRzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50LiBJdCB3aWxsIGJlIGludm9rZWQgaWZcbi8vICAgICAqIHRoZSBkZXZlbG9wZXIgZG9lc24ndCBleHBsaWNpdGx5IHBhc3MgaW4gYW4gYXJyYXkgb2YgbW9kdWxlcyB0byBsb2FkIHZpYSB0aGUgTWFwbGUgY29uc3RydWN0b3Igd2hlblxuLy8gICAgICogaW5zdGFudGlhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbi8vICAgICAqXG4vLyAgICAgKiBAbWV0aG9kIGZpbmRNb2R1bGVzXG4vLyAgICAgKiBAcmV0dXJuIHtBcnJheX1cbi8vICAgICAqL1xuLy8gICAgZmluZE1vZHVsZXMoKSB7XG4vL1xuLy8gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5JTVBPUlRTKSkubWFwKChpbXBvcnREb2N1bWVudCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgbGV0IGltcG9ydFBhdGggPSB1dGlsaXR5LmdldEltcG9ydFBhdGgoaW1wb3J0RG9jdW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuLy8gICAgICAgICAgICByZXR1cm4gdm9pZCBpbXBvcnRQYXRoO1xuLy9cbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIGZpbmRTY3JpcHRzXG4vLyAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1wb3J0RG9jdW1lbnRcbi8vICAgICAqIEByZXR1cm4ge0FycmF5fVxuLy8gICAgICovXG4vLyAgICBmaW5kU2NyaXB0cyhpbXBvcnREb2N1bWVudCkge1xuLy9cbi8vICAgICAgICBsZXQgdGVtcGxhdGVFbGVtZW50cyAgPSB1dGlsaXR5LnRvQXJyYXkoaW1wb3J0RG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5URU1QTEFURVMpKSxcbi8vICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXTtcbi8vXG4vLyAgICAgICAgdGVtcGxhdGVFbGVtZW50cy5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcbi8vXG4vLyAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheSh0ZW1wbGF0ZUVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlNDUklQVFMpKTtcbi8vICAgICAgICAgICAgYWxsU2NyaXB0RWxlbWVudHMgPSBbXS5jb25jYXQoYWxsU2NyaXB0RWxlbWVudHMsIHNjcmlwdEVsZW1lbnRzKTtcbi8vXG4vLyAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgIHJldHVybiBhbGxTY3JpcHRFbGVtZW50cztcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBSZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCwgYW5kIHRoZW4gYXBwZW5kaW5nXG4vLyAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4vLyAgICAgKlxuLy8gICAgICogQG1ldGhvZCByZWdpc3RlckVsZW1lbnRcbi8vICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbi8vICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbi8vICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2R1bGVQYXRoXG4vLyAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICovXG4vLyAgICByZWdpc3RlckVsZW1lbnQoY2xhc3NOYW1lLCBjb21wb25lbnQsIG1vZHVsZVBhdGgpIHtcbi8vXG4vLyAgICAgICAgbGV0IGVsZW1lbnROYW1lID0gdXRpbGl0eS50b1NuYWtlQ2FzZShjbGFzc05hbWUpO1xuLy9cbi8vICAgICAgICBsb2dnZXIuc2VuZChgJHtlbGVtZW50TmFtZX1gLCBsb2dnZXIudHlwZS5jb21wb25lbnQpO1xuLy8gICAgICAgIGxldCBwcm90b3R5cGUgICA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7XG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogQHByb3BlcnR5IGF0dGFjaGVkQ2FsbGJhY2tcbi8vICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGF0dGFjaGVkQ2FsbGJhY2s6IHtcbi8vXG4vLyAgICAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICAgICAqIEBtZXRob2QgdmFsdWVcbi8vICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogICAgICAgbW9kdWxlUGF0aCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogICAgdGhpcy5jbG9uZU5vZGUodHJ1ZSlcbi8vICAgICAgICAgICAgICAgICAgICB9O1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4vLyAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHNbbmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChjb21wb25lbnQpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50JyksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNvbnRlbnRFbGVtZW50KTtcbi8vICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGNzcy5hc3NvY2lhdGUobW9kdWxlUGF0aCwgc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgncmVzb2x2ZWQnLCAnJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnROYW1lLCB7XG4vLyAgICAgICAgICAgIHByb3RvdHlwZTogcHJvdG90eXBlXG4vLyAgICAgICAgfSk7XG4vL1xuLy8gICAgfVxuLy9cbi8vfSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7UmVhY3RDbGFzcy5jcmVhdGVDbGFzcy5Db25zdHJ1Y3Rvcn0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBkZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgY29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBhRWxlbWVudCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICBldmVudEVzcXVlID0gL29uW2Etel0rL2k7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFFbGVtZW50KS5mb3JFYWNoKChrZXkpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2goZXZlbnRFc3F1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goa2V5LnJlcGxhY2UoL15vbi8sICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEV2ZW50XG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xuICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RXZlbnQoZXZlbnROYW1lLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hOYW1lID0gbmV3IFJlZ0V4cChldmVudE5hbWUsICdpJyksXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5tYXRjaChtYXRjaE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50Rm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGZpbmRFdmVudHNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVhY3RJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRFdmVudHMobm9kZSwgcmVhY3RJZCwgZXZlbnROYW1lKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRzICAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIG5vZGUuX2N1cnJlbnRFbGVtZW50Ll9zdG9yZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocm9vdEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiByb290IVxuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChyb290RXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZCBpbiBjaGlsZHJlbikge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBjaGlsZHJlbltpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRFdmVudEZuID0gZ2V0RXZlbnQoZXZlbnROYW1lLCBpdGVtLl9pbnN0YW5jZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRFdmVudEZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgZXZlbnQgaW4gY2hpbGRyZW4hXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGNoaWxkRXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yZW5kZXJlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRFdmVudHMoaXRlbSwgcmVhY3RJZCwgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUV2ZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVFdmVudChldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50cyA9IGNvbXBvbmVudC5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgID0gYG9uJHtldmVudC50eXBlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMgICAgID0gZmluZEV2ZW50cyhjb21wb25lbnRzLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKSwgZXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50Rm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4uYXBwbHkoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudE5hbWUgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RhbnQgdHlwZVxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgbW9kdWxlOiAnbW9kdWxlJyxcbiAgICAgICAgICAgIGNvbXBvbmVudDogJ2NvbXBvbmVudCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBzZW5kXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZW5kKG1lc3NhZ2UsIHR5cGUpIHtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG5cbiAgICAgICAgICAgICAgICAvL2Nhc2UgKHRoaXMudHlwZS5tb2R1bGUpOlxuICAgICAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKGAlYyBNb2R1bGU6ICR7bWVzc2FnZX0gYCwgJ2NvbG9yOiB3aGl0ZTsgYm9yZGVyLXJhZGl1czogM3B4OyBwYWRkaW5nOiAycHggMDsgZm9udC1zaXplOiA5cHg7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICAjZWYzMjMyIDAlLCNkNjNhMmMgMTAwJSknKTtcbiAgICAgICAgICAgICAgICAvLyAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgKHRoaXMudHlwZS5jb21wb25lbnQpOlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWNDb21wb25lbnQ6JWMgJHttZXNzYWdlfWAsICdjb2xvcjogI2Q2M2EyYycsICdjb2xvcjogYmxhY2snKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGxpbmtTZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBhc3NvY2lhdGUoY29tcG9uZW50UGF0aCwgc2hhZG93Um9vdCkge1xuXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmsnKSkuZm9yRWFjaCgobGluaykgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhyZWYubWF0Y2goY29tcG9uZW50UGF0aCkpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheShsaW5rLmltcG9ydC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnRzLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVDb250ZW50ID0gdGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzRG9jdW1lbnRzICAgID0gdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLm1hcCgobGlua0VsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2NvbXBvbmVudFBhdGh9LyR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzRG9jdW1lbnRzLmZvckVhY2goKGNzc0RvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoKGNzc0RvY3VtZW50KS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UudGV4dCgpKS50aGVuKChib2R5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYm9keTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc3R5bGVFbGVtZW50LmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlcztcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KShkb2N1bWVudCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9TbmFrZUNhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2pvaW5lcj0nLSddXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRvU25ha2VDYXNlKGNhbWVsQ2FzZSwgam9pbmVyID0gJy0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FtZWxDYXNlLnNwbGl0KC8oW0EtWl1bYS16XXswLH0pL2cpLmZpbHRlcihwYXJ0cyA9PiBwYXJ0cykuam9pbihqb2luZXIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSA/IEFycmF5LmZyb20oYXJyYXlMaWtlKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldE1vZHVsZVBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TW9kdWxlUGF0aChpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0TW9kdWxlTmFtZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRNb2R1bGVOYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyJdfQ==
