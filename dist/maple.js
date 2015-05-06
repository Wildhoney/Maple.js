(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Module = require('./models/Module.js');

var _Module2 = _interopRequireWildcard(_Module);

var _utility = require('./helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var _events = require('./helpers/Events.js');

var _events2 = _interopRequireWildcard(_events);

(function main($window, $document) {

    'use strict';

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
    }

    /**
     * @constant HAS_INITIATED
     * @type {Boolean}
     */
    var HAS_INITIATED = false;

    /**
     * @method isReady
     * @param {String} state
     * @return {Boolean}
     */
    function isReady(state) {
        return !HAS_INITIATED && (state === 'interactive' || state === 'complete');
    }

    /**
     * @module Maple
     * @link https://github.com/Wildhoney/Maple.js
     * @author Adam Timberlake
     */

    var Maple = (function () {

        /**
         * @constructor
         * @return {void}
         */

        function Maple() {
            _classCallCheck(this, Maple);

            HAS_INITIATED = true;
            this.findComponents();
        }

        _createClass(Maple, [{
            key: 'findComponents',

            /**
             * @method findComponents
             * @return {void}
             */
            value: function findComponents() {

                var linkElements = _utility2['default'].toArray($document.querySelectorAll('link[rel="import"]'));

                linkElements.forEach(function (linkElement) {

                    if (linkElement['import']) {
                        return void new _Module2['default'](linkElement);
                    }

                    linkElement.addEventListener('load', function () {
                        return new _Module2['default'](linkElement);
                    });
                });

                // Configure the event delegation mappings.
                _events2['default'].setupDelegation();
            }
        }]);

        return Maple;
    })();

    // Support for the "async" attribute on the Maple script element.
    if (isReady($document.readyState)) {
        new Maple();
    }

    // No documents, no person.
    $document.addEventListener('DOMContentLoaded', function () {
        return new Maple();
    });
})(window, document);

},{"./helpers/Events.js":2,"./helpers/Utility.js":5,"./models/Module.js":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main($document) {

    'use strict';

    /**
     * @constant REACTID_ATTRIBUTE
     * @type {String}
     */
    var REACTID_ATTRIBUTE = 'data-reactid';

    /**
     * @property components
     * @type {Array}
     */
    var components = [];

    /**
     * @property eventNames
     * @type {Array|null}
     */
    var eventNames = null;

    return {

        /**
         * @method findById
         * @param id {Number}
         * @return {Object}
         */
        findById: function findById(id) {

            var model = undefined;

            /**
             * @method find
             * @param {Object} renderedComponent
             * @param {Object} currentComponent
             * @return {void}
             */
            function find(renderedComponent, currentComponent) {

                if (renderedComponent._rootNodeID === id) {

                    /**
                     * @method bindModel
                     * @return {void}
                     */
                    (function bindModel() {

                        model = {
                            properties: this._currentElement.props,
                            component: currentComponent
                        };
                    }).bind(renderedComponent)();

                    return;
                }

                var children = renderedComponent._renderedComponent._renderedChildren;

                if (children) {
                    Object.keys(children).forEach(function (index) {
                        find(children[index], currentComponent);
                    });
                }
            }

            components.forEach(function (component) {
                find(component._reactInternalInstance._renderedComponent, component);
            });

            return model;
        },

        /**
         * @method transformKeys
         * @param {Object} map
         * @param {String} [transformer='toLowerCase']
         * @return {Object}
         */
        transformKeys: function transformKeys(map) {
            var transformer = arguments[1] === undefined ? 'toLowerCase' : arguments[1];

            var transformedMap = {};

            Object.keys(map).forEach(function forEach(key) {
                transformedMap[key[transformer]()] = map[key];
            });

            return transformedMap;
        },

        /**
         * @method registerComponent
         * @param {Object} component
         * @return {void}
         */
        registerComponent: function registerComponent(component) {
            components.push(component);
        },

        /**
         * @method setupDelegation
         * @return {void}
         */
        setupDelegation: function setupDelegation() {
            var _this = this;

            var events = eventNames || (function () {

                eventNames = Object.keys($document.createElement('a')).filter(function (key) {
                    return key.match(/^on/i);
                }).map(function (name) {
                    return name.replace(/^on/i, '');
                });

                return eventNames;
            })();

            events.forEach(function (eventType) {

                $document.addEventListener(eventType, function (event) {

                    var eventName = 'on' + event.type;

                    event.path.forEach(function (item) {

                        if (!item.getAttribute || !item.hasAttribute(REACTID_ATTRIBUTE)) {
                            return;
                        }

                        var model = _this.findById(item.getAttribute(REACTID_ATTRIBUTE));
                        var transformed = _this.transformKeys(model.properties);

                        if (eventName in transformed) {
                            transformed[eventName].apply(model.component);
                        }
                    });
                });
            });
        }

    };
})(window.document);

