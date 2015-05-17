(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modelsModuleJs = require('./models/Module.js');

var _modelsModuleJs2 = _interopRequireDefault(_modelsModuleJs);

var _modelsComponentJs = require('./models/Component.js');

var _modelsComponentJs2 = _interopRequireDefault(_modelsComponentJs);

var _helpersSelectorsJs = require('./helpers/Selectors.js');

var _helpersSelectorsJs2 = _interopRequireDefault(_helpersSelectorsJs);

var _helpersUtilityJs = require('./helpers/Utility.js');

var _helpersUtilityJs2 = _interopRequireDefault(_helpersUtilityJs);

var _helpersEventsJs = require('./helpers/Events.js');

var _helpersEventsJs2 = _interopRequireDefault(_helpersEventsJs);

(function main($window, $document) {

    'use strict';

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
        System.babelOptions = { blacklist: [] };
    }

    /**
     * @constant HAS_INITIATED
     * @type {Boolean}
     */
    var HAS_INITIATED = false;

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

            this.findLinks();
            this.findTemplates();

            // Configure the event delegation mappings.
            _helpersEventsJs2['default'].setupDelegation();
        }

        _createClass(Maple, [{
            key: 'findLinks',

            /**
             * Responsible for finding all of the external link elements, as well as the inline template elements
             * that can be handcrafted, or baked into the HTML document when compiling a project.
             *
             * @method findLinks
             * @return {void}
             */
            value: function findLinks() {

                _helpersSelectorsJs2['default'].getImports($document).forEach(function (linkElement) {

                    if (linkElement['import']) {
                        return void new _modelsModuleJs2['default'](linkElement);
                    }

                    linkElement.addEventListener('load', function () {
                        return new _modelsModuleJs2['default'](linkElement);
                    });
                });
            }
        }, {
            key: 'findTemplates',

            /**
             * Responsible for finding all of the template HTML elements that contain the `ref` attribute which
             * is the component's original path before Mapleify.
             *
             * @method findTemplates
             * @return {void}
             */
            value: function findTemplates() {

                _helpersSelectorsJs2['default'].getTemplates($document).forEach(function (templateElement) {

                    var scriptElements = _helpersSelectorsJs2['default'].getAllScripts(templateElement.content);
                    var ref = templateElement.getAttribute('ref');
                    var path = _helpersUtilityJs2['default'].resolver(ref, null).production;

                    scriptElements.forEach(function (scriptElement) {

                        if (path.isLocalPath(scriptElement.getAttribute('src'))) {
                            new _modelsComponentJs2['default'](path, templateElement, scriptElement);
                        }
                    });
                });
            }
        }]);

        return Maple;
    })();

    /**
     * @method initialise
     * @return {Boolean}
     */
    function initialise() {

        var state = $document.readyState,
            readyStates = ['interactive', 'complete'];

        if (!HAS_INITIATED && ~readyStates.indexOf(state)) {

            HAS_INITIATED = true;

            // No documents, no person.
            new Maple();
        }
    }

    // Support for async, defer, and normal inclusion.
    initialise();
    $document.addEventListener('DOMContentLoaded', initialise);
})(window, document);

},{"./helpers/Events.js":3,"./helpers/Selectors.js":5,"./helpers/Utility.js":6,"./models/Component.js":7,"./models/Module.js":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = (function main($window) {

    "use strict";

    /**
     * @property cache
     * @type {Object}
     */
    var cache = {};

    return {

        /**
         * Responsible for delegating to the native `fetch` function (polyfill provided), but will cache the
         * initial promise in order for other invocations to the same URL to yield the same promise.
         *
         * @method fetch
         * @param url {String}
         * @return {Promise}
         */
        fetch: function fetch(url) {

            if (cache[url]) {
                return cache[url];
            }

            cache[url] = new Promise(function (resolve) {

                cache[url] = $window.fetch(url).then(function (response) {
                    return response.text();
                }).then(function (body) {
                    resolve(body);
                });
            });

            return cache[url];
        }

    };
})(window);

module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _UtilityJs = require("./Utility.js");

var _UtilityJs2 = _interopRequireDefault(_UtilityJs);

/**
 * @method overrideStopPropagation
 * @see: http://bit.ly/1dPpxHl
 * @return {void}
 */
(function overrideStopPropagation() {

    "use strict";

    var overriddenStop = Event.prototype.stopPropagation;

    Event.prototype.stopPropagation = function stopPropagation() {
        this.isPropagationStopped = true;
        overriddenStop.apply(this, arguments);
    };
})();

exports["default"] = (function main($document) {

    "use strict";

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
         * Recursively discover a component via its React ID that is set as a data attribute
         * on each React element.
         *
         * @method findById
         * @param id {String}
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

                if (renderedComponent._renderedComponent) {
                    (function () {

                        var children = renderedComponent._renderedComponent._renderedChildren;

                        if (children) {
                            Object.keys(children).forEach(function (index) {
                                find(children[index], currentComponent);
                            });
                        }
                    })();
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
            var transformer = arguments[1] === undefined ? "toLowerCase" : arguments[1];

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

            /**
             * Determines all of the event types supported by the current browser. Will cache the results
             * of this discovery for performance benefits.
             *
             * @property events
             * @type {Array}
             */
            var events = eventNames || (function () {

                var aElement = $document.createElement("a"),
                    matcher = /^on/i,
                    eventNames = [];

                for (var key in aElement) {

                    if (key.match(matcher)) {
                        eventNames.push(key.replace(matcher, ""));
                    }
                }

                return eventNames;
            })();

            events.forEach(function (eventType) {

                $document.addEventListener(eventType, function (event) {

                    var eventName = "on" + event.type,
                        eventList = [];

                    _UtilityJs2["default"].toArray(event.path).forEach(function (item) {

                        if (event.isPropagationStopped) {

                            // Method `stopPropagation` was invoked on the current event, which prevents
                            // us from propagating any further.
                            return;
                        }

                        if (!item.getAttribute || !item.hasAttribute(_UtilityJs2["default"].ATTRIBUTE_REACTID)) {

                            // Current element is not a valid React element because it doesn't have a
                            // React ID data attribute.
                            return;
                        }

                        // Attempt to field the component by the associated React ID.
                        var model = _this.findById(item.getAttribute(_UtilityJs2["default"].ATTRIBUTE_REACTID));

                        if (model && model.properties) {

                            // Transform the current React events into lower case keys, so that we can pair them
                            // up with the event types.
                            var transformed = _this.transformKeys(model.properties);

                            if (eventName in transformed) {

                                // We defer the invocation of the event method, because otherwise React.js
                                // will re-render, and the React IDs will then be "out of sync" for this event.
                                eventList.push(transformed[eventName].bind(model.component, event));
                            }
                        }
                    });

                    // Invoke each found event for the event type.
                    eventList.forEach(function (eventInvocation) {
                        return eventInvocation();
                    });
                });
            });
        }

    };
})(window.document);

module.exports = exports["default"];

},{"./Utility.js":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main($console) {

    'use strict';

    return {

        /**
         * @method warn
         * @param {String} message
         * @return {void}
         */
        warn: function warn(message) {
            $console.log('Maple.js: %c' + message + '.', 'color: #5F9EA0');
        },

        /**
         * @method info
         * @param {String} message
         * @return {void}
         */
        info: function info(message) {
            $console.log('Maple.js: %c' + message + '.', 'color: blue');
        },

        /**
         * @method error
         * @param {String} message
         * @return {void}
         */
        error: function error(message) {
            $console.error('%c Maple.js: %c' + message + '.', 'color: black', 'color: #CD6090');
        }

    };
})(window.console);

