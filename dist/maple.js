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

                return eventNames = Object.keys($document.createElement('a')).filter(function (key) {
                    return key.match(/^on/i);
                }).map(function (name) {
                    return name.replace(/^on/i, '');
                });
            })();

            events = ['click'];

            $document.addEventListener('click', function (event) {

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
        }

    };
})(window.document);

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
                        var _this2 = this;

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

                        // Import external CSS documents.
                        Promise.all(loadStyles(shadowRoot)).then(function () {
                            _this2.removeAttribute('unresolved');
                            _this2.setAttribute('resolved', '');
                        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2dnZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TZWxlY3RvcnMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9BYnN0cmFjdC5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9tb2RlbHMvQ29tcG9uZW50LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9FbGVtZW50LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Nb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztzQkNBb0Isb0JBQW9COzs7O3VCQUNwQixzQkFBc0I7Ozs7c0JBQ3RCLHFCQUFxQjs7OztBQUV6QyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7OztBQU1ELFFBQUksYUFBYSxHQUFHLEtBQUssQ0FBQzs7Ozs7OztBQU8x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QUFDLENBQUM7U0FFTjs7Ozs7Ozs7ZUFNVyx3QkFBRzs7QUFFWCxnQkFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLFVBQU8sQ0FBQztBQUNsRCxtQkFBTyxxQkFBUSxPQUFPLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FFdEU7OztXQW5GZ0IsTUFBTTttQkFKbkIsUUFBUTs7cUJBSUssTUFBTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTW9kdWxlICBmcm9tICcuL21vZGVscy9Nb2R1bGUuanMnO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGV2ZW50cyAgZnJvbSAnLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgPSAnYmFiZWwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjb25zdGFudCBIQVNfSU5JVElBVEVEXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgbGV0IEhBU19JTklUSUFURUQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaXNSZWFkeVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNSZWFkeShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gKCFIQVNfSU5JVElBVEVEICYmIChzdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJyB8fCBzdGF0ZSA9PT0gJ2NvbXBsZXRlJykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBIQVNfSU5JVElBVEVEID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZmluZENvbXBvbmVudHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRDb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQ29tcG9uZW50cygpIHtcblxuICAgICAgICAgICAgdmFyIGxpbmtFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheSgkZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJpbXBvcnRcIl0nKSk7XG5cbiAgICAgICAgICAgIGxpbmtFbGVtZW50cy5mb3JFYWNoKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtFbGVtZW50LmltcG9ydCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBuZXcgTW9kdWxlKGxpbmtFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gbmV3IE1vZHVsZShsaW5rRWxlbWVudCkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBldmVudCBkZWxlZ2F0aW9uIG1hcHBpbmdzLlxuICAgICAgICAgICAgZXZlbnRzLnNldHVwRGVsZWdhdGlvbigpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZm9yIHRoZSBcImFzeW5jXCIgYXR0cmlidXRlIG9uIHRoZSBNYXBsZSBzY3JpcHQgZWxlbWVudC5cbiAgICBpZiAoaXNSZWFkeSgkZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgbmV3IE1hcGxlKCk7XG4gICAgfVxuXG4gICAgLy8gTm8gZG9jdW1lbnRzLCBubyBwZXJzb24uXG4gICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiBuZXcgTWFwbGUoKSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RhbnQgUkVBQ1RJRF9BVFRSSUJVVEVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIGNvbnN0IFJFQUNUSURfQVRUUklCVVRFID0gJ2RhdGEtcmVhY3RpZCc7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50c1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBsZXQgY29tcG9uZW50cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGV2ZW50TmFtZXNcbiAgICAgKiBAdHlwZSB7QXJyYXl8bnVsbH1cbiAgICAgKi9cbiAgICBsZXQgZXZlbnROYW1lcyA9IG51bGw7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRCeUlkXG4gICAgICAgICAqIEBwYXJhbSBpZCB7TnVtYmVyfVxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQnlJZChpZCkge1xuXG4gICAgICAgICAgICBsZXQgbW9kZWw7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBmaW5kXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZWRDb21wb25lbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50Q29tcG9uZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kKHJlbmRlcmVkQ29tcG9uZW50LCBjdXJyZW50Q29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWRDb21wb25lbnQuX3Jvb3ROb2RlSUQgPT09IGlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgYmluZE1vZGVsXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gYmluZE1vZGVsKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB0aGlzLl9jdXJyZW50RWxlbWVudC5wcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGN1cnJlbnRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHJlbmRlcmVkQ29tcG9uZW50KSkoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSByZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kKGNoaWxkcmVuW2luZGV4XSwgY3VycmVudENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpbmQoY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50LCBjb21wb25lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybUtleXNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG1hcFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYW5zZm9ybWVyPSd0b0xvd2VyQ2FzZSddXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRyYW5zZm9ybUtleXMobWFwLCB0cmFuc2Zvcm1lciA9ICd0b0xvd2VyQ2FzZScpIHtcblxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkTWFwID0ge307XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG1hcCkuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoKGtleSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkTWFwW2tleVt0cmFuc2Zvcm1lcl0oKV0gPSBtYXBba2V5XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtZWRNYXA7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZWdpc3RlckNvbXBvbmVudFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlckNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHNldHVwRGVsZWdhdGlvblxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0dXBEZWxlZ2F0aW9uKCkge1xuXG4gICAgICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnROYW1lcyB8fCAoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZXMgPSBPYmplY3Qua2V5cygkZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpKS5maWx0ZXIoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5Lm1hdGNoKC9eb24vaSk7XG4gICAgICAgICAgICAgICAgfSkubWFwKChuYW1lKSA9PiBuYW1lLnJlcGxhY2UoL15vbi9pLCAnJykpO1xuXG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBldmVudHMgPSBbJ2NsaWNrJ107XG5cbiAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGBvbiR7ZXZlbnQudHlwZX1gO1xuXG4gICAgICAgICAgICAgICAgZXZlbnQucGF0aC5mb3JFYWNoKChpdGVtKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmdldEF0dHJpYnV0ZSB8fCAhaXRlbS5oYXNBdHRyaWJ1dGUoUkVBQ1RJRF9BVFRSSUJVVEUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgbW9kZWwgICAgICAgPSB0aGlzLmZpbmRCeUlkKGl0ZW0uZ2V0QXR0cmlidXRlKFJFQUNUSURfQVRUUklCVVRFKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZCA9IHRoaXMudHJhbnNmb3JtS2V5cyhtb2RlbC5wcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lIGluIHRyYW5zZm9ybWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZFtldmVudE5hbWVdLmFwcGx5KG1vZGVsLmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSh3aW5kb3cuZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHdhcm5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHdhcm4obWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYE1hcGxlLmpzOiAlYyR7bWVzc2FnZX0uYCwgJ2NvbG9yOiAjZGQ0YjM5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgaW5mb1xuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbyhtZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6IGJsdWUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBlcnJvclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3IobWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYE1hcGxlLmpzOiAlYyR7bWVzc2FnZX0uYCwgJ2NvbG9yOiBvcmFuZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRFeHRlcm5hbFN0eWxlc1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEV4dGVybmFsU3R5bGVzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3R5cGU9XCJ0ZXh0L2Nzc1wiXScpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRJbmxpbmVTdHlsZXNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRJbmxpbmVTdHlsZXMoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldFNjcmlwdHNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTY3JpcHRzKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGpzRmlsZXMgID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXScpO1xuICAgICAgICAgICAgbGV0IGpzeEZpbGVzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvanN4XCJdJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQodXRpbGl0eS50b0FycmF5KGpzRmlsZXMpLCB1dGlsaXR5LnRvQXJyYXkoanN4RmlsZXMpKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RhbnQgV0FJVF9USU1FT1VUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdCBXQUlUX1RJTUVPVVQgPSAzMDAwMDtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgcGF0aFJlc29sdmVyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTERvY3VtZW50fSBvd25lckRvY3VtZW50XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgcGF0aFJlc29sdmVyKG93bmVyRG9jdW1lbnQsIHVybCkge1xuXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50UGF0aCA9IHRoaXMuZ2V0UGF0aCh1cmwpLFxuICAgICAgICAgICAgICAgIGdldFBhdGggICAgICAgPSB0aGlzLmdldFBhdGguYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVQYXRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IG92ZXJyaWRlRG9jdW1lbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVBhdGgocGF0aCwgb3ZlcnJpZGVEb2N1bWVudCA9IGRvY3VtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgID0gb3ZlcnJpZGVEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gcGF0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5ocmVmO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRQYXRoXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0UGF0aChwYXRoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2NhbFBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLmdldEFic29sdXRlUGF0aCgpfS8ke3BhdGh9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChwYXRoLCBkb2N1bWVudCk7XG5cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRBYnNvbHV0ZVBhdGhcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0QWJzb2x1dGVQYXRoKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZVBhdGgoY29tcG9uZW50UGF0aCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UmVsYXRpdmVQYXRoXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldFJlbGF0aXZlUGF0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudFBhdGg7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBtZXRob2QgaXNMb2NhbFBhdGhcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaXNMb2NhbFBhdGgocGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBwYXRoID0gZ2V0UGF0aChyZXNvbHZlUGF0aChwYXRoLCBvd25lckRvY3VtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIX5yZXNvbHZlUGF0aChjb21wb25lbnRQYXRoKS5pbmRleE9mKHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSA/IEFycmF5LmZyb20oYXJyYXlMaWtlKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZsYXR0ZW5BcnJheVxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gW2dpdmVuQXJyPVtdXVxuICAgICAgICAgKi9cbiAgICAgICAgZmxhdHRlbkFycmF5KGFyciwgZ2l2ZW5BcnIgPSBbXSkge1xuXG4gICAgICAgICAgICAvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbiAgICAgICAgICAgIGFyci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoaXRlbSkpICYmICh0aGlzLmZsYXR0ZW5BcnJheShpdGVtLCBnaXZlbkFycikpO1xuICAgICAgICAgICAgICAgICghQXJyYXkuaXNBcnJheShpdGVtKSkgJiYgKGdpdmVuQXJyLnB1c2goaXRlbSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cbiAgICAgICAgICAgIHJldHVybiBnaXZlbkFycjtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRpbWVvdXRQcm9taXNlXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXJyb3JNZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZW91dD1XQUlUX1RJTUVPVVRdXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB0aW1lb3V0UHJvbWlzZShyZWplY3QsIGVycm9yTWVzc2FnZSA9ICdUaW1lb3V0JywgdGltZW91dCA9IFdBSVRfVElNRU9VVCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByZWplY3QobmV3IEVycm9yKGVycm9yTWVzc2FnZSkpLCB0aW1lb3V0KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXROYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE5hbWUoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkucG9wKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZW1vdmVFeHRlbnNpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUV4dGVuc2lvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy4nKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJleHBvcnQgY29uc3QgU3RhdGUgPSB7IFVOUkVTT0xWRUQ6IDAsIFJFU09MVklORzogMSwgUkVTT0xWRUQ6IDIgfTtcblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEByZXR1cm4ge0Fic3RyYWN0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gU3RhdGUuVU5SRVNPTFZFRDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHNldFN0YXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXRlXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG59IiwiaW1wb3J0IEVsZW1lbnQgICAgICAgICAgIGZyb20gJy4vRWxlbWVudC5qcyc7XG5pbXBvcnQge0Fic3RyYWN0LCBTdGF0ZX0gZnJvbSAnLi9BYnN0cmFjdC5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgICAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZ2dlciAgICAgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9Mb2dnZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBBYnN0cmFjdCB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0RWxlbWVudFxuICAgICAqIEByZXR1cm4ge01vZHVsZX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgID0gcGF0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IHsgc2NyaXB0OiBzY3JpcHRFbGVtZW50LCB0ZW1wbGF0ZTogdGVtcGxhdGVFbGVtZW50IH07XG5cbiAgICAgICAgbGV0IHNyYyA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIGlmIChzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndGV4dC9qc3gnKSB7XG4gICAgICAgICAgICByZXR1cm4gdm9pZCB0aGlzLmxvYWRKU1goc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnBhdGguZ2V0UmVsYXRpdmVQYXRoKCl9LyR7dXRpbGl0eS5yZW1vdmVFeHRlbnNpb24oc3JjKX1gO1xuXG4gICAgICAgIFN5c3RlbS5pbXBvcnQodXJsKS50aGVuKChpbXBvcnRzKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghaW1wb3J0cy5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGlyZC1wYXJ0eSBzY3JpcHRzIHRoYXQgYXJlIGEgcHJlcmVxdWlzaXRlIG9mIHJlc29sdmluZyB0aGUgY3VzdG9tIGVsZW1lbnQuXG4gICAgICAgICAgICBQcm9taXNlLmFsbCh0aGlzLmxvYWRUaGlyZFBhcnR5U2NyaXB0cygpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgRWxlbWVudChwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQsIGltcG9ydHMuZGVmYXVsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZFRoaXJkUGFydHlTY3JpcHRzXG4gICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAqL1xuICAgIGxvYWRUaGlyZFBhcnR5U2NyaXB0cygpIHtcblxuICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgICAgPSB1dGlsaXR5LnRvQXJyYXkodGhpcy5lbGVtZW50cy50ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCJdJykpLFxuICAgICAgICAgICAgdGhpcmRQYXJ0eVNjcmlwdHMgPSBzY3JpcHRFbGVtZW50cy5maWx0ZXIoKHNjcmlwdEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMucGF0aC5pc0xvY2FsUGF0aChzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXJkUGFydHlTY3JpcHRzLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZEpTWFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcmNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGxvYWRKU1goc3JjKSB7XG5cbiAgICAgICAgbG9nZ2VyLndhcm4oJ1VzaW5nIEpTWFRyYW5zZm9ybWVyIHdoaWNoIGlzIGhpZ2hseSBleHBlcmltZW50YWwgYW5kIHNob3VsZCBub3QgYmUgdXNlZCBmb3IgcHJvZHVjdGlvbicpO1xuXG4gICAgICAgIGZldGNoKGAke3RoaXMucGF0aC5nZXRSZWxhdGl2ZVBhdGgoKX0vJHtzcmN9YCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIH0pLnRoZW4oKGJvZHkpID0+IHtcblxuICAgICAgICAgICAgLyoganNsaW50IGV2aWw6IHRydWUgKi9cbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1lZCA9IGV2YWwoYFwidXNlIHN0cmljdFwiOyAke0pTWFRyYW5zZm9ybWVyLnRyYW5zZm9ybShib2R5KS5jb2RlfWApO1xuXG4gICAgICAgICAgICBQcm9taXNlLmFsbCh0aGlzLmxvYWRUaGlyZFBhcnR5U2NyaXB0cygpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgRWxlbWVudCh0aGlzLnBhdGgsIHRoaXMuZWxlbWVudHMudGVtcGxhdGUsIHRoaXMuZWxlbWVudHMuc2NyaXB0LCB0cmFuc2Zvcm1lZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImltcG9ydCB7QWJzdHJhY3QsIFN0YXRlfSBmcm9tICcuL0Fic3RyYWN0LmpzJztcbmltcG9ydCBldmVudHMgICAgICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvRXZlbnRzLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgICAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgc2VsZWN0b3JzICAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1NlbGVjdG9ycy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdCB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxUZW1wbGF0ZUVsZW1lbnR9IHRlbXBsYXRlRWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRTY3JpcHRcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCwgaW1wb3J0U2NyaXB0KSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXRoICAgICA9IHBhdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB7IHNjcmlwdDogc2NyaXB0RWxlbWVudCwgdGVtcGxhdGU6IHRlbXBsYXRlRWxlbWVudCB9O1xuICAgICAgICB0aGlzLnNjcmlwdCAgID0gaW1wb3J0U2NyaXB0O1xuXG4gICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCh0aGlzLmdldEVsZW1lbnROYW1lKCksIHtcbiAgICAgICAgICAgIHByb3RvdHlwZTogdGhpcy5nZXRFbGVtZW50UHJvdG90eXBlKClcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRTdHlsZXNcbiAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd0JvdW5kYXJ5XG4gICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAqL1xuICAgIGxvYWRTdHlsZXMoc2hhZG93Qm91bmRhcnkpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVTdHlsZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGVTdHlsZShib2R5LCBlbGVtZW50ID0gc2hhZG93Qm91bmRhcnkpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGJvZHk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVklORyk7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQgICAgICAgPSB0aGlzLmVsZW1lbnRzLnRlbXBsYXRlLmNvbnRlbnQ7XG4gICAgICAgIGxldCBsaW5rRWxlbWVudHMgID0gc2VsZWN0b3JzLmdldEV4dGVybmFsU3R5bGVzKGNvbnRlbnQpO1xuICAgICAgICBsZXQgc3R5bGVFbGVtZW50cyA9IHNlbGVjdG9ycy5nZXRJbmxpbmVTdHlsZXMoY29udGVudCk7XG4gICAgICAgIGxldCBwcm9taXNlcyAgICAgID0gW10uY29uY2F0KGxpbmtFbGVtZW50cywgc3R5bGVFbGVtZW50cykubWFwKChlbGVtZW50KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlU3R5bGUoZWxlbWVudC5pbm5lckhUTUwsIHNoYWRvd0JvdW5kYXJ5KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmZXRjaCh0aGlzLnBhdGguZ2V0UGF0aChlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKSkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKSkudGhlbigoYm9keSkgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVN0eWxlKGJvZHksIHNoYWRvd0JvdW5kYXJ5KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldEVsZW1lbnROYW1lXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldEVsZW1lbnROYW1lKCkge1xuICAgICAgICByZXR1cm4gdXRpbGl0eS50b1NuYWtlQ2FzZSh0aGlzLnNjcmlwdC50b1N0cmluZygpLm1hdGNoKC8oPzpmdW5jdGlvbnxjbGFzcylcXHMqKFthLXpdKykvaSlbMV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZ2V0RWxlbWVudFByb3RvdHlwZVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRFbGVtZW50UHJvdG90eXBlKCkge1xuXG4gICAgICAgIGxldCBsb2FkU3R5bGVzID0gdGhpcy5sb2FkU3R5bGVzLmJpbmQodGhpcyksXG4gICAgICAgICAgICBzY3JpcHQgICAgPSB0aGlzLnNjcmlwdCxcbiAgICAgICAgICAgIHBhdGggICAgICA9IHRoaXMucGF0aDtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGFwcGx5RGVmYXVsdFByb3BzXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBhcHBseURlZmF1bHRQcm9wcyhhdHRyaWJ1dGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwbHkgcHJvcGVydGllcyB0byB0aGUgY3VzdG9tIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RGVmYXVsdFByb3BzLmNhbGwodGhpcywgdGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgICAgICA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgUmVhY3QuanMgY29tcG9uZW50LCBpbXBvcnRpbmcgaXQgdW5kZXIgdGhlIHNoYWRvdyBib3VuZGFyeS5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkRWxlbWVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoc2NyaXB0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gUmVhY3QucmVuZGVyKHJlbmRlcmVkRWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgZXZlbnQgZGVsZWdhdGlvbiBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnJlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGV4dGVybmFsIENTUyBkb2N1bWVudHMuXG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGxvYWRTdHlsZXMoc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3VucmVzb2x2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdyZXNvbHZlZCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImltcG9ydCBDb21wb25lbnQgICAgICAgICBmcm9tICcuL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQge0Fic3RyYWN0LCBTdGF0ZX0gZnJvbSAnLi9BYnN0cmFjdC5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgICAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IHNlbGVjdG9ycyAgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9TZWxlY3RvcnMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2R1bGUgZXh0ZW5kcyBBYnN0cmFjdCB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0hUTUxUZW1wbGF0ZUVsZW1lbnR9IHRlbXBsYXRlRWxlbWVudFxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZUVsZW1lbnQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgICAgPSB1dGlsaXR5LnBhdGhSZXNvbHZlcih0ZW1wbGF0ZUVsZW1lbnQuaW1wb3J0LCB0ZW1wbGF0ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAgICAgICB0aGlzLnN0YXRlICAgICAgPSBTdGF0ZS5VTlJFU09MVkVEO1xuICAgICAgICB0aGlzLmVsZW1lbnRzICAgPSB7IHRlbXBsYXRlOiB0ZW1wbGF0ZUVsZW1lbnQgfTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG5cbiAgICAgICAgdGhpcy5sb2FkTW9kdWxlKHRlbXBsYXRlRWxlbWVudCkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0VGVtcGxhdGVzKCkuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSBzZWxlY3RvcnMuZ2V0U2NyaXB0cyh0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cy5tYXAoKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc3JjID0gc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wYXRoLmlzTG9jYWxQYXRoKHNyYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KHRoaXMucGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHNldFN0YXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXRlXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2FkTW9kdWxlXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIGxvYWRNb2R1bGUodGVtcGxhdGVFbGVtZW50KSB7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAodGVtcGxhdGVFbGVtZW50LmltcG9ydCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIHJlc29sdmUodGVtcGxhdGVFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0ZW1wbGF0ZUVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZ2V0VGVtcGxhdGVzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGVzKCkge1xuXG4gICAgICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5lbGVtZW50cy50ZW1wbGF0ZS5pbXBvcnQ7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkob3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpKTtcblxuICAgIH1cblxufSJdfQ==