// Remove reactid from default prop
// Setup events
// Replace "export default" when eval'ing
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    return {

        /**
         * @method warn
         * @param {String} message
         * @return {void}
         */
        warn: function warn(message) {
            console.log('Maple.js: %c' + message + '.', 'color: #dd4b39');
        },

        /**
         * @method info
         * @param {String} message
         * @return {void}
         */
        info: function info(message) {
            console.log('Maple.js: %c' + message + '.', 'color: blue');
        },

        /**
         * @method error
         * @param {String} message
         * @return {void}
         */
        error: function error(message) {
            console.log('Maple.js: %c' + message + '.', 'color: orange');
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

var _utility = require('./Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

exports['default'] = (function main() {

    'use strict';

    return {

        /**
         * @method getExternalStyles
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getExternalStyles: function getExternalStyles(element) {
            return _utility2['default'].toArray(element.querySelectorAll('link[type="text/css"]'));
        },

        /**
         * @method getInlineStyles
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getInlineStyles: function getInlineStyles(element) {
            return _utility2['default'].toArray(element.querySelectorAll('link[type="text/css"]'));
        },

        /**
         * @method getScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getScripts: function getScripts(element) {

            var jsFiles = element.querySelectorAll('script[type="text/javascript"]');
            var jsxFiles = element.querySelectorAll('script[type="text/jsx"]');

            return [].concat(_utility2['default'].toArray(jsFiles), _utility2['default'].toArray(jsxFiles));
        }

    };
})();

module.exports = exports['default'];

},{"./Utility.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    /**
     * @constant WAIT_TIMEOUT
     * @type {Number}
     */
    var WAIT_TIMEOUT = 30000;

    return {

        /**
         * @method pathResolver
         * @param {HTMLDocument} ownerDocument
         * @param {String} url
         * @return {Object}
         */
        pathResolver: function pathResolver(ownerDocument, url) {

            var componentPath = this.getPath(url),
                getPath = this.getPath.bind(this);

            /**
             * @method resolvePath
             * @param {String} path
             * @param {HTMLDocument} overrideDocument
             * @return {String}
             */
            function resolvePath(path) {
                var overrideDocument = arguments[1] === undefined ? document : arguments[1];

                var a = overrideDocument.createElement('a');
                a.href = path;
                return a.href;
            }

            return {

                /**
                 * @method getPath
                 * @param {String} path
                 * @return {String}
                 */
                getPath: function getPath(path) {

                    if (this.isLocalPath(path)) {
                        return '' + this.getAbsolutePath() + '/' + path;
                    }

                    return resolvePath(path, document);
                },

                /**
                 * @method getAbsolutePath
                 * @return {String}
                 */
                getAbsolutePath: function getAbsolutePath() {
                    return resolvePath(componentPath);
                },

                /**
                 * @method getRelativePath
                 * @return {String}
                 */
                getRelativePath: function getRelativePath() {
                    return componentPath;
                },

                /**
                 * @method isLocalPath
                 * @param path {String}
                 * @return {Boolean}
                 */
                isLocalPath: function isLocalPath(path) {
                    path = getPath(resolvePath(path, ownerDocument));
                    return !! ~resolvePath(componentPath).indexOf(path);
                }

            };
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
         * @method flattenArray
         * @param {Array} arr
         * @param {Array} [givenArr=[]]
         */
        flattenArray: function flattenArray(arr) {
            var _this = this;

            var givenArr = arguments[1] === undefined ? [] : arguments[1];

            /* jshint ignore:start */

            arr.forEach(function (item) {
                Array.isArray(item) && _this.flattenArray(item, givenArr);
                !Array.isArray(item) && givenArr.push(item);
            });

            /* jshint ignore:end */

            return givenArr;
        },

        /**
         * @method timeoutPromise
         * @param {Function} reject
         * @param {String} errorMessage
         * @param {Number} [timeout=WAIT_TIMEOUT]
         * @return {void}
         */
        timeoutPromise: function timeoutPromise(reject) {
            var errorMessage = arguments[1] === undefined ? 'Timeout' : arguments[1];
            var timeout = arguments[2] === undefined ? WAIT_TIMEOUT : arguments[2];

            setTimeout(function () {
                return reject(new Error(errorMessage));
            }, timeout);
        },

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
         * @method getName
         * @param {String} importPath
         * @return {String}
         */
        getName: function getName(importPath) {
            return importPath.split('/').slice(0, -1).pop();
        },

        /**
         * @method getPath
         * @param {String} importPath
         * @return {String}
         */
        getPath: function getPath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        },

        /**
         * @method removeExtension
         * @param {String} filePath
         * @return {String}
         */
        removeExtension: function removeExtension(filePath) {
            return filePath.split('.').slice(0, -1).join('.');
        }

    };
})();

module.exports = exports['default'];

},{}],6:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
var State = { UNRESOLVED: 0, RESOLVING: 1, RESOLVED: 2 };

exports.State = State;

var Abstract = (function () {

    /**
     * @constructor
     * @return {Abstract}
     */

    function Abstract() {
        _classCallCheck(this, Abstract);

        this.state = State.UNRESOLVED;
    }

    _createClass(Abstract, [{
        key: "setState",

        /**
         * @method setState
         * @param {Number} state
         * @return {void}
         */
        value: function setState(state) {
            this.state = state;
        }
    }]);

    return Abstract;
})();

exports.Abstract = Abstract;

},{}],7:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _Element = require('./Element.js');

var _Element2 = _interopRequireWildcard(_Element);

var _Abstract$State = require('./Abstract.js');

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var _logger = require('./../helpers/Logger.js');

var _logger2 = _interopRequireWildcard(_logger);