module.exports = exports['default'];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _UtilityJs = require("./Utility.js");

var _UtilityJs2 = _interopRequireDefault(_UtilityJs);

/**
 * @method queryAll
 * @param {String} expression
 * @return {Array}
 */
var queryAll = function queryAll(expression) {
    "use strict";
    return _UtilityJs2["default"].toArray(this.querySelectorAll(expression));
};

exports["default"] = (function main() {

    "use strict";

    return {

        /**
         * @method getCSSLinks
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getCSSLinks: function getCSSLinks(element) {
            return queryAll.call(element, "link[type=\"text/css\"]");
        },

        /**
         * @method getCSSInlines
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getCSSInlines: function getCSSInlines(element) {
            return queryAll.call(element, "style[type=\"text/css\"]");
        },

        /**
         * @method getImports
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getImports: function getImports(element) {
            return queryAll.call(element, "link[rel=\"import\"]:not([data-ignore])");
        },

        /**
         * @method getTemplates
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getTemplates: function getTemplates(element) {
            return queryAll.call(element, "template[ref]");
        },

        /**
         * @method getScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getScripts: function getScripts(element) {
            return queryAll.call(element, "script[type=\"text/javascript\"]");
        },

        /**
         * @method getAllScripts
         * @param {HTMLElement|HTMLDocument} element
         * @return {Array}
         */
        getAllScripts: function getAllScripts(element) {
            var jsxFiles = queryAll.call(element, "script[type=\"text/jsx\"]");
            return [].concat(_UtilityJs2["default"].toArray(this.getScripts(element)), _UtilityJs2["default"].toArray(jsxFiles));
        }

    };
})();