var Component = (function (_Abstract) {

    /**
     * @constructor
     * @param {String} path
     * @param {HTMLTemplateElement} templateElement
     * @param {HTMLScriptElement} scriptElement
     * @return {Module}
     */

    function Component(path, templateElement, scriptElement) {
        var _this = this;

        _classCallCheck(this, Component);

        _get(Object.getPrototypeOf(Component.prototype), 'constructor', this).call(this);
        this.path = path;
        this.elements = { script: scriptElement, template: templateElement };

        var src = scriptElement.getAttribute('src');
        this.setState(_Abstract$State.State.RESOLVING);

        if (scriptElement.getAttribute('type') === 'text/jsx') {
            return void this.loadJSX(src);
        }

        var url = '' + this.path.getRelativePath() + '/' + _utility2['default'].removeExtension(src);

        System['import'](url).then(function (imports) {

            if (!imports['default']) {
                return;
            }

            // Load all third-party scripts that are a prerequisite of resolving the custom element.
            Promise.all(_this.loadThirdPartyScripts()).then(function () {
                new _Element2['default'](path, templateElement, scriptElement, imports['default']);
                _this.setState(_Abstract$State.State.RESOLVED);
            });
        });
    }

    _inherits(Component, _Abstract);

    _createClass(Component, [{
        key: 'loadThirdPartyScripts',

        /**
         * @method loadThirdPartyScripts
         * @return {Promise[]}
         */
        value: function loadThirdPartyScripts() {
            var _this2 = this;

            var scriptElements = _utility2['default'].toArray(this.elements.template.content.querySelectorAll('script[type="text/javascript"]')),
                thirdPartyScripts = scriptElements.filter(function (scriptElement) {
                return !_this2.path.isLocalPath(scriptElement.getAttribute('src'));
            });

            return thirdPartyScripts.map(function (scriptElement) {

                return new Promise(function (resolve) {
                    scriptElement.addEventListener('load', function () {
                        return resolve();
                    });
                    document.head.appendChild(scriptElement);
                });
            });
        }
    }, {
        key: 'loadJSX',

        /**
         * @method loadJSX
         * @param {String} src
         * @return {void}
         */
        value: function loadJSX(src) {
            var _this3 = this;

            _logger2['default'].warn('Using JSXTransformer which is highly experimental and should not be used for production');

            fetch('' + this.path.getRelativePath() + '/' + src).then(function (response) {
                return response.text();
            }).then(function (body) {

                /* jslint evil: true */
                var transformed = eval('"use strict"; ' + JSXTransformer.transform(body).code);

                Promise.all(_this3.loadThirdPartyScripts()).then(function () {
                    new _Element2['default'](_this3.path, _this3.elements.template, _this3.elements.script, transformed);
                    _this3.setState(_Abstract$State.State.RESOLVED);
                });
            });
        }
    }]);

    return Component;
})(_Abstract$State.Abstract);

exports['default'] = Component;
module.exports = exports['default'];

},{"./../helpers/Logger.js":3,"./../helpers/Utility.js":5,"./Abstract.js":6,"./Element.js":8}],8:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _Abstract$State = require('./Abstract.js');

var _events = require('./../helpers/Events.js');

var _events2 = _interopRequireWildcard(_events);

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var _selectors = require('./../helpers/Selectors.js');

var _selectors2 = _interopRequireWildcard(_selectors);

var Element = (function (_Abstract) {

    /**
     * @constructor
     * @param {String} path
     * @param {HTMLScriptElement} scriptElement
     * @param {HTMLTemplateElement} templateElement
     * @param {String} importScript
     * @return {Element}
     */

    function Element(path, templateElement, scriptElement, importScript) {
        _classCallCheck(this, Element);

        _get(Object.getPrototypeOf(Element.prototype), 'constructor', this).call(this);
        this.path = path;
        this.elements = { script: scriptElement, template: templateElement };
        this.script = importScript;

        document.registerElement(this.getElementName(), {
            prototype: this.getElementPrototype()
        });
    }

    _inherits(Element, _Abstract);

    _createClass(Element, [{
        key: 'loadStyles',

        /**
         * @method loadStyles
         * @param {ShadowRoot} shadowBoundary
         * @return {Promise[]}
         */
        value: function loadStyles(shadowBoundary) {
            var _this = this;

            /**
             * @method createStyle
             * @param {String} body
             * @param {ShadowRoot|HTMLDocument} element
             * @return {void}
             */
            function createStyle(body) {
                var element = arguments[1] === undefined ? shadowBoundary : arguments[1];

                var styleElement = document.createElement('style');
                styleElement.setAttribute('type', 'text/css');
                styleElement.innerHTML = body;
                element.appendChild(styleElement);
            }

            this.setState(_Abstract$State.State.RESOLVING);

            var content = this.elements.template.content;
            var linkElements = _selectors2['default'].getExternalStyles(content);
            var styleElements = _selectors2['default'].getInlineStyles(content);
            var promises = [].concat(linkElements, styleElements).map(function (element) {
                return new Promise(function (resolve) {

                    if (element.nodeName.toLowerCase() === 'style') {
                        createStyle(element.innerHTML, shadowBoundary);
                        resolve();
                        return;
                    }

                    fetch(_this.path.getPath(element.getAttribute('href'))).then(function (response) {
                        return response.text();
                    }).then(function (body) {
                        createStyle(body, shadowBoundary);
                        resolve();
                    });
                });
            });

            Promise.all(promises).then(function () {
                return _this.setState(_Abstract$State.State.RESOLVED);
            });
            return promises;
        }
    }, {
        key: 'getElementName',

        /**
         * @method getElementName
         * @return {String}
         */
        value: function getElementName() {
            return _utility2['default'].toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
        }
    }, {
        key: 'getElementPrototype',

        /**
         * @method getElementPrototype
         * @return {Object}
         */
        value: function getElementPrototype() {

            var loadStyles = this.loadStyles.bind(this),
                script = this.script,
                path = this.path;

            return Object.create(HTMLElement.prototype, {

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

                        /**
                         * @method applyDefaultProps
                         * @param {Object} attributes
                         * @return {void}
                         */
                        function applyDefaultProps(attributes) {

                            for (var index = 0; index < attributes.length; index++) {

                                var attribute = attributes.item(index);

                                if (attribute.value) {
                                    var _name = attribute.name.replace(/^data-/i, '');
                                    script.defaultProps[_name] = attribute.value;
                                }
                            }
                        }

                        // Apply properties to the custom element.
                        script.defaultProps = { path: path, element: this.cloneNode(true) };
                        applyDefaultProps.call(this, this.attributes);
                        this.innerHTML = '';

                        // Configure the React.js component, importing it under the shadow boundary.
                        var renderedElement = React.createElement(script),
                            contentElement = document.createElement('content'),
                            shadowRoot = this.createShadowRoot();

                        shadowRoot.appendChild(contentElement);
                        var component = React.render(renderedElement, contentElement);

                        // Configure the event delegation for the component.
                        _events2['default'].registerComponent(component);

                        /**
                         * Import external CSS documents and resolve element.
                         *
                         * @method resolveElement
                         * @return {void}
                         */
                        function resolveElement() {
                            var _this2 = this;

                            Promise.all(loadStyles(shadowRoot)).then(function () {
                                _this2.removeAttribute('unresolved');
                                _this2.setAttribute('resolved', '');
                            });
                        }

                        resolveElement.apply(this);
                    }

                }

            });
        }
    }]);

    return Element;
})(_Abstract$State.Abstract);

exports['default'] = Element;
module.exports = exports['default'];

},{"./../helpers/Events.js":2,"./../helpers/Selectors.js":4,"./../helpers/Utility.js":5,"./Abstract.js":6}],9:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _Component = require('./Component.js');

var _Component2 = _interopRequireWildcard(_Component);

var _Abstract$State = require('./Abstract.js');

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var _selectors = require('./../helpers/Selectors.js');

var _selectors2 = _interopRequireWildcard(_selectors);

var Module = (function (_Abstract) {

    /**
     * @constructor
     * @param {HTMLTemplateElement} templateElement
     * @return {Component}
     */

    function Module(templateElement) {
        var _this = this;

        _classCallCheck(this, Module);

        _get(Object.getPrototypeOf(Module.prototype), 'constructor', this).call(this);
        this.path = _utility2['default'].pathResolver(templateElement['import'], templateElement.getAttribute('href'));
        this.state = _Abstract$State.State.UNRESOLVED;
        this.elements = { template: templateElement };
        this.components = [];

        this.loadModule(templateElement).then(function () {

            _this.getTemplates().forEach(function (templateElement) {

                var scriptElements = _selectors2['default'].getScripts(templateElement.content);

                scriptElements.map(function (scriptElement) {

                    var src = scriptElement.getAttribute('src');

                    if (!_this.path.isLocalPath(src)) {
                        return;
                    }

                    var component = new _Component2['default'](_this.path, templateElement, scriptElement);
                    _this.components.push(component);
                });
            });

            _this.setState(_Abstract$State.State.RESOLVED);
        });
    }

    _inherits(Module, _Abstract);

    _createClass(Module, [{
        key: 'setState',

        /**
         * @method setState
         * @param {Number} state
         * @return {void}
         */
        value: function setState(state) {
            this.state = state;
        }
    }, {
        key: 'loadModule',

        /**
         * @method loadModule
         * @param {HTMLTemplateElement} templateElement
         * @return {Promise}
         */
        value: function loadModule(templateElement) {

            this.setState(_Abstract$State.State.RESOLVING);

            return new Promise(function (resolve) {

                if (templateElement['import']) {
                    return void resolve(templateElement);
                }

                templateElement.addEventListener('load', function () {
                    resolve(templateElement);
                });
            });
        }
    }, {
        key: 'getTemplates',

        /**
         * @method getTemplates
         * @return {Array}
         */
        value: function getTemplates() {

            var ownerDocument = this.elements.template['import'];
            return _utility2['default'].toArray(ownerDocument.querySelectorAll('template'));
        }
    }]);

    return Module;
})(_Abstract$State.Abstract);