module.exports = exports["default"];

},{"./Utility.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main($document) {

    'use strict';

    /**
     * @constant WAIT_TIMEOUT
     * @type {Number}
     */
    var WAIT_TIMEOUT = 30000;

    return {

        /**
         * @constant ATTRIBUTE_REACTID
         * @type {String}
         */
        ATTRIBUTE_REACTID: 'data-reactid',

        /**
         * @method resolver
         * @param {String} url
         * @param {HTMLDocument|null} ownerDocument
         * @return {Object}
         */
        resolver: function resolver(url, ownerDocument) {

            var componentPath = this.getPath(url),
                getPath = this.getPath.bind(this),
                getName = this.getName.bind(this);
            /**
             * @method resolvePath
             * @param {String} path
             * @param {HTMLDocument} overrideDocument
             * @return {String}
             */
            function resolvePath(path) {
                var overrideDocument = arguments[1] === undefined ? $document : arguments[1];

                var a = overrideDocument.createElement('a');
                a.href = path;
                return a.href;
            }

            return {

                /**
                 * @property production
                 * @type {Object}
                 */
                production: {

                    /**
                     * @method getPath
                     * @param {String} path
                     * @return {String}
                     */
                    getPath: function getPath(path) {

                        if (this.isLocalPath(path)) {
                            return '' + this.getAbsolutePath() + '/' + getName(path);
                        }

                        return resolvePath(path, $document);
                    },

                    /**
                     * @method getSrc
                     * @return {String}
                     */
                    getSrc: function getSrc(src) {
                        return getName(src);
                    },

                    /**
                     * @method getAbsolutePath
                     * @return {String}
                     */
                    getAbsolutePath: function getAbsolutePath() {
                        return resolvePath(url);
                    },

                    /**
                     * @method getRelativePath
                     * @return {String}
                     */
                    getRelativePath: function getRelativePath() {
                        return url;
                    },

                    /**
                     * @method isLocalPath
                     * @param {String} path
                     * @return {Boolean}
                     */
                    isLocalPath: function isLocalPath(path) {
                        return !! ~path.indexOf(url);
                    }

                },

                /**
                 * @property development
                 * @type {Object}
                 */
                development: {

                    /**
                     * @method getPath
                     * @param {String} path
                     * @return {String}
                     */
                    getPath: function getPath(path) {

                        if (this.isLocalPath(path)) {
                            return '' + this.getAbsolutePath() + '/' + path;
                        }

                        return resolvePath(path, $document);
                    },

                    /**
                     * @method getSrc
                     * @return {String}
                     */
                    getSrc: function getSrc(src) {
                        return src;
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
            return importPath.split('/').slice(-1);
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
})(window.document);

module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _ElementJs = require('./Element.js');

var _ElementJs2 = _interopRequireDefault(_ElementJs);

var _helpersUtilityJs = require('./../helpers/Utility.js');

var _helpersUtilityJs2 = _interopRequireDefault(_helpersUtilityJs);

var _helpersLoggerJs = require('./../helpers/Logger.js');

var _helpersLoggerJs2 = _interopRequireDefault(_helpersLoggerJs);

var _StateManagerJs = require('./StateManager.js');

/**
 * @module Maple
 * @submodule Component
 * @extends StateManager
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */

var Component = (function (_StateManager) {

    /**
     * Responsible for loading any prerequisites before the component is delegated to each `CustomElement`
     * object for creating a custom element, and lastly rendering the React component to the designated HTML element.
     *
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
        this.setState(_StateManagerJs.State.RESOLVING);

        // Configure the URL of the component for ES6 `System.import`, which is also polyfilled in case the
        // current browser does not provide support for dynamic module loading.
        var url = '' + this.path.getRelativePath() + '/' + _helpersUtilityJs2['default'].removeExtension(src);

        if (src.split('.').pop().toLowerCase() === 'jsx') {
            return void _helpersLoggerJs2['default'].error('Use JS extension instead of JSX – JSX compilation will work as expected');
        }

        System['import']('' + url).then(function (imports) {

            if (!imports['default']) {

                // Components that do not have a default export (i.e: export default class...) will be ignored.
                return;
            }

            // Load all third-party scripts that are a prerequisite of resolving the custom element.
            Promise.all(_this.loadThirdPartyScripts()).then(function () {
                new _ElementJs2['default'](path, templateElement, scriptElement, imports['default']);
                _this.setState(_StateManagerJs.State.RESOLVED);
            });
        });
    }

    _inherits(Component, _StateManager);

    _createClass(Component, [{
        key: 'loadThirdPartyScripts',

        /**
         * Discover all of the third party JavaScript dependencies that are required to have been loaded before
         * attempting to render the custom element.
         *
         * @method loadThirdPartyScripts
         * @return {Promise[]}
         */
        value: function loadThirdPartyScripts() {
            var _this2 = this;

            var scriptElements = _helpersUtilityJs2['default'].toArray(this.elements.template.content.querySelectorAll('script[type="text/javascript"]')),
                thirdPartyScripts = scriptElements.filter(function (scriptElement) {
                return !_this2.path.isLocalPath(scriptElement.getAttribute('src'));
            });

            return thirdPartyScripts.map(function (scriptElement) {

                var src = scriptElement.getAttribute('src');
                scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.setAttribute('src', src);

                return new Promise(function (resolve) {
                    scriptElement.addEventListener('load', function () {
                        return resolve();
                    });
                    document.head.appendChild(scriptElement);
                });
            });
        }
    }]);

    return Component;
})(_StateManagerJs.StateManager);

exports['default'] = Component;
module.exports = exports['default'];

},{"./../helpers/Logger.js":4,"./../helpers/Utility.js":6,"./Element.js":8,"./StateManager.js":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _helpersEventsJs = require('./../helpers/Events.js');

var _helpersEventsJs2 = _interopRequireDefault(_helpersEventsJs);

var _helpersUtilityJs = require('./../helpers/Utility.js');

var _helpersUtilityJs2 = _interopRequireDefault(_helpersUtilityJs);

var _helpersCacheFactoryJs = require('./../helpers/CacheFactory.js');

var _helpersCacheFactoryJs2 = _interopRequireDefault(_helpersCacheFactoryJs);

var _helpersSelectorsJs = require('./../helpers/Selectors.js');

var _helpersSelectorsJs2 = _interopRequireDefault(_helpersSelectorsJs);

var _StateManagerJs = require('./StateManager.js');

/**
 * @module Maple
 * @submodule CustomElement
 * @extends StateManager
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */

var CustomElement = (function (_StateManager) {

    /**
     * @constructor
     * @param {String} path
     * @param {HTMLScriptElement} scriptElement
     * @param {HTMLTemplateElement} templateElement
     * @param {String} importScript
     * @return {Element}
     */

    function CustomElement(path, templateElement, scriptElement, importScript) {
        _classCallCheck(this, CustomElement);

        _get(Object.getPrototypeOf(CustomElement.prototype), 'constructor', this).call(this);
        this.path = path;
        this.elements = { script: scriptElement, template: templateElement };
        this.script = importScript;

        document.registerElement(this.getElementName(), {
            prototype: this.getElementPrototype()
        });
    }

    _inherits(CustomElement, _StateManager);

    _createClass(CustomElement, [{
        key: 'loadStyles',

        /**
         * Responsible for loading associated styles into either the shadow DOM, if the path is determined to be local
         * to the component, or globally if not.
         *
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

            this.setState(_StateManagerJs.State.RESOLVING);

            var content = this.elements.template.content;
            var linkElements = _helpersSelectorsJs2['default'].getCSSLinks(content);
            var styleElements = _helpersSelectorsJs2['default'].getCSSInlines(content);
            var promises = [].concat(linkElements, styleElements).map(function (element) {
                return new Promise(function (resolve) {

                    if (element.nodeName.toLowerCase() === 'style') {
                        createStyle(element.innerHTML, shadowBoundary);
                        resolve();
                        return;
                    }

                    _helpersCacheFactoryJs2['default'].fetch(_this.path.getPath(element.getAttribute('href'))).then(function (body) {
                        createStyle(body, shadowBoundary);
                        resolve();
                    });
                });
            });

            Promise.all(promises).then(function () {
                return _this.setState(_StateManagerJs.State.RESOLVED);
            });
            return promises;
        }
    }, {
        key: 'getElementName',

        /**
         * Extract the element name from converting the Function to a String via the `toString` method. It's worth
         * noting that this is probably the weakest part of the Maple system because it relies on a regular expression
         * to determine the name of the resulting custom HTML element.
         *
         * @method getElementName
         * @return {String}
         */
        value: function getElementName() {
            return _helpersUtilityJs2['default'].toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
        }
    }, {
        key: 'getElementPrototype',

        /**
         * Yields the prototype for the custom HTML element that will be registered for our custom React component.
         * It listens for when the custom element has been inserted into the DOM, and then sets up the styles, applies
         * default React properties, etc...
         *
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
                                var replacer = /^data-/i;

                                if (attribute.value) {

                                    if (attribute.name === _helpersUtilityJs2['default'].ATTRIBUTE_REACTID) {
                                        continue;
                                    }

                                    var _name = attribute.name.replace(replacer, '');
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
                        _helpersEventsJs2['default'].registerComponent(component);

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

    return CustomElement;
})(_StateManagerJs.StateManager);

exports['default'] = CustomElement;
module.exports = exports['default'];

},{"./../helpers/CacheFactory.js":2,"./../helpers/Events.js":3,"./../helpers/Selectors.js":5,"./../helpers/Utility.js":6,"./StateManager.js":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _ComponentJs = require('./Component.js');

var _ComponentJs2 = _interopRequireDefault(_ComponentJs);

var _helpersUtilityJs = require('./../helpers/Utility.js');

var _helpersUtilityJs2 = _interopRequireDefault(_helpersUtilityJs);

var _helpersLoggerJs = require('./../helpers/Logger.js');

var _helpersLoggerJs2 = _interopRequireDefault(_helpersLoggerJs);

var _helpersSelectorsJs = require('./../helpers/Selectors.js');

var _helpersSelectorsJs2 = _interopRequireDefault(_helpersSelectorsJs);

var _StateManagerJs = require('./StateManager.js');

var Module = (function (_StateManager) {

    /**
     * @constructor
     * @param {HTMLLinkElement} linkElement
     * @return {Component}
     */

    function Module(linkElement) {
        var _this = this;

        _classCallCheck(this, Module);

        _get(Object.getPrototypeOf(Module.prototype), 'constructor', this).call(this);
        this.path = _helpersUtilityJs2['default'].resolver(linkElement.getAttribute('href'), linkElement['import']).development;
        this.state = _StateManagerJs.State.UNRESOLVED;
        this.elements = { link: linkElement };
        this.components = [];

        this.loadModule(linkElement).then(function () {

            // Use only the first template, because otherwise Mapleify will have a difficult job attempting
            // to resolve the paths when there's a mismatch between template elements and link elements.
            // PREVIOUS: this.getTemplates().forEach((templateElement) => {

            var templateElements = _this.getTemplates();

            if (templateElements.length > 1) {
                _helpersLoggerJs2['default'].error('Component "' + linkElement.getAttribute('href') + '" is attempting to register two components');
                return;
            }

            [_this.getTemplates()[0]].forEach(function (templateElement) {

                var scriptElements = _helpersSelectorsJs2['default'].getAllScripts(templateElement.content);

                scriptElements.map(function (scriptElement) {

                    var src = scriptElement.getAttribute('src');

                    if (!_this.path.isLocalPath(src)) {
                        return;
                    }

                    var component = new _ComponentJs2['default'](_this.path, templateElement, scriptElement);
                    _this.components.push(component);
                });
            });

            _this.setState(_StateManagerJs.State.RESOLVED);
        });
    }

    _inherits(Module, _StateManager);

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

            this.setState(_StateManagerJs.State.RESOLVING);

            return new Promise(function (resolve) {

                if (templateElement.hasAttribute('ref')) {
                    return void resolve(templateElement);
                }

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

            var ownerDocument = this.elements.link['import'];
            return _helpersUtilityJs2['default'].toArray(ownerDocument.querySelectorAll('template'));
        }
    }]);

    return Module;
})(_StateManagerJs.StateManager);

exports['default'] = Module;
module.exports = exports['default'];

},{"./../helpers/Logger.js":4,"./../helpers/Selectors.js":5,"./../helpers/Utility.js":6,"./Component.js":7,"./StateManager.js":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @constant State
 * @type {{UNRESOLVED: number, RESOLVING: number, RESOLVED: number}}
 */
var State = { UNRESOLVED: 0, RESOLVING: 1, RESOLVED: 2 };

exports.State = State;
/**
 * @module Maple
 * @submodule StateManager
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */

var StateManager = (function () {

  /**
   * @constructor
   * @return {Abstract}
   */

  function StateManager() {
    _classCallCheck(this, StateManager);

    this.state = State.UNRESOLVED;
  }

  _createClass(StateManager, [{
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

  return StateManager;
})();

exports.StateManager = StateManager;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9DYWNoZUZhY3RvcnkuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2dnZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TZWxlY3RvcnMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL0VsZW1lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL01vZHVsZS5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9tb2RlbHMvU3RhdGVNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OEJDQXNCLG9CQUFvQjs7OztpQ0FDcEIsdUJBQXVCOzs7O2tDQUN2Qix3QkFBd0I7Ozs7Z0NBQ3hCLHNCQUFzQjs7OzsrQkFDdEIscUJBQXFCOzs7O0FBRTNDLENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRTs7QUFFL0IsZ0JBQVksQ0FBQzs7QUFFYixRQUFJLE9BQU8sTUFB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LGVBQWUsVUFBTyxFQUFFO0FBQ3hCLDJCQUFPLEtBQUssT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2lCQUN4Qzs7QUFFRCwrQkFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQzNDLDJCQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzVCLENBQUMsQ0FBQzthQUVOLENBQUMsQ0FBQztTQUVOOzs7Ozs7OztlQU1XLHdCQUFHOztBQUVYLGdCQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksVUFBTyxDQUFDO0FBQzlDLG1CQUFPLDhCQUFRLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUV0RTs7O1dBbEdnQixNQUFNO21CQUZuQixZQUFZOztxQkFFQyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGcEIsSUFBTSxLQUFLLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDOztRQUFyRCxLQUFLLEdBQUwsS0FBSzs7Ozs7Ozs7SUFRTCxZQUFZOzs7Ozs7O0FBTVYsV0FORixZQUFZLEdBTVA7MEJBTkwsWUFBWTs7QUFPakIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0dBQ2pDOztlQVJRLFlBQVk7Ozs7Ozs7O1dBZWIsa0JBQUMsS0FBSyxFQUFFO0FBQ1osVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDdEI7OztTQWpCUSxZQUFZOzs7UUFBWixZQUFZLEdBQVosWUFBWSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTW9kdWxlICAgIGZyb20gJy4vbW9kZWxzL01vZHVsZS5qcyc7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vbW9kZWxzL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgc2VsZWN0b3JzIGZyb20gJy4vaGVscGVycy9TZWxlY3RvcnMuanMnO1xuaW1wb3J0IHV0aWxpdHkgICBmcm9tICcuL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgZXZlbnRzICAgIGZyb20gJy4vaGVscGVycy9FdmVudHMuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKHR5cGVvZiBTeXN0ZW0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIFN5c3RlbS50cmFuc3BpbGVyICAgPSAnYmFiZWwnO1xuICAgICAgICBTeXN0ZW0uYmFiZWxPcHRpb25zID0geyBibGFja2xpc3Q6IFtdIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IEhBU19JTklUSUFURURcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBsZXQgSEFTX0lOSVRJQVRFRCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5maW5kTGlua3MoKTtcbiAgICAgICAgICAgIHRoaXMuZmluZFRlbXBsYXRlcygpO1xuXG4gICAgICAgICAgICAvLyBDb25maWd1cmUgdGhlIGV2ZW50IGRlbGVnYXRpb24gbWFwcGluZ3MuXG4gICAgICAgICAgICBldmVudHMuc2V0dXBEZWxlZ2F0aW9uKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNwb25zaWJsZSBmb3IgZmluZGluZyBhbGwgb2YgdGhlIGV4dGVybmFsIGxpbmsgZWxlbWVudHMsIGFzIHdlbGwgYXMgdGhlIGlubGluZSB0ZW1wbGF0ZSBlbGVtZW50c1xuICAgICAgICAgKiB0aGF0IGNhbiBiZSBoYW5kY3JhZnRlZCwgb3IgYmFrZWQgaW50byB0aGUgSFRNTCBkb2N1bWVudCB3aGVuIGNvbXBpbGluZyBhIHByb2plY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgZmluZExpbmtzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kTGlua3MoKSB7XG5cbiAgICAgICAgICAgIHNlbGVjdG9ycy5nZXRJbXBvcnRzKCRkb2N1bWVudCkuZm9yRWFjaCgobGlua0VsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChsaW5rRWxlbWVudC5pbXBvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgbmV3IE1vZHVsZShsaW5rRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IG5ldyBNb2R1bGUobGlua0VsZW1lbnQpKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNwb25zaWJsZSBmb3IgZmluZGluZyBhbGwgb2YgdGhlIHRlbXBsYXRlIEhUTUwgZWxlbWVudHMgdGhhdCBjb250YWluIHRoZSBgcmVmYCBhdHRyaWJ1dGUgd2hpY2hcbiAgICAgICAgICogaXMgdGhlIGNvbXBvbmVudCdzIG9yaWdpbmFsIHBhdGggYmVmb3JlIE1hcGxlaWZ5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRUZW1wbGF0ZXNcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRUZW1wbGF0ZXMoKSB7XG5cbiAgICAgICAgICAgIHNlbGVjdG9ycy5nZXRUZW1wbGF0ZXMoJGRvY3VtZW50KS5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IHNlbGVjdG9ycy5nZXRBbGxTY3JpcHRzKHRlbXBsYXRlRWxlbWVudC5jb250ZW50KTtcbiAgICAgICAgICAgICAgICBsZXQgcmVmICAgICAgICAgICAgPSB0ZW1wbGF0ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgICAgICAgICBsZXQgcGF0aCAgICAgICAgICAgPSB1dGlsaXR5LnJlc29sdmVyKHJlZiwgbnVsbCkucHJvZHVjdGlvbjtcblxuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnRzLmZvckVhY2goKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5pc0xvY2FsUGF0aChzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KHBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGluaXRpYWxpc2VcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRpYWxpc2UoKSB7XG5cbiAgICAgICAgbGV0IHN0YXRlICAgICAgID0gJGRvY3VtZW50LnJlYWR5U3RhdGUsXG4gICAgICAgICAgICByZWFkeVN0YXRlcyA9IFsnaW50ZXJhY3RpdmUnLCAnY29tcGxldGUnXTtcblxuICAgICAgICBpZiAoIUhBU19JTklUSUFURUQgJiYgfnJlYWR5U3RhdGVzLmluZGV4T2Yoc3RhdGUpKSB7XG5cbiAgICAgICAgICAgIEhBU19JTklUSUFURUQgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBObyBkb2N1bWVudHMsIG5vIHBlcnNvbi5cbiAgICAgICAgICAgIG5ldyBNYXBsZSgpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZm9yIGFzeW5jLCBkZWZlciwgYW5kIG5vcm1hbCBpbmNsdXNpb24uXG4gICAgaW5pdGlhbGlzZSgpO1xuICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdGlhbGlzZSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCR3aW5kb3cpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGNhY2hlXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBsZXQgY2FjaGUgPSB7fTtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc3BvbnNpYmxlIGZvciBkZWxlZ2F0aW5nIHRvIHRoZSBuYXRpdmUgYGZldGNoYCBmdW5jdGlvbiAocG9seWZpbGwgcHJvdmlkZWQpLCBidXQgd2lsbCBjYWNoZSB0aGVcbiAgICAgICAgICogaW5pdGlhbCBwcm9taXNlIGluIG9yZGVyIGZvciBvdGhlciBpbnZvY2F0aW9ucyB0byB0aGUgc2FtZSBVUkwgdG8geWllbGQgdGhlIHNhbWUgcHJvbWlzZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBmZXRjaFxuICAgICAgICAgKiBAcGFyYW0gdXJsIHtTdHJpbmd9XG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAqL1xuICAgICAgICBmZXRjaCh1cmwpIHtcblxuICAgICAgICAgICAgaWYgKGNhY2hlW3VybF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbdXJsXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FjaGVbdXJsXSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjYWNoZVt1cmxdID0gJHdpbmRvdy5mZXRjaCh1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShib2R5KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjYWNoZVt1cmxdO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKHdpbmRvdyk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5LmpzJztcblxuLyoqXG4gKiBAbWV0aG9kIG92ZXJyaWRlU3RvcFByb3BhZ2F0aW9uXG4gKiBAc2VlOiBodHRwOi8vYml0Lmx5LzFkUHB4SGxcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbihmdW5jdGlvbiBvdmVycmlkZVN0b3BQcm9wYWdhdGlvbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IG92ZXJyaWRkZW5TdG9wID0gRXZlbnQucHJvdG90eXBlLnN0b3BQcm9wYWdhdGlvbjtcblxuICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgICAgIHRoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgICAgICBvdmVycmlkZGVuU3RvcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50c1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBsZXQgY29tcG9uZW50cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGV2ZW50TmFtZXNcbiAgICAgKiBAdHlwZSB7QXJyYXl8bnVsbH1cbiAgICAgKi9cbiAgICBsZXQgZXZlbnROYW1lcyA9IG51bGw7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWN1cnNpdmVseSBkaXNjb3ZlciBhIGNvbXBvbmVudCB2aWEgaXRzIFJlYWN0IElEIHRoYXQgaXMgc2V0IGFzIGEgZGF0YSBhdHRyaWJ1dGVcbiAgICAgICAgICogb24gZWFjaCBSZWFjdCBlbGVtZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRCeUlkXG4gICAgICAgICAqIEBwYXJhbSBpZCB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQnlJZChpZCkge1xuXG4gICAgICAgICAgICBsZXQgbW9kZWw7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBmaW5kXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZWRDb21wb25lbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50Q29tcG9uZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kKHJlbmRlcmVkQ29tcG9uZW50LCBjdXJyZW50Q29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWRDb21wb25lbnQuX3Jvb3ROb2RlSUQgPT09IGlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgYmluZE1vZGVsXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gYmluZE1vZGVsKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB0aGlzLl9jdXJyZW50RWxlbWVudC5wcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGN1cnJlbnRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHJlbmRlcmVkQ29tcG9uZW50KSkoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENoaWxkcmVuO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZChjaGlsZHJlbltpbmRleF0sIGN1cnJlbnRDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpbmQoY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50LCBjb21wb25lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybUtleXNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG1hcFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYW5zZm9ybWVyPSd0b0xvd2VyQ2FzZSddXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRyYW5zZm9ybUtleXMobWFwLCB0cmFuc2Zvcm1lciA9ICd0b0xvd2VyQ2FzZScpIHtcblxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkTWFwID0ge307XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG1hcCkuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoKGtleSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkTWFwW2tleVt0cmFuc2Zvcm1lcl0oKV0gPSBtYXBba2V5XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtZWRNYXA7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZWdpc3RlckNvbXBvbmVudFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlckNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHNldHVwRGVsZWdhdGlvblxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0dXBEZWxlZ2F0aW9uKCkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERldGVybWluZXMgYWxsIG9mIHRoZSBldmVudCB0eXBlcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgYnJvd3Nlci4gV2lsbCBjYWNoZSB0aGUgcmVzdWx0c1xuICAgICAgICAgICAgICogb2YgdGhpcyBkaXNjb3ZlcnkgZm9yIHBlcmZvcm1hbmNlIGJlbmVmaXRzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBldmVudHNcbiAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50TmFtZXMgfHwgKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBhRWxlbWVudCAgID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlciAgICA9IC9eb24vaSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gYUVsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5Lm1hdGNoKG1hdGNoZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE5hbWVzLnB1c2goa2V5LnJlcGxhY2UobWF0Y2hlciwgJycpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZXM7XG5cbiAgICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudFR5cGUpID0+IHtcblxuICAgICAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGBvbiR7ZXZlbnQudHlwZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdXRpbGl0eS50b0FycmF5KGV2ZW50LnBhdGgpLmZvckVhY2goKGl0ZW0pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXRob2QgYHN0b3BQcm9wYWdhdGlvbmAgd2FzIGludm9rZWQgb24gdGhlIGN1cnJlbnQgZXZlbnQsIHdoaWNoIHByZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXMgZnJvbSBwcm9wYWdhdGluZyBhbnkgZnVydGhlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmdldEF0dHJpYnV0ZSB8fCAhaXRlbS5oYXNBdHRyaWJ1dGUodXRpbGl0eS5BVFRSSUJVVEVfUkVBQ1RJRCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgZWxlbWVudCBpcyBub3QgYSB2YWxpZCBSZWFjdCBlbGVtZW50IGJlY2F1c2UgaXQgZG9lc24ndCBoYXZlIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWFjdCBJRCBkYXRhIGF0dHJpYnV0ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXR0ZW1wdCB0byBmaWVsZCB0aGUgY29tcG9uZW50IGJ5IHRoZSBhc3NvY2lhdGVkIFJlYWN0IElELlxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5maW5kQnlJZChpdGVtLmdldEF0dHJpYnV0ZSh1dGlsaXR5LkFUVFJJQlVURV9SRUFDVElEKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbCAmJiBtb2RlbC5wcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmFuc2Zvcm0gdGhlIGN1cnJlbnQgUmVhY3QgZXZlbnRzIGludG8gbG93ZXIgY2FzZSBrZXlzLCBzbyB0aGF0IHdlIGNhbiBwYWlyIHRoZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cCB3aXRoIHRoZSBldmVudCB0eXBlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWQgPSB0aGlzLnRyYW5zZm9ybUtleXMobW9kZWwucHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lIGluIHRyYW5zZm9ybWVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZGVmZXIgdGhlIGludm9jYXRpb24gb2YgdGhlIGV2ZW50IG1ldGhvZCwgYmVjYXVzZSBvdGhlcndpc2UgUmVhY3QuanNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCByZS1yZW5kZXIsIGFuZCB0aGUgUmVhY3QgSURzIHdpbGwgdGhlbiBiZSBcIm91dCBvZiBzeW5jXCIgZm9yIHRoaXMgZXZlbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5wdXNoKHRyYW5zZm9ybWVkW2V2ZW50TmFtZV0uYmluZChtb2RlbC5jb21wb25lbnQsIGV2ZW50KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgZWFjaCBmb3VuZCBldmVudCBmb3IgdGhlIGV2ZW50IHR5cGUuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5mb3JFYWNoKChldmVudEludm9jYXRpb24pID0+IGV2ZW50SW52b2NhdGlvbigpKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSh3aW5kb3cuZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRjb25zb2xlKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2Qgd2FyblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybihtZXNzYWdlKSB7XG4gICAgICAgICAgICAkY29uc29sZS5sb2coYE1hcGxlLmpzOiAlYyR7bWVzc2FnZX0uYCwgJ2NvbG9yOiAjNUY5RUEwJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgaW5mb1xuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbyhtZXNzYWdlKSB7XG4gICAgICAgICAgICAkY29uc29sZS5sb2coYE1hcGxlLmpzOiAlYyR7bWVzc2FnZX0uYCwgJ2NvbG9yOiBibHVlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZXJyb3JcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGVycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICRjb25zb2xlLmVycm9yKGAlYyBNYXBsZS5qczogJWMke21lc3NhZ2V9LmAsICdjb2xvcjogYmxhY2snLCAnY29sb3I6ICNDRDYwOTAnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkod2luZG93LmNvbnNvbGUpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vVXRpbGl0eS5qcyc7XG5cbi8qKlxuICogQG1ldGhvZCBxdWVyeUFsbFxuICogQHBhcmFtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5sZXQgcXVlcnlBbGwgPSBmdW5jdGlvbiBxdWVyeUFsbChleHByZXNzaW9uKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoZXhwcmVzc2lvbikpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0Q1NTTGlua3NcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRDU1NMaW5rcyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRDU1NJbmxpbmVzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q1NTSW5saW5lcyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAnc3R5bGVbdHlwZT1cInRleHQvY3NzXCJdJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0SW1wb3J0c1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEltcG9ydHMoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5QWxsLmNhbGwoZWxlbWVudCwgJ2xpbmtbcmVsPVwiaW1wb3J0XCJdOm5vdChbZGF0YS1pZ25vcmVdKScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldFRlbXBsYXRlc1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFRlbXBsYXRlcyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAndGVtcGxhdGVbcmVmXScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldFNjcmlwdHNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTY3JpcHRzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeUFsbC5jYWxsKGVsZW1lbnQsICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldEFsbFNjcmlwdHNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRBbGxTY3JpcHRzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBqc3hGaWxlcyA9IHF1ZXJ5QWxsLmNhbGwoZWxlbWVudCwgJ3NjcmlwdFt0eXBlPVwidGV4dC9qc3hcIl0nKTtcbiAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQodXRpbGl0eS50b0FycmF5KHRoaXMuZ2V0U2NyaXB0cyhlbGVtZW50KSksIHV0aWxpdHkudG9BcnJheShqc3hGaWxlcykpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RhbnQgV0FJVF9USU1FT1VUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdCBXQUlUX1RJTUVPVVQgPSAzMDAwMDtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdGFudCBBVFRSSUJVVEVfUkVBQ1RJRFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgQVRUUklCVVRFX1JFQUNUSUQ6ICdkYXRhLXJlYWN0aWQnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR8bnVsbH0gb3duZXJEb2N1bWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICByZXNvbHZlcih1cmwsIG93bmVyRG9jdW1lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudFBhdGggPSB0aGlzLmdldFBhdGgodXJsKSxcbiAgICAgICAgICAgICAgICBnZXRQYXRoICAgICAgID0gdGhpcy5nZXRQYXRoLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZ2V0TmFtZSAgICAgICA9IHRoaXMuZ2V0TmFtZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVQYXRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IG92ZXJyaWRlRG9jdW1lbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVBhdGgocGF0aCwgb3ZlcnJpZGVEb2N1bWVudCA9ICRkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBhICA9IG92ZXJyaWRlRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgIGEuaHJlZiA9IHBhdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuaHJlZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBwcm9kdWN0aW9uXG4gICAgICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcm9kdWN0aW9uOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXRoKHBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2NhbFBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5nZXRBYnNvbHV0ZVBhdGgoKX0vJHtnZXROYW1lKHBhdGgpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChwYXRoLCAkZG9jdW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0U3JjXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFNyYyhzcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXROYW1lKHNyYyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0QWJzb2x1dGVQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldEFic29sdXRlUGF0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldFJlbGF0aXZlUGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRSZWxhdGl2ZVBhdGgoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGlzTG9jYWxQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBpc0xvY2FsUGF0aChwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISF+cGF0aC5pbmRleE9mKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAcHJvcGVydHkgZGV2ZWxvcG1lbnRcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGRldmVsb3BtZW50OiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXRoKHBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2NhbFBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5nZXRBYnNvbHV0ZVBhdGgoKX0vJHtwYXRofWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChwYXRoLCAkZG9jdW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0U3JjXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFNyYyhzcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzcmM7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0QWJzb2x1dGVQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldEFic29sdXRlUGF0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChjb21wb25lbnRQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRSZWxhdGl2ZVBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0UmVsYXRpdmVQYXRoKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudFBhdGg7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgaXNMb2NhbFBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHBhdGgge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlzTG9jYWxQYXRoKHBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBnZXRQYXRoKHJlc29sdmVQYXRoKHBhdGgsIG93bmVyRG9jdW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIX5yZXNvbHZlUGF0aChjb21wb25lbnRQYXRoKS5pbmRleE9mKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20gPyBBcnJheS5mcm9tKGFycmF5TGlrZSkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmbGF0dGVuQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYXJyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IFtnaXZlbkFycj1bXV1cbiAgICAgICAgICovXG4gICAgICAgIGZsYXR0ZW5BcnJheShhcnIsIGdpdmVuQXJyID0gW10pIHtcblxuICAgICAgICAgICAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG4gICAgICAgICAgICBhcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KGl0ZW0pKSAmJiAodGhpcy5mbGF0dGVuQXJyYXkoaXRlbSwgZ2l2ZW5BcnIpKTtcbiAgICAgICAgICAgICAgICAoIUFycmF5LmlzQXJyYXkoaXRlbSkpICYmIChnaXZlbkFyci5wdXNoKGl0ZW0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXG4gICAgICAgICAgICByZXR1cm4gZ2l2ZW5BcnI7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0aW1lb3V0UHJvbWlzZVxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGVycm9yTWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVvdXQ9V0FJVF9USU1FT1VUXVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdGltZW91dFByb21pc2UocmVqZWN0LCBlcnJvck1lc3NhZ2UgPSAnVGltZW91dCcsIHRpbWVvdXQgPSBXQUlUX1RJTUVPVVQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKSwgdGltZW91dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9TbmFrZUNhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2pvaW5lcj0nLSddXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRvU25ha2VDYXNlKGNhbWVsQ2FzZSwgam9pbmVyID0gJy0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FtZWxDYXNlLnNwbGl0KC8oW0EtWl1bYS16XXswLH0pL2cpLmZpbHRlcihwYXJ0cyA9PiBwYXJ0cykuam9pbihqb2luZXIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0TmFtZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXROYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoLTEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldFBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0UGF0aChpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgcmVtb3ZlRXh0ZW5zaW9uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVFeHRlbnNpb24oZmlsZVBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlUGF0aC5zcGxpdCgnLicpLnNsaWNlKDAsIC0xKS5qb2luKCcuJyk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKHdpbmRvdy5kb2N1bWVudCk7IiwiaW1wb3J0IEN1c3RvbUVsZW1lbnQgZnJvbSAnLi9FbGVtZW50LmpzJztcbmltcG9ydCB1dGlsaXR5ICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2dnZXIgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9Mb2dnZXIuanMnO1xuaW1wb3J0IHtTdGF0ZU1hbmFnZXIsIFN0YXRlfSBmcm9tICcuL1N0YXRlTWFuYWdlci5qcyc7XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBDb21wb25lbnRcbiAqIEBleHRlbmRzIFN0YXRlTWFuYWdlclxuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgU3RhdGVNYW5hZ2VyIHtcblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIGFueSBwcmVyZXF1aXNpdGVzIGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIGRlbGVnYXRlZCB0byBlYWNoIGBDdXN0b21FbGVtZW50YFxuICAgICAqIG9iamVjdCBmb3IgY3JlYXRpbmcgYSBjdXN0b20gZWxlbWVudCwgYW5kIGxhc3RseSByZW5kZXJpbmcgdGhlIFJlYWN0IGNvbXBvbmVudCB0byB0aGUgZGVzaWduYXRlZCBIVE1MIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0RWxlbWVudFxuICAgICAqIEByZXR1cm4ge01vZHVsZX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgID0gcGF0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IHsgc2NyaXB0OiBzY3JpcHRFbGVtZW50LCB0ZW1wbGF0ZTogdGVtcGxhdGVFbGVtZW50IH07XG5cbiAgICAgICAgbGV0IHNyYyA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgVVJMIG9mIHRoZSBjb21wb25lbnQgZm9yIEVTNiBgU3lzdGVtLmltcG9ydGAsIHdoaWNoIGlzIGFsc28gcG9seWZpbGxlZCBpbiBjYXNlIHRoZVxuICAgICAgICAvLyBjdXJyZW50IGJyb3dzZXIgZG9lcyBub3QgcHJvdmlkZSBzdXBwb3J0IGZvciBkeW5hbWljIG1vZHVsZSBsb2FkaW5nLlxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy5wYXRoLmdldFJlbGF0aXZlUGF0aCgpfS8ke3V0aWxpdHkucmVtb3ZlRXh0ZW5zaW9uKHNyYyl9YDtcblxuICAgICAgICBpZiAoc3JjLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKSA9PT0gJ2pzeCcpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIGxvZ2dlci5lcnJvcihgVXNlIEpTIGV4dGVuc2lvbiBpbnN0ZWFkIG9mIEpTWCDigJMgSlNYIGNvbXBpbGF0aW9uIHdpbGwgd29yayBhcyBleHBlY3RlZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgU3lzdGVtLmltcG9ydChgJHt1cmx9YCkudGhlbigoaW1wb3J0cykgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWltcG9ydHMuZGVmYXVsdCkge1xuXG4gICAgICAgICAgICAgICAgLy8gQ29tcG9uZW50cyB0aGF0IGRvIG5vdCBoYXZlIGEgZGVmYXVsdCBleHBvcnQgKGkuZTogZXhwb3J0IGRlZmF1bHQgY2xhc3MuLi4pIHdpbGwgYmUgaWdub3JlZC5cbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCBhbGwgdGhpcmQtcGFydHkgc2NyaXB0cyB0aGF0IGFyZSBhIHByZXJlcXVpc2l0ZSBvZiByZXNvbHZpbmcgdGhlIGN1c3RvbSBlbGVtZW50LlxuICAgICAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5sb2FkVGhpcmRQYXJ0eVNjcmlwdHMoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEN1c3RvbUVsZW1lbnQocGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50LCBpbXBvcnRzLmRlZmF1bHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVTT0xWRUQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNjb3ZlciBhbGwgb2YgdGhlIHRoaXJkIHBhcnR5IEphdmFTY3JpcHQgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHJlcXVpcmVkIHRvIGhhdmUgYmVlbiBsb2FkZWQgYmVmb3JlXG4gICAgICogYXR0ZW1wdGluZyB0byByZW5kZXIgdGhlIGN1c3RvbSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkVGhpcmRQYXJ0eVNjcmlwdHNcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFRoaXJkUGFydHlTY3JpcHRzKCkge1xuXG4gICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyAgICA9IHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnRzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSksXG4gICAgICAgICAgICB0aGlyZFBhcnR5U2NyaXB0cyA9IHNjcmlwdEVsZW1lbnRzLmZpbHRlcigoc2NyaXB0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5wYXRoLmlzTG9jYWxQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcmRQYXJ0eVNjcmlwdHMubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBzcmMgICAgICAgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICAgICAgICBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICBzY3JpcHRFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImltcG9ydCBldmVudHMgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBjYWNoZUZhY3RvcnkgZnJvbSAnLi8uLi9oZWxwZXJzL0NhY2hlRmFjdG9yeS5qcyc7XG5pbXBvcnQgc2VsZWN0b3JzICAgIGZyb20gJy4vLi4vaGVscGVycy9TZWxlY3RvcnMuanMnO1xuaW1wb3J0IHtTdGF0ZU1hbmFnZXIsIFN0YXRlfSBmcm9tICcuL1N0YXRlTWFuYWdlci5qcyc7XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBDdXN0b21FbGVtZW50XG4gKiBAZXh0ZW5kcyBTdGF0ZU1hbmFnZXJcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBTdGF0ZU1hbmFnZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICAgKiBAcGFyYW0ge0hUTUxTY3JpcHRFbGVtZW50fSBzY3JpcHRFbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0U2NyaXB0XG4gICAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQsIGltcG9ydFNjcmlwdCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGF0aCAgICAgPSBwYXRoO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0geyBzY3JpcHQ6IHNjcmlwdEVsZW1lbnQsIHRlbXBsYXRlOiB0ZW1wbGF0ZUVsZW1lbnQgfTtcbiAgICAgICAgdGhpcy5zY3JpcHQgICA9IGltcG9ydFNjcmlwdDtcblxuICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQodGhpcy5nZXRFbGVtZW50TmFtZSgpLCB7XG4gICAgICAgICAgICBwcm90b3R5cGU6IHRoaXMuZ2V0RWxlbWVudFByb3RvdHlwZSgpXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGxvYWRpbmcgYXNzb2NpYXRlZCBzdHlsZXMgaW50byBlaXRoZXIgdGhlIHNoYWRvdyBET00sIGlmIHRoZSBwYXRoIGlzIGRldGVybWluZWQgdG8gYmUgbG9jYWxcbiAgICAgKiB0byB0aGUgY29tcG9uZW50LCBvciBnbG9iYWxseSBpZiBub3QuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvYWRTdHlsZXNcbiAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd0JvdW5kYXJ5XG4gICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAqL1xuICAgIGxvYWRTdHlsZXMoc2hhZG93Qm91bmRhcnkpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVTdHlsZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGVTdHlsZShib2R5LCBlbGVtZW50ID0gc2hhZG93Qm91bmRhcnkpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGJvZHk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVklORyk7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQgICAgICAgPSB0aGlzLmVsZW1lbnRzLnRlbXBsYXRlLmNvbnRlbnQ7XG4gICAgICAgIGxldCBsaW5rRWxlbWVudHMgID0gc2VsZWN0b3JzLmdldENTU0xpbmtzKGNvbnRlbnQpO1xuICAgICAgICBsZXQgc3R5bGVFbGVtZW50cyA9IHNlbGVjdG9ycy5nZXRDU1NJbmxpbmVzKGNvbnRlbnQpO1xuICAgICAgICBsZXQgcHJvbWlzZXMgICAgICA9IFtdLmNvbmNhdChsaW5rRWxlbWVudHMsIHN0eWxlRWxlbWVudHMpLm1hcCgoZWxlbWVudCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVN0eWxlKGVsZW1lbnQuaW5uZXJIVE1MLCBzaGFkb3dCb3VuZGFyeSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FjaGVGYWN0b3J5LmZldGNoKHRoaXMucGF0aC5nZXRQYXRoKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpKS50aGVuKChib2R5KSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlU3R5bGUoYm9keSwgc2hhZG93Qm91bmRhcnkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVkVEKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgdGhlIGVsZW1lbnQgbmFtZSBmcm9tIGNvbnZlcnRpbmcgdGhlIEZ1bmN0aW9uIHRvIGEgU3RyaW5nIHZpYSB0aGUgYHRvU3RyaW5nYCBtZXRob2QuIEl0J3Mgd29ydGhcbiAgICAgKiBub3RpbmcgdGhhdCB0aGlzIGlzIHByb2JhYmx5IHRoZSB3ZWFrZXN0IHBhcnQgb2YgdGhlIE1hcGxlIHN5c3RlbSBiZWNhdXNlIGl0IHJlbGllcyBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAqIHRvIGRldGVybWluZSB0aGUgbmFtZSBvZiB0aGUgcmVzdWx0aW5nIGN1c3RvbSBIVE1MIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEVsZW1lbnROYW1lXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldEVsZW1lbnROYW1lKCkge1xuICAgICAgICByZXR1cm4gdXRpbGl0eS50b1NuYWtlQ2FzZSh0aGlzLnNjcmlwdC50b1N0cmluZygpLm1hdGNoKC8oPzpmdW5jdGlvbnxjbGFzcylcXHMqKFthLXpdKykvaSlbMV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFlpZWxkcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgY3VzdG9tIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVnaXN0ZXJlZCBmb3Igb3VyIGN1c3RvbSBSZWFjdCBjb21wb25lbnQuXG4gICAgICogSXQgbGlzdGVucyBmb3Igd2hlbiB0aGUgY3VzdG9tIGVsZW1lbnQgaGFzIGJlZW4gaW5zZXJ0ZWQgaW50byB0aGUgRE9NLCBhbmQgdGhlbiBzZXRzIHVwIHRoZSBzdHlsZXMsIGFwcGxpZXNcbiAgICAgKiBkZWZhdWx0IFJlYWN0IHByb3BlcnRpZXMsIGV0Yy4uLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRFbGVtZW50UHJvdG90eXBlXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRQcm90b3R5cGUoKSB7XG5cbiAgICAgICAgbGV0IGxvYWRTdHlsZXMgPSB0aGlzLmxvYWRTdHlsZXMuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHNjcmlwdCAgICA9IHRoaXMuc2NyaXB0LFxuICAgICAgICAgICAgcGF0aCAgICAgID0gdGhpcy5wYXRoO1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgYXBwbHlEZWZhdWx0UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFwcGx5RGVmYXVsdFByb3BzKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVwbGFjZXIgID0gL15kYXRhLS9pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUubmFtZSA9PT0gdXRpbGl0eS5BVFRSSUJVVEVfUkVBQ1RJRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UocmVwbGFjZXIsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBwcm9wZXJ0aWVzIHRvIHRoZSBjdXN0b20gZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmRlZmF1bHRQcm9wcyA9IHsgcGF0aDogcGF0aCwgZWxlbWVudDogdGhpcy5jbG9uZU5vZGUodHJ1ZSkgfTtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlEZWZhdWx0UHJvcHMuY2FsbCh0aGlzLCB0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCAgICAgID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBSZWFjdC5qcyBjb21wb25lbnQsIGltcG9ydGluZyBpdCB1bmRlciB0aGUgc2hhZG93IGJvdW5kYXJ5LlxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIocmVuZGVyZWRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBldmVudCBkZWxlZ2F0aW9uIGZvciB0aGUgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgICAgICBldmVudHMucmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSW1wb3J0IGV4dGVybmFsIENTUyBkb2N1bWVudHMgYW5kIHJlc29sdmUgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCByZXNvbHZlRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZUVsZW1lbnQoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGxvYWRTdHlsZXMoc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVFbGVtZW50LmFwcGx5KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vQ29tcG9uZW50LmpzJztcbmltcG9ydCB1dGlsaXR5ICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZ2dlciAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nZ2VyLmpzJztcbmltcG9ydCBzZWxlY3RvcnMgZnJvbSAnLi8uLi9oZWxwZXJzL1NlbGVjdG9ycy5qcyc7XG5pbXBvcnQge1N0YXRlTWFuYWdlciwgU3RhdGV9IGZyb20gJy4vU3RhdGVNYW5hZ2VyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kdWxlIGV4dGVuZHMgU3RhdGVNYW5hZ2VyIHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7SFRNTExpbmtFbGVtZW50fSBsaW5rRWxlbWVudFxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihsaW5rRWxlbWVudCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGF0aCAgICAgICA9IHV0aWxpdHkucmVzb2x2ZXIobGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyksIGxpbmtFbGVtZW50LmltcG9ydCkuZGV2ZWxvcG1lbnQ7XG4gICAgICAgIHRoaXMuc3RhdGUgICAgICA9IFN0YXRlLlVOUkVTT0xWRUQ7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgICA9IHsgbGluazogbGlua0VsZW1lbnQgfTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG5cbiAgICAgICAgdGhpcy5sb2FkTW9kdWxlKGxpbmtFbGVtZW50KS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgLy8gVXNlIG9ubHkgdGhlIGZpcnN0IHRlbXBsYXRlLCBiZWNhdXNlIG90aGVyd2lzZSBNYXBsZWlmeSB3aWxsIGhhdmUgYSBkaWZmaWN1bHQgam9iIGF0dGVtcHRpbmdcbiAgICAgICAgICAgIC8vIHRvIHJlc29sdmUgdGhlIHBhdGhzIHdoZW4gdGhlcmUncyBhIG1pc21hdGNoIGJldHdlZW4gdGVtcGxhdGUgZWxlbWVudHMgYW5kIGxpbmsgZWxlbWVudHMuXG4gICAgICAgICAgICAvLyBQUkVWSU9VUzogdGhpcy5nZXRUZW1wbGF0ZXMoKS5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudHMgPSB0aGlzLmdldFRlbXBsYXRlcygpO1xuXG4gICAgICAgICAgICBpZiAodGVtcGxhdGVFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDb21wb25lbnQgXCIke2xpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpfVwiIGlzIGF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIgdHdvIGNvbXBvbmVudHNgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFt0aGlzLmdldFRlbXBsYXRlcygpWzBdXS5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyA9IHNlbGVjdG9ycy5nZXRBbGxTY3JpcHRzKHRlbXBsYXRlRWxlbWVudC5jb250ZW50KTtcblxuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnRzLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcmMgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBhdGguaXNMb2NhbFBhdGgoc3JjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQodGhpcy5wYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVkVEKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgc2V0U3RhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdGVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGxvYWRNb2R1bGVcbiAgICAgKiBAcGFyYW0ge0hUTUxUZW1wbGF0ZUVsZW1lbnR9IHRlbXBsYXRlRWxlbWVudFxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgbG9hZE1vZHVsZSh0ZW1wbGF0ZUVsZW1lbnQpIHtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVklORyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdyZWYnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIHJlc29sdmUodGVtcGxhdGVFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlRWxlbWVudC5pbXBvcnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCByZXNvbHZlKHRlbXBsYXRlRWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGVtcGxhdGVFbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFRlbXBsYXRlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlcygpIHtcblxuICAgICAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMuZWxlbWVudHMubGluay5pbXBvcnQ7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkob3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpKTtcblxuICAgIH1cblxufSIsIi8qKlxuICogQGNvbnN0YW50IFN0YXRlXG4gKiBAdHlwZSB7e1VOUkVTT0xWRUQ6IG51bWJlciwgUkVTT0xWSU5HOiBudW1iZXIsIFJFU09MVkVEOiBudW1iZXJ9fVxuICovXG5leHBvcnQgY29uc3QgU3RhdGUgPSB7IFVOUkVTT0xWRUQ6IDAsIFJFU09MVklORzogMSwgUkVTT0xWRUQ6IDIgfTtcblxuLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIFN0YXRlTWFuYWdlclxuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRlTWFuYWdlciB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcmV0dXJuIHtBYnN0cmFjdH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlLlVOUkVTT0xWRUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBzZXRTdGF0ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0ZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cblxufSJdfQ==