exports['default'] = Module;
module.exports = exports['default'];

},{"./../helpers/Selectors.js":4,"./../helpers/Utility.js":5,"./Abstract.js":6,"./Component.js":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2dnZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TZWxlY3RvcnMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9BYnN0cmFjdC5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9tb2RlbHMvQ29tcG9uZW50LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9FbGVtZW50LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Nb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztzQkNBb0Isb0JBQW9COzs7O3VCQUNwQixzQkFBc0I7Ozs7c0JBQ3RCLHFCQUFxQjs7OztBQUV6QyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7OztBQU1ELFFBQUksYUFBYSxHQUFHLEtBQUssQ0FBQzs7Ozs7OztBQU8x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QWUsQ0FBQyxDQUFDO2lCQUN4Qzs7QUFFRCwrQkFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQzNDLDJCQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzVCLENBQUMsQ0FBQzthQUVOLENBQUMsQ0FBQztTQUVOOzs7Ozs7OztlQU1XLHdCQUFHOztBQUVYLGdCQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsVUFBTyxDQUFDO0FBQ2xELG1CQUFPLHFCQUFRLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUV0RTs7O1dBbkZnQixNQUFNO21CQUpuQixRQUFROztxQkFJSyxNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2R1bGUgIGZyb20gJy4vbW9kZWxzL01vZHVsZS5qcyc7XG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgZXZlbnRzICBmcm9tICcuL2hlbHBlcnMvRXZlbnRzLmpzJztcblxuKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmICh0eXBlb2YgU3lzdGVtICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBTeXN0ZW0udHJhbnNwaWxlciA9ICdiYWJlbCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IEhBU19JTklUSUFURURcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBsZXQgSEFTX0lOSVRJQVRFRCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBpc1JlYWR5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1JlYWR5KHN0YXRlKSB7XG4gICAgICAgIHJldHVybiAoIUhBU19JTklUSUFURUQgJiYgKHN0YXRlID09PSAnaW50ZXJhY3RpdmUnIHx8IHN0YXRlID09PSAnY29tcGxldGUnKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIEhBU19JTklUSUFURUQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5maW5kQ29tcG9uZW50cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmluZENvbXBvbmVudHNcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRDb21wb25lbnRzKCkge1xuXG4gICAgICAgICAgICB2YXIgbGlua0VsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KCRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cImltcG9ydFwiXScpKTtcblxuICAgICAgICAgICAgbGlua0VsZW1lbnRzLmZvckVhY2goKGxpbmtFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAobGlua0VsZW1lbnQuaW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIG5ldyBNb2R1bGUobGlua0VsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBuZXcgTW9kdWxlKGxpbmtFbGVtZW50KSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDb25maWd1cmUgdGhlIGV2ZW50IGRlbGVnYXRpb24gbWFwcGluZ3MuXG4gICAgICAgICAgICBldmVudHMuc2V0dXBEZWxlZ2F0aW9uKCk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBmb3IgdGhlIFwiYXN5bmNcIiBhdHRyaWJ1dGUgb24gdGhlIE1hcGxlIHNjcmlwdCBlbGVtZW50LlxuICAgIGlmIChpc1JlYWR5KCRkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICBuZXcgTWFwbGUoKTtcbiAgICB9XG5cbiAgICAvLyBObyBkb2N1bWVudHMsIG5vIHBlcnNvbi5cbiAgICAkZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IG5ldyBNYXBsZSgpKTtcblxufSkod2luZG93LCBkb2N1bWVudCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdGFudCBSRUFDVElEX0FUVFJJQlVURVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgY29uc3QgUkVBQ1RJRF9BVFRSSUJVVEUgPSAnZGF0YS1yZWFjdGlkJztcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBjb21wb25lbnRzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIGxldCBjb21wb25lbnRzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZXZlbnROYW1lc1xuICAgICAqIEB0eXBlIHtBcnJheXxudWxsfVxuICAgICAqL1xuICAgIGxldCBldmVudE5hbWVzID0gbnVsbDtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmluZEJ5SWRcbiAgICAgICAgICogQHBhcmFtIGlkIHtOdW1iZXJ9XG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRCeUlkKGlkKSB7XG5cbiAgICAgICAgICAgIGxldCBtb2RlbDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGZpbmRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlZENvbXBvbmVudFxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRDb21wb25lbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmQocmVuZGVyZWRDb21wb25lbnQsIGN1cnJlbnRDb21wb25lbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZENvbXBvbmVudC5fcm9vdE5vZGVJRCA9PT0gaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBiaW5kTW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiBiaW5kTW9kZWwoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHRoaXMuX2N1cnJlbnRFbGVtZW50LnByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogY3VycmVudENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQocmVuZGVyZWRDb21wb25lbnQpKSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHJlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDaGlsZHJlbjtcblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmQoY2hpbGRyZW5baW5kZXhdLCBjdXJyZW50Q29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZmluZChjb21wb25lbnQuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG1vZGVsO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdHJhbnNmb3JtS2V5c1xuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbWFwXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhbnNmb3JtZXI9J3RvTG93ZXJDYXNlJ11cbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdHJhbnNmb3JtS2V5cyhtYXAsIHRyYW5zZm9ybWVyID0gJ3RvTG93ZXJDYXNlJykge1xuXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRNYXAgPSB7fTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMobWFwKS5mb3JFYWNoKGZ1bmN0aW9uIGZvckVhY2goa2V5KSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtZWRNYXBba2V5W3RyYW5zZm9ybWVyXSgpXSA9IG1hcFtrZXldO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZE1hcDtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyQ29tcG9uZW50XG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2Qgc2V0dXBEZWxlZ2F0aW9uXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZXR1cERlbGVnYXRpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBldmVudHMgPSBldmVudE5hbWVzIHx8ICgoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBldmVudE5hbWVzID0gT2JqZWN0LmtleXMoJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkuZmlsdGVyKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleS5tYXRjaCgvXm9uL2kpO1xuICAgICAgICAgICAgICAgIH0pLm1hcCgobmFtZSkgPT4gbmFtZS5yZXBsYWNlKC9eb24vaSwgJycpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBldmVudE5hbWVzO1xuXG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRUeXBlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAkZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIChldmVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBgb24ke2V2ZW50LnR5cGV9YDtcblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wYXRoLmZvckVhY2goKGl0ZW0pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmdldEF0dHJpYnV0ZSB8fCAhaXRlbS5oYXNBdHRyaWJ1dGUoUkVBQ1RJRF9BVFRSSUJVVEUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW9kZWwgICAgICAgPSB0aGlzLmZpbmRCeUlkKGl0ZW0uZ2V0QXR0cmlidXRlKFJFQUNUSURfQVRUUklCVVRFKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWQgPSB0aGlzLnRyYW5zZm9ybUtleXMobW9kZWwucHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUgaW4gdHJhbnNmb3JtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZFtldmVudE5hbWVdLmFwcGx5KG1vZGVsLmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkod2luZG93LmRvY3VtZW50KTtcblxuXG4vLyBSZW1vdmUgcmVhY3RpZCBmcm9tIGRlZmF1bHQgcHJvcFxuLy8gU2V0dXAgZXZlbnRzXG4vLyBSZXBsYWNlIFwiZXhwb3J0IGRlZmF1bHRcIiB3aGVuIGV2YWwnaW5nIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2Qgd2FyblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybihtZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6ICNkZDRiMzknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBpbmZvXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBpbmZvKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBNYXBsZS5qczogJWMke21lc3NhZ2V9LmAsICdjb2xvcjogYmx1ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGVycm9yXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBlcnJvcihtZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6IG9yYW5nZScpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vVXRpbGl0eS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldEV4dGVybmFsU3R5bGVzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RXh0ZXJuYWxTdHlsZXMoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldElubGluZVN0eWxlc1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldElubGluZVN0eWxlcyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0U2NyaXB0c1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFNjcmlwdHMoZWxlbWVudCkge1xuXG4gICAgICAgICAgICBsZXQganNGaWxlcyAgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCJdJyk7XG4gICAgICAgICAgICBsZXQganN4RmlsZXMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9qc3hcIl0nKTtcblxuICAgICAgICAgICAgcmV0dXJuIFtdLmNvbmNhdCh1dGlsaXR5LnRvQXJyYXkoanNGaWxlcyksIHV0aWxpdHkudG9BcnJheShqc3hGaWxlcykpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdGFudCBXQUlUX1RJTUVPVVRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIGNvbnN0IFdBSVRfVElNRU9VVCA9IDMwMDAwO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBwYXRoUmVzb2x2ZXJcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IG93bmVyRG9jdW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBwYXRoUmVzb2x2ZXIob3duZXJEb2N1bWVudCwgdXJsKSB7XG5cbiAgICAgICAgICAgIGxldCBjb21wb25lbnRQYXRoID0gdGhpcy5nZXRQYXRoKHVybCksXG4gICAgICAgICAgICAgICAgZ2V0UGF0aCAgICAgICA9IHRoaXMuZ2V0UGF0aC5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgcmVzb2x2ZVBhdGhcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0hUTUxEb2N1bWVudH0gb3ZlcnJpZGVEb2N1bWVudFxuICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiByZXNvbHZlUGF0aChwYXRoLCBvdmVycmlkZURvY3VtZW50ID0gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSAgPSBvdmVycmlkZURvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSBwYXRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmhyZWY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldFBhdGhcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRQYXRoKHBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xvY2FsUGF0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuZ2V0QWJzb2x1dGVQYXRoKCl9LyR7cGF0aH1gO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQYXRoKHBhdGgsIGRvY3VtZW50KTtcblxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldEFic29sdXRlUGF0aFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRBYnNvbHV0ZVBhdGgoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChjb21wb25lbnRQYXRoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRSZWxhdGl2ZVBhdGhcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0UmVsYXRpdmVQYXRoKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50UGF0aDtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBpc0xvY2FsUGF0aFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBwYXRoIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpc0xvY2FsUGF0aChwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBnZXRQYXRoKHJlc29sdmVQYXRoKHBhdGgsIG93bmVyRG9jdW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhfnJlc29sdmVQYXRoKGNvbXBvbmVudFBhdGgpLmluZGV4T2YocGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tID8gQXJyYXkuZnJvbShhcnJheUxpa2UpIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmxhdHRlbkFycmF5XG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBbZ2l2ZW5BcnI9W11dXG4gICAgICAgICAqL1xuICAgICAgICBmbGF0dGVuQXJyYXkoYXJyLCBnaXZlbkFyciA9IFtdKSB7XG5cbiAgICAgICAgICAgIC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblxuICAgICAgICAgICAgYXJyLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheShpdGVtKSkgJiYgKHRoaXMuZmxhdHRlbkFycmF5KGl0ZW0sIGdpdmVuQXJyKSk7XG4gICAgICAgICAgICAgICAgKCFBcnJheS5pc0FycmF5KGl0ZW0pKSAmJiAoZ2l2ZW5BcnIucHVzaChpdGVtKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cblxuICAgICAgICAgICAgcmV0dXJuIGdpdmVuQXJyO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdGltZW91dFByb21pc2VcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lb3V0PVdBSVRfVElNRU9VVF1cbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHRpbWVvdXRQcm9taXNlKHJlamVjdCwgZXJyb3JNZXNzYWdlID0gJ1RpbWVvdXQnLCB0aW1lb3V0ID0gV0FJVF9USU1FT1VUKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlamVjdChuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSksIHRpbWVvdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvU25ha2VDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYW1lbENhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtqb2luZXI9Jy0nXVxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0b1NuYWtlQ2FzZShjYW1lbENhc2UsIGpvaW5lciA9ICctJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbWVsQ2FzZS5zcGxpdCgvKFtBLVpdW2Etel17MCx9KS9nKS5maWx0ZXIocGFydHMgPT4gcGFydHMpLmpvaW4oam9pbmVyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldE5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TmFtZShpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5wb3AoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldFBhdGgoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlbW92ZUV4dGVuc2lvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRXh0ZW5zaW9uKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZVBhdGguc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImV4cG9ydCBjb25zdCBTdGF0ZSA9IHsgVU5SRVNPTFZFRDogMCwgUkVTT0xWSU5HOiAxLCBSRVNPTFZFRDogMiB9O1xuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3Qge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHJldHVybiB7QWJzdHJhY3R9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5VTlJFU09MVkVEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgc2V0U3RhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdGVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgRWxlbWVudCAgICAgICAgICAgZnJvbSAnLi9FbGVtZW50LmpzJztcbmltcG9ydCB7QWJzdHJhY3QsIFN0YXRlfSBmcm9tICcuL0Fic3RyYWN0LmpzJztcbmltcG9ydCB1dGlsaXR5ICAgICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgbG9nZ2VyICAgICAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0xvZ2dlci5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIEFic3RyYWN0IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxTY3JpcHRFbGVtZW50fSBzY3JpcHRFbGVtZW50XG4gICAgICogQHJldHVybiB7TW9kdWxlfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGF0aCAgICAgPSBwYXRoO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0geyBzY3JpcHQ6IHNjcmlwdEVsZW1lbnQsIHRlbXBsYXRlOiB0ZW1wbGF0ZUVsZW1lbnQgfTtcblxuICAgICAgICBsZXQgc3JjID0gc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVklORyk7XG5cbiAgICAgICAgaWYgKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd0ZXh0L2pzeCcpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIHRoaXMubG9hZEpTWChzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMucGF0aC5nZXRSZWxhdGl2ZVBhdGgoKX0vJHt1dGlsaXR5LnJlbW92ZUV4dGVuc2lvbihzcmMpfWA7XG5cbiAgICAgICAgU3lzdGVtLmltcG9ydCh1cmwpLnRoZW4oKGltcG9ydHMpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFpbXBvcnRzLmRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExvYWQgYWxsIHRoaXJkLXBhcnR5IHNjcmlwdHMgdGhhdCBhcmUgYSBwcmVyZXF1aXNpdGUgb2YgcmVzb2x2aW5nIHRoZSBjdXN0b20gZWxlbWVudC5cbiAgICAgICAgICAgIFByb21pc2UuYWxsKHRoaXMubG9hZFRoaXJkUGFydHlTY3JpcHRzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBFbGVtZW50KHBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCwgaW1wb3J0cy5kZWZhdWx0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVkVEKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2FkVGhpcmRQYXJ0eVNjcmlwdHNcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFRoaXJkUGFydHlTY3JpcHRzKCkge1xuXG4gICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyAgICA9IHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnRzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSksXG4gICAgICAgICAgICB0aGlyZFBhcnR5U2NyaXB0cyA9IHNjcmlwdEVsZW1lbnRzLmZpbHRlcigoc2NyaXB0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5wYXRoLmlzTG9jYWxQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcmRQYXJ0eVNjcmlwdHMubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2FkSlNYXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNyY1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9hZEpTWChzcmMpIHtcblxuICAgICAgICBsb2dnZXIud2FybignVXNpbmcgSlNYVHJhbnNmb3JtZXIgd2hpY2ggaXMgaGlnaGx5IGV4cGVyaW1lbnRhbCBhbmQgc2hvdWxkIG5vdCBiZSB1c2VkIGZvciBwcm9kdWN0aW9uJyk7XG5cbiAgICAgICAgZmV0Y2goYCR7dGhpcy5wYXRoLmdldFJlbGF0aXZlUGF0aCgpfS8ke3NyY31gKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfSkudGhlbigoYm9keSkgPT4ge1xuXG4gICAgICAgICAgICAvKiBqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgdmFyIHRyYW5zZm9ybWVkID0gZXZhbChgXCJ1c2Ugc3RyaWN0XCI7ICR7SlNYVHJhbnNmb3JtZXIudHJhbnNmb3JtKGJvZHkpLmNvZGV9YCk7XG5cbiAgICAgICAgICAgIFByb21pc2UuYWxsKHRoaXMubG9hZFRoaXJkUGFydHlTY3JpcHRzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBFbGVtZW50KHRoaXMucGF0aCwgdGhpcy5lbGVtZW50cy50ZW1wbGF0ZSwgdGhpcy5lbGVtZW50cy5zY3JpcHQsIHRyYW5zZm9ybWVkKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVkVEKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiaW1wb3J0IHtBYnN0cmFjdCwgU3RhdGV9IGZyb20gJy4vQWJzdHJhY3QuanMnO1xuaW1wb3J0IGV2ZW50cyAgICAgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9FdmVudHMuanMnO1xuaW1wb3J0IHV0aWxpdHkgICAgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBzZWxlY3RvcnMgICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvU2VsZWN0b3JzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEFic3RyYWN0IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0RWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFNjcmlwdFxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50LCBpbXBvcnRTY3JpcHQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgID0gcGF0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IHsgc2NyaXB0OiBzY3JpcHRFbGVtZW50LCB0ZW1wbGF0ZTogdGVtcGxhdGVFbGVtZW50IH07XG4gICAgICAgIHRoaXMuc2NyaXB0ICAgPSBpbXBvcnRTY3JpcHQ7XG5cbiAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRoaXMuZ2V0RWxlbWVudE5hbWUoKSwge1xuICAgICAgICAgICAgcHJvdG90eXBlOiB0aGlzLmdldEVsZW1lbnRQcm90b3R5cGUoKVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZFN0eWxlc1xuICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Qm91bmRhcnlcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFN0eWxlcyhzaGFkb3dCb3VuZGFyeSkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZVN0eWxlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBib2R5XG4gICAgICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVN0eWxlKGJvZHksIGVsZW1lbnQgPSBzaGFkb3dCb3VuZGFyeSkge1xuICAgICAgICAgICAgbGV0IHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYm9keTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVTT0xWSU5HKTtcblxuICAgICAgICBsZXQgY29udGVudCAgICAgICA9IHRoaXMuZWxlbWVudHMudGVtcGxhdGUuY29udGVudDtcbiAgICAgICAgbGV0IGxpbmtFbGVtZW50cyAgPSBzZWxlY3RvcnMuZ2V0RXh0ZXJuYWxTdHlsZXMoY29udGVudCk7XG4gICAgICAgIGxldCBzdHlsZUVsZW1lbnRzID0gc2VsZWN0b3JzLmdldElubGluZVN0eWxlcyhjb250ZW50KTtcbiAgICAgICAgbGV0IHByb21pc2VzICAgICAgPSBbXS5jb25jYXQobGlua0VsZW1lbnRzLCBzdHlsZUVsZW1lbnRzKS5tYXAoKGVsZW1lbnQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVTdHlsZShlbGVtZW50LmlubmVySFRNTCwgc2hhZG93Qm91bmRhcnkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZldGNoKHRoaXMucGF0aC5nZXRQYXRoKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UudGV4dCgpKS50aGVuKChib2R5KSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlU3R5bGUoYm9keSwgc2hhZG93Qm91bmRhcnkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVkVEKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZ2V0RWxlbWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RWxlbWVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvU25ha2VDYXNlKHRoaXMuc2NyaXB0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRFbGVtZW50UHJvdG90eXBlXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRQcm90b3R5cGUoKSB7XG5cbiAgICAgICAgbGV0IGxvYWRTdHlsZXMgPSB0aGlzLmxvYWRTdHlsZXMuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHNjcmlwdCAgICA9IHRoaXMuc2NyaXB0LFxuICAgICAgICAgICAgcGF0aCAgICAgID0gdGhpcy5wYXRoO1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgYXBwbHlEZWZhdWx0UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFwcGx5RGVmYXVsdFByb3BzKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKC9eZGF0YS0vaSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBwcm9wZXJ0aWVzIHRvIHRoZSBjdXN0b20gZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmRlZmF1bHRQcm9wcyA9IHsgcGF0aDogcGF0aCwgZWxlbWVudDogdGhpcy5jbG9uZU5vZGUodHJ1ZSkgfTtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlEZWZhdWx0UHJvcHMuY2FsbCh0aGlzLCB0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCAgICAgID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBSZWFjdC5qcyBjb21wb25lbnQsIGltcG9ydGluZyBpdCB1bmRlciB0aGUgc2hhZG93IGJvdW5kYXJ5LlxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIocmVuZGVyZWRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBldmVudCBkZWxlZ2F0aW9uIGZvciB0aGUgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgICAgICBldmVudHMucmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSW1wb3J0IGV4dGVybmFsIENTUyBkb2N1bWVudHMgYW5kIHJlc29sdmUgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCByZXNvbHZlRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZUVsZW1lbnQoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGxvYWRTdHlsZXMoc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVFbGVtZW50LmFwcGx5KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29tcG9uZW50ICAgICAgICAgZnJvbSAnLi9Db21wb25lbnQuanMnO1xuaW1wb3J0IHtBYnN0cmFjdCwgU3RhdGV9IGZyb20gJy4vQWJzdHJhY3QuanMnO1xuaW1wb3J0IHV0aWxpdHkgICAgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBzZWxlY3RvcnMgICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvU2VsZWN0b3JzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kdWxlIGV4dGVuZHMgQWJzdHJhY3Qge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IodGVtcGxhdGVFbGVtZW50KSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXRoICAgICAgID0gdXRpbGl0eS5wYXRoUmVzb2x2ZXIodGVtcGxhdGVFbGVtZW50LmltcG9ydCwgdGVtcGxhdGVFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgdGhpcy5zdGF0ZSAgICAgID0gU3RhdGUuVU5SRVNPTFZFRDtcbiAgICAgICAgdGhpcy5lbGVtZW50cyAgID0geyB0ZW1wbGF0ZTogdGVtcGxhdGVFbGVtZW50IH07XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIHRoaXMubG9hZE1vZHVsZSh0ZW1wbGF0ZUVsZW1lbnQpLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmdldFRlbXBsYXRlcygpLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gc2VsZWN0b3JzLmdldFNjcmlwdHModGVtcGxhdGVFbGVtZW50LmNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudHMubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNyYyA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGF0aC5pc0xvY2FsUGF0aChzcmMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudCh0aGlzLnBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVTT0xWRUQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBzZXRTdGF0ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0ZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZE1vZHVsZVxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBsb2FkTW9kdWxlKHRlbXBsYXRlRWxlbWVudCkge1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVTT0xWSU5HKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlRWxlbWVudC5pbXBvcnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCByZXNvbHZlKHRlbXBsYXRlRWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGVtcGxhdGVFbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFRlbXBsYXRlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlcygpIHtcblxuICAgICAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMuZWxlbWVudHMudGVtcGxhdGUuaW1wb3J0O1xuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKSk7XG5cbiAgICB9XG5cbn0iXX0=
