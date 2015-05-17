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

        var descriptor = this.getDescriptor();

        if (!descriptor.extend) {

            return void document.registerElement(descriptor.name, {
                prototype: this.getElementPrototype()
            });
        }

        var prototype = 'HTML' + descriptor.extend + 'Element';

        document.registerElement(descriptor.name, {
            prototype: Object.create(window[prototype].prototype, this.getElementPrototype()),
            'extends': descriptor.extend.toLowerCase()
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
        key: 'getDescriptor',

        /**
         * Extract the element name, and optionally the element extension, from converting the Function to a String via
         * the `toString` method. It's worth noting that this is probably the weakest part of the Maple system because it
         * relies on a regular expression to determine the name of the resulting custom HTML element.
         *
         * @method getDescriptor
         * @return {Object}
         */
        value: function getDescriptor() {

            var name = this.script.toString().match(/(?:function|class)\s*([a-z_]+)/i)[1],
                extend = null;

            if (~name.indexOf('_')) {

                // Does the element name reference an element to extend?
                var split = name.split('_');
                name = split[0];
                extend = split[1];
            }

            return { name: _helpersUtilityJs2['default'].toSnakeCase(name), extend: extend };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9DYWNoZUZhY3RvcnkuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2dnZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TZWxlY3RvcnMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL0VsZW1lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL01vZHVsZS5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9tb2RlbHMvU3RhdGVNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OEJDQXNCLG9CQUFvQjs7OztpQ0FDcEIsdUJBQXVCOzs7O2tDQUN2Qix3QkFBd0I7Ozs7Z0NBQ3hCLHNCQUFzQjs7OzsrQkFDdEIscUJBQXFCOzs7O0FBRTNDLENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRTs7QUFFL0IsZ0JBQVksQ0FBQzs7QUFFYixRQUFJLE9BQU8sTUFB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O1FBQXJELEtBQUssR0FBTCxLQUFLOzs7Ozs7OztJQVFMLFlBQVk7Ozs7Ozs7QUFNVixXQU5GLFlBQVksR0FNUDswQkFOTCxZQUFZOztBQU9qQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7R0FDakM7O2VBUlEsWUFBWTs7Ozs7Ozs7V0FlYixrQkFBQyxLQUFLLEVBQUU7QUFDWixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O1NBakJRLFlBQVk7OztRQUFaLFlBQVksR0FBWixZQUFZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNb2R1bGUgICAgZnJvbSAnLi9tb2RlbHMvTW9kdWxlLmpzJztcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9tb2RlbHMvQ29tcG9uZW50LmpzJztcbmltcG9ydCBzZWxlY3RvcnMgZnJvbSAnLi9oZWxwZXJzL1NlbGVjdG9ycy5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgIGZyb20gJy4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBldmVudHMgICAgZnJvbSAnLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgICA9ICdiYWJlbCc7XG4gICAgICAgIFN5c3RlbS5iYWJlbE9wdGlvbnMgPSB7IGJsYWNrbGlzdDogW10gfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RhbnQgSEFTX0lOSVRJQVRFRFxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIGxldCBIQVNfSU5JVElBVEVEID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAbW9kdWxlIE1hcGxlXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICAgICAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gICAgICovXG4gICAgY2xhc3MgTWFwbGUge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmZpbmRMaW5rcygpO1xuICAgICAgICAgICAgdGhpcy5maW5kVGVtcGxhdGVzKCk7XG5cbiAgICAgICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgZXZlbnQgZGVsZWdhdGlvbiBtYXBwaW5ncy5cbiAgICAgICAgICAgIGV2ZW50cy5zZXR1cERlbGVnYXRpb24oKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgZXh0ZXJuYWwgbGluayBlbGVtZW50cywgYXMgd2VsbCBhcyB0aGUgaW5saW5lIHRlbXBsYXRlIGVsZW1lbnRzXG4gICAgICAgICAqIHRoYXQgY2FuIGJlIGhhbmRjcmFmdGVkLCBvciBiYWtlZCBpbnRvIHRoZSBIVE1MIGRvY3VtZW50IHdoZW4gY29tcGlsaW5nIGEgcHJvamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBmaW5kTGlua3NcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRMaW5rcygpIHtcblxuICAgICAgICAgICAgc2VsZWN0b3JzLmdldEltcG9ydHMoJGRvY3VtZW50KS5mb3JFYWNoKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtFbGVtZW50LmltcG9ydCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBuZXcgTW9kdWxlKGxpbmtFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gbmV3IE1vZHVsZShsaW5rRWxlbWVudCkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgdGVtcGxhdGUgSFRNTCBlbGVtZW50cyB0aGF0IGNvbnRhaW4gdGhlIGByZWZgIGF0dHJpYnV0ZSB3aGljaFxuICAgICAgICAgKiBpcyB0aGUgY29tcG9uZW50J3Mgb3JpZ2luYWwgcGF0aCBiZWZvcmUgTWFwbGVpZnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgZmluZFRlbXBsYXRlc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZFRlbXBsYXRlcygpIHtcblxuICAgICAgICAgICAgc2VsZWN0b3JzLmdldFRlbXBsYXRlcygkZG9jdW1lbnQpLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gc2VsZWN0b3JzLmdldEFsbFNjcmlwdHModGVtcGxhdGVFbGVtZW50LmNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGxldCByZWYgICAgICAgICAgICA9IHRlbXBsYXRlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICAgICAgICAgIGxldCBwYXRoICAgICAgICAgICA9IHV0aWxpdHkucmVzb2x2ZXIocmVmLCBudWxsKS5wcm9kdWN0aW9uO1xuXG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudHMuZm9yRWFjaCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmlzTG9jYWxQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQocGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaW5pdGlhbGlzZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdGlhbGlzZSgpIHtcblxuICAgICAgICBsZXQgc3RhdGUgICAgICAgPSAkZG9jdW1lbnQucmVhZHlTdGF0ZSxcbiAgICAgICAgICAgIHJlYWR5U3RhdGVzID0gWydpbnRlcmFjdGl2ZScsICdjb21wbGV0ZSddO1xuXG4gICAgICAgIGlmICghSEFTX0lOSVRJQVRFRCAmJiB+cmVhZHlTdGF0ZXMuaW5kZXhPZihzdGF0ZSkpIHtcblxuICAgICAgICAgICAgSEFTX0lOSVRJQVRFRCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIE5vIGRvY3VtZW50cywgbm8gcGVyc29uLlxuICAgICAgICAgICAgbmV3IE1hcGxlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBmb3IgYXN5bmMsIGRlZmVyLCBhbmQgbm9ybWFsIGluY2x1c2lvbi5cbiAgICBpbml0aWFsaXNlKCk7XG4gICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXNlKTtcblxufSkod2luZG93LCBkb2N1bWVudCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJHdpbmRvdykge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgY2FjaGVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGxldCBjYWNoZSA9IHt9O1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzcG9uc2libGUgZm9yIGRlbGVnYXRpbmcgdG8gdGhlIG5hdGl2ZSBgZmV0Y2hgIGZ1bmN0aW9uIChwb2x5ZmlsbCBwcm92aWRlZCksIGJ1dCB3aWxsIGNhY2hlIHRoZVxuICAgICAgICAgKiBpbml0aWFsIHByb21pc2UgaW4gb3JkZXIgZm9yIG90aGVyIGludm9jYXRpb25zIHRvIHRoZSBzYW1lIFVSTCB0byB5aWVsZCB0aGUgc2FtZSBwcm9taXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGZldGNoXG4gICAgICAgICAqIEBwYXJhbSB1cmwge1N0cmluZ31cbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgICAgICovXG4gICAgICAgIGZldGNoKHVybCkge1xuXG4gICAgICAgICAgICBpZiAoY2FjaGVbdXJsXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVt1cmxdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWNoZVt1cmxdID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgICAgIGNhY2hlW3VybF0gPSAkd2luZG93LmZldGNoKHVybCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKSkudGhlbigoYm9keSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJvZHkpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3VybF07XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkod2luZG93KTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHkuanMnO1xuXG4vKipcbiAqIEBtZXRob2Qgb3ZlcnJpZGVTdG9wUHJvcGFnYXRpb25cbiAqIEBzZWU6IGh0dHA6Ly9iaXQubHkvMWRQcHhIbFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuKGZ1bmN0aW9uIG92ZXJyaWRlU3RvcFByb3BhZ2F0aW9uKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBsZXQgb3ZlcnJpZGRlblN0b3AgPSBFdmVudC5wcm90b3R5cGUuc3RvcFByb3BhZ2F0aW9uO1xuXG4gICAgRXZlbnQucHJvdG90eXBlLnN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uIHN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICAgICAgdGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIG92ZXJyaWRkZW5TdG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBjb21wb25lbnRzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIGxldCBjb21wb25lbnRzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZXZlbnROYW1lc1xuICAgICAqIEB0eXBlIHtBcnJheXxudWxsfVxuICAgICAqL1xuICAgIGxldCBldmVudE5hbWVzID0gbnVsbDtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlY3Vyc2l2ZWx5IGRpc2NvdmVyIGEgY29tcG9uZW50IHZpYSBpdHMgUmVhY3QgSUQgdGhhdCBpcyBzZXQgYXMgYSBkYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgKiBvbiBlYWNoIFJlYWN0IGVsZW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgZmluZEJ5SWRcbiAgICAgICAgICogQHBhcmFtIGlkIHtTdHJpbmd9XG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRCeUlkKGlkKSB7XG5cbiAgICAgICAgICAgIGxldCBtb2RlbDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGZpbmRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlZENvbXBvbmVudFxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRDb21wb25lbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmQocmVuZGVyZWRDb21wb25lbnQsIGN1cnJlbnRDb21wb25lbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZENvbXBvbmVudC5fcm9vdE5vZGVJRCA9PT0gaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBiaW5kTW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiBiaW5kTW9kZWwoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHRoaXMuX2N1cnJlbnRFbGVtZW50LnByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogY3VycmVudENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQocmVuZGVyZWRDb21wb25lbnQpKSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSByZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5kKGNoaWxkcmVuW2luZGV4XSwgY3VycmVudENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZmluZChjb21wb25lbnQuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG1vZGVsO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdHJhbnNmb3JtS2V5c1xuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbWFwXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhbnNmb3JtZXI9J3RvTG93ZXJDYXNlJ11cbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdHJhbnNmb3JtS2V5cyhtYXAsIHRyYW5zZm9ybWVyID0gJ3RvTG93ZXJDYXNlJykge1xuXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRNYXAgPSB7fTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMobWFwKS5mb3JFYWNoKGZ1bmN0aW9uIGZvckVhY2goa2V5KSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtZWRNYXBba2V5W3RyYW5zZm9ybWVyXSgpXSA9IG1hcFtrZXldO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZE1hcDtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyQ29tcG9uZW50XG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2Qgc2V0dXBEZWxlZ2F0aW9uXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZXR1cERlbGVnYXRpb24oKSB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGV0ZXJtaW5lcyBhbGwgb2YgdGhlIGV2ZW50IHR5cGVzIHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBicm93c2VyLiBXaWxsIGNhY2hlIHRoZSByZXN1bHRzXG4gICAgICAgICAgICAgKiBvZiB0aGlzIGRpc2NvdmVyeSBmb3IgcGVyZm9ybWFuY2UgYmVuZWZpdHMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHByb3BlcnR5IGV2ZW50c1xuICAgICAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnROYW1lcyB8fCAoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGFFbGVtZW50ICAgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVyICAgID0gL15vbi9pLFxuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWVzID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGtleSBpbiBhRWxlbWVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2gobWF0Y2hlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZXMucHVzaChrZXkucmVwbGFjZShtYXRjaGVyLCAnJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnROYW1lcztcblxuICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50VHlwZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCAoZXZlbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYG9uJHtldmVudC50eXBlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB1dGlsaXR5LnRvQXJyYXkoZXZlbnQucGF0aCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ldGhvZCBgc3RvcFByb3BhZ2F0aW9uYCB3YXMgaW52b2tlZCBvbiB0aGUgY3VycmVudCBldmVudCwgd2hpY2ggcHJldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cyBmcm9tIHByb3BhZ2F0aW5nIGFueSBmdXJ0aGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uZ2V0QXR0cmlidXRlIHx8ICFpdGVtLmhhc0F0dHJpYnV0ZSh1dGlsaXR5LkFUVFJJQlVURV9SRUFDVElEKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudCBlbGVtZW50IGlzIG5vdCBhIHZhbGlkIFJlYWN0IGVsZW1lbnQgYmVjYXVzZSBpdCBkb2Vzbid0IGhhdmUgYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlYWN0IElEIGRhdGEgYXR0cmlidXRlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBdHRlbXB0IHRvIGZpZWxkIHRoZSBjb21wb25lbnQgYnkgdGhlIGFzc29jaWF0ZWQgUmVhY3QgSUQuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLmZpbmRCeUlkKGl0ZW0uZ2V0QXR0cmlidXRlKHV0aWxpdHkuQVRUUklCVVRFX1JFQUNUSUQpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsICYmIG1vZGVsLnByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyYW5zZm9ybSB0aGUgY3VycmVudCBSZWFjdCBldmVudHMgaW50byBsb3dlciBjYXNlIGtleXMsIHNvIHRoYXQgd2UgY2FuIHBhaXIgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwIHdpdGggdGhlIGV2ZW50IHR5cGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZCA9IHRoaXMudHJhbnNmb3JtS2V5cyhtb2RlbC5wcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUgaW4gdHJhbnNmb3JtZWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBkZWZlciB0aGUgaW52b2NhdGlvbiBvZiB0aGUgZXZlbnQgbWV0aG9kLCBiZWNhdXNlIG90aGVyd2lzZSBSZWFjdC5qc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIHJlLXJlbmRlciwgYW5kIHRoZSBSZWFjdCBJRHMgd2lsbCB0aGVuIGJlIFwib3V0IG9mIHN5bmNcIiBmb3IgdGhpcyBldmVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2godHJhbnNmb3JtZWRbZXZlbnROYW1lXS5iaW5kKG1vZGVsLmNvbXBvbmVudCwgZXZlbnQpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEludm9rZSBlYWNoIGZvdW5kIGV2ZW50IGZvciB0aGUgZXZlbnQgdHlwZS5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LmZvckVhY2goKGV2ZW50SW52b2NhdGlvbikgPT4gZXZlbnRJbnZvY2F0aW9uKCkpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKHdpbmRvdy5kb2N1bWVudCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGNvbnNvbGUpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB3YXJuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB3YXJuKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICRjb25zb2xlLmxvZyhgTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6ICM1RjlFQTAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBpbmZvXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBpbmZvKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICRjb25zb2xlLmxvZyhgTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6IGJsdWUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBlcnJvclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3IobWVzc2FnZSkge1xuICAgICAgICAgICAgJGNvbnNvbGUuZXJyb3IoYCVjIE1hcGxlLmpzOiAlYyR7bWVzc2FnZX0uYCwgJ2NvbG9yOiBibGFjaycsICdjb2xvcjogI0NENjA5MCcpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSh3aW5kb3cuY29uc29sZSk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5LmpzJztcblxuLyoqXG4gKiBAbWV0aG9kIHF1ZXJ5QWxsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmxldCBxdWVyeUFsbCA9IGZ1bmN0aW9uIHF1ZXJ5QWxsKGV4cHJlc3Npb24pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KHRoaXMucXVlcnlTZWxlY3RvckFsbChleHByZXNzaW9uKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRDU1NMaW5rc1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldENTU0xpbmtzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeUFsbC5jYWxsKGVsZW1lbnQsICdsaW5rW3R5cGU9XCJ0ZXh0L2Nzc1wiXScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldENTU0lubGluZXNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRDU1NJbmxpbmVzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeUFsbC5jYWxsKGVsZW1lbnQsICdzdHlsZVt0eXBlPVwidGV4dC9jc3NcIl0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRJbXBvcnRzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0SW1wb3J0cyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAnbGlua1tyZWw9XCJpbXBvcnRcIl06bm90KFtkYXRhLWlnbm9yZV0pJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0VGVtcGxhdGVzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VGVtcGxhdGVzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeUFsbC5jYWxsKGVsZW1lbnQsICd0ZW1wbGF0ZVtyZWZdJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0U2NyaXB0c1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFNjcmlwdHMoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5QWxsLmNhbGwoZWxlbWVudCwgJ3NjcmlwdFt0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCJdJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0QWxsU2NyaXB0c1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEFsbFNjcmlwdHMoZWxlbWVudCkge1xuICAgICAgICAgICAgbGV0IGpzeEZpbGVzID0gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAnc2NyaXB0W3R5cGU9XCJ0ZXh0L2pzeFwiXScpO1xuICAgICAgICAgICAgcmV0dXJuIFtdLmNvbmNhdCh1dGlsaXR5LnRvQXJyYXkodGhpcy5nZXRTY3JpcHRzKGVsZW1lbnQpKSwgdXRpbGl0eS50b0FycmF5KGpzeEZpbGVzKSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdGFudCBBVFRSSUJVVEVfUkVBQ1RJRFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgQVRUUklCVVRFX1JFQUNUSUQ6ICdkYXRhLXJlYWN0aWQnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR8bnVsbH0gb3duZXJEb2N1bWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICByZXNvbHZlcih1cmwsIG93bmVyRG9jdW1lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudFBhdGggPSB0aGlzLmdldFBhdGgodXJsKSxcbiAgICAgICAgICAgICAgICBnZXRQYXRoICAgICAgID0gdGhpcy5nZXRQYXRoLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZ2V0TmFtZSAgICAgICA9IHRoaXMuZ2V0TmFtZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVQYXRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IG92ZXJyaWRlRG9jdW1lbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVBhdGgocGF0aCwgb3ZlcnJpZGVEb2N1bWVudCA9ICRkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBhICA9IG92ZXJyaWRlRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgIGEuaHJlZiA9IHBhdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuaHJlZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBwcm9kdWN0aW9uXG4gICAgICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcm9kdWN0aW9uOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXRoKHBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2NhbFBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5nZXRBYnNvbHV0ZVBhdGgoKX0vJHtnZXROYW1lKHBhdGgpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChwYXRoLCAkZG9jdW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0U3JjXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFNyYyhzcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXROYW1lKHNyYyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0QWJzb2x1dGVQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldEFic29sdXRlUGF0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldFJlbGF0aXZlUGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRSZWxhdGl2ZVBhdGgoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGlzTG9jYWxQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBpc0xvY2FsUGF0aChwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISF+cGF0aC5pbmRleE9mKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAcHJvcGVydHkgZGV2ZWxvcG1lbnRcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGRldmVsb3BtZW50OiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXRoKHBhdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2NhbFBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5nZXRBYnNvbHV0ZVBhdGgoKX0vJHtwYXRofWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChwYXRoLCAkZG9jdW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0U3JjXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFNyYyhzcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzcmM7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0QWJzb2x1dGVQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldEFic29sdXRlUGF0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlUGF0aChjb21wb25lbnRQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRSZWxhdGl2ZVBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0UmVsYXRpdmVQYXRoKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudFBhdGg7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgaXNMb2NhbFBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHBhdGgge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlzTG9jYWxQYXRoKHBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBnZXRQYXRoKHJlc29sdmVQYXRoKHBhdGgsIG93bmVyRG9jdW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIX5yZXNvbHZlUGF0aChjb21wb25lbnRQYXRoKS5pbmRleE9mKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20gPyBBcnJheS5mcm9tKGFycmF5TGlrZSkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmbGF0dGVuQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYXJyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IFtnaXZlbkFycj1bXV1cbiAgICAgICAgICovXG4gICAgICAgIGZsYXR0ZW5BcnJheShhcnIsIGdpdmVuQXJyID0gW10pIHtcblxuICAgICAgICAgICAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG4gICAgICAgICAgICBhcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KGl0ZW0pKSAmJiAodGhpcy5mbGF0dGVuQXJyYXkoaXRlbSwgZ2l2ZW5BcnIpKTtcbiAgICAgICAgICAgICAgICAoIUFycmF5LmlzQXJyYXkoaXRlbSkpICYmIChnaXZlbkFyci5wdXNoKGl0ZW0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXG4gICAgICAgICAgICByZXR1cm4gZ2l2ZW5BcnI7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXROYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldE5hbWUoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZW1vdmVFeHRlbnNpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUV4dGVuc2lvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy4nKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkod2luZG93LmRvY3VtZW50KTsiLCJpbXBvcnQgQ3VzdG9tRWxlbWVudCBmcm9tICcuL0VsZW1lbnQuanMnO1xuaW1wb3J0IHV0aWxpdHkgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZ2dlciAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0xvZ2dlci5qcyc7XG5pbXBvcnQge1N0YXRlTWFuYWdlciwgU3RhdGV9IGZyb20gJy4vU3RhdGVNYW5hZ2VyLmpzJztcblxuLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIENvbXBvbmVudFxuICogQGV4dGVuZHMgU3RhdGVNYW5hZ2VyXG4gKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBTdGF0ZU1hbmFnZXIge1xuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGxvYWRpbmcgYW55IHByZXJlcXVpc2l0ZXMgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgZGVsZWdhdGVkIHRvIGVhY2ggYEN1c3RvbUVsZW1lbnRgXG4gICAgICogb2JqZWN0IGZvciBjcmVhdGluZyBhIGN1c3RvbSBlbGVtZW50LCBhbmQgbGFzdGx5IHJlbmRlcmluZyB0aGUgUmVhY3QgY29tcG9uZW50IHRvIHRoZSBkZXNpZ25hdGVkIEhUTUwgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxTY3JpcHRFbGVtZW50fSBzY3JpcHRFbGVtZW50XG4gICAgICogQHJldHVybiB7TW9kdWxlfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGF0aCAgICAgPSBwYXRoO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0geyBzY3JpcHQ6IHNjcmlwdEVsZW1lbnQsIHRlbXBsYXRlOiB0ZW1wbGF0ZUVsZW1lbnQgfTtcblxuICAgICAgICBsZXQgc3JjID0gc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVklORyk7XG5cbiAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBVUkwgb2YgdGhlIGNvbXBvbmVudCBmb3IgRVM2IGBTeXN0ZW0uaW1wb3J0YCwgd2hpY2ggaXMgYWxzbyBwb2x5ZmlsbGVkIGluIGNhc2UgdGhlXG4gICAgICAgIC8vIGN1cnJlbnQgYnJvd3NlciBkb2VzIG5vdCBwcm92aWRlIHN1cHBvcnQgZm9yIGR5bmFtaWMgbW9kdWxlIGxvYWRpbmcuXG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnBhdGguZ2V0UmVsYXRpdmVQYXRoKCl9LyR7dXRpbGl0eS5yZW1vdmVFeHRlbnNpb24oc3JjKX1gO1xuXG4gICAgICAgIGlmIChzcmMuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpID09PSAnanN4Jykge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgbG9nZ2VyLmVycm9yKGBVc2UgSlMgZXh0ZW5zaW9uIGluc3RlYWQgb2YgSlNYIOKAkyBKU1ggY29tcGlsYXRpb24gd2lsbCB3b3JrIGFzIGV4cGVjdGVkYCk7XG4gICAgICAgIH1cblxuICAgICAgICBTeXN0ZW0uaW1wb3J0KGAke3VybH1gKS50aGVuKChpbXBvcnRzKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghaW1wb3J0cy5kZWZhdWx0KSB7XG5cbiAgICAgICAgICAgICAgICAvLyBDb21wb25lbnRzIHRoYXQgZG8gbm90IGhhdmUgYSBkZWZhdWx0IGV4cG9ydCAoaS5lOiBleHBvcnQgZGVmYXVsdCBjbGFzcy4uLikgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGlyZC1wYXJ0eSBzY3JpcHRzIHRoYXQgYXJlIGEgcHJlcmVxdWlzaXRlIG9mIHJlc29sdmluZyB0aGUgY3VzdG9tIGVsZW1lbnQuXG4gICAgICAgICAgICBQcm9taXNlLmFsbCh0aGlzLmxvYWRUaGlyZFBhcnR5U2NyaXB0cygpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgQ3VzdG9tRWxlbWVudChwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQsIGltcG9ydHMuZGVmYXVsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc2NvdmVyIGFsbCBvZiB0aGUgdGhpcmQgcGFydHkgSmF2YVNjcmlwdCBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgcmVxdWlyZWQgdG8gaGF2ZSBiZWVuIGxvYWRlZCBiZWZvcmVcbiAgICAgKiBhdHRlbXB0aW5nIHRvIHJlbmRlciB0aGUgY3VzdG9tIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvYWRUaGlyZFBhcnR5U2NyaXB0c1xuICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgKi9cbiAgICBsb2FkVGhpcmRQYXJ0eVNjcmlwdHMoKSB7XG5cbiAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzICAgID0gdXRpbGl0eS50b0FycmF5KHRoaXMuZWxlbWVudHMudGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXScpKSxcbiAgICAgICAgICAgIHRoaXJkUGFydHlTY3JpcHRzID0gc2NyaXB0RWxlbWVudHMuZmlsdGVyKChzY3JpcHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLnBhdGguaXNMb2NhbFBhdGgoc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlyZFBhcnR5U2NyaXB0cy5tYXAoKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgbGV0IHNyYyAgICAgICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xuICAgICAgICAgICAgc2NyaXB0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiaW1wb3J0IGV2ZW50cyAgICAgICBmcm9tICcuLy4uL2hlbHBlcnMvRXZlbnRzLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGNhY2hlRmFjdG9yeSBmcm9tICcuLy4uL2hlbHBlcnMvQ2FjaGVGYWN0b3J5LmpzJztcbmltcG9ydCBzZWxlY3RvcnMgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1NlbGVjdG9ycy5qcyc7XG5pbXBvcnQge1N0YXRlTWFuYWdlciwgU3RhdGV9IGZyb20gJy4vU3RhdGVNYW5hZ2VyLmpzJztcblxuLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIEN1c3RvbUVsZW1lbnRcbiAqIEBleHRlbmRzIFN0YXRlTWFuYWdlclxuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRWxlbWVudCBleHRlbmRzIFN0YXRlTWFuYWdlciB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxUZW1wbGF0ZUVsZW1lbnR9IHRlbXBsYXRlRWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRTY3JpcHRcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCwgaW1wb3J0U2NyaXB0KSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXRoICAgICA9IHBhdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB7IHNjcmlwdDogc2NyaXB0RWxlbWVudCwgdGVtcGxhdGU6IHRlbXBsYXRlRWxlbWVudCB9O1xuICAgICAgICB0aGlzLnNjcmlwdCAgID0gaW1wb3J0U2NyaXB0O1xuXG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gdGhpcy5nZXREZXNjcmlwdG9yKCk7XG5cbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yLmV4dGVuZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gdm9pZCBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZGVzY3JpcHRvci5uYW1lLCB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlOiB0aGlzLmdldEVsZW1lbnRQcm90b3R5cGUoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcm90b3R5cGUgPSBgSFRNTCR7ZGVzY3JpcHRvci5leHRlbmR9RWxlbWVudGA7XG5cbiAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGRlc2NyaXB0b3IubmFtZSwge1xuICAgICAgICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKHdpbmRvd1twcm90b3R5cGVdLnByb3RvdHlwZSwgdGhpcy5nZXRFbGVtZW50UHJvdG90eXBlKCkpLFxuICAgICAgICAgICAgZXh0ZW5kczogZGVzY3JpcHRvci5leHRlbmQudG9Mb3dlckNhc2UoKVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIGFzc29jaWF0ZWQgc3R5bGVzIGludG8gZWl0aGVyIHRoZSBzaGFkb3cgRE9NLCBpZiB0aGUgcGF0aCBpcyBkZXRlcm1pbmVkIHRvIGJlIGxvY2FsXG4gICAgICogdG8gdGhlIGNvbXBvbmVudCwgb3IgZ2xvYmFsbHkgaWYgbm90LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkU3R5bGVzXG4gICAgICogQHBhcmFtIHtTaGFkb3dSb290fSBzaGFkb3dCb3VuZGFyeVxuICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgKi9cbiAgICBsb2FkU3R5bGVzKHNoYWRvd0JvdW5kYXJ5KSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgY3JlYXRlU3R5bGVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAgICAgICAgICogQHBhcmFtIHtTaGFkb3dSb290fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlU3R5bGUoYm9keSwgZWxlbWVudCA9IHNoYWRvd0JvdW5kYXJ5KSB7XG4gICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBib2R5O1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIGxldCBjb250ZW50ICAgICAgID0gdGhpcy5lbGVtZW50cy50ZW1wbGF0ZS5jb250ZW50O1xuICAgICAgICBsZXQgbGlua0VsZW1lbnRzICA9IHNlbGVjdG9ycy5nZXRDU1NMaW5rcyhjb250ZW50KTtcbiAgICAgICAgbGV0IHN0eWxlRWxlbWVudHMgPSBzZWxlY3RvcnMuZ2V0Q1NTSW5saW5lcyhjb250ZW50KTtcbiAgICAgICAgbGV0IHByb21pc2VzICAgICAgPSBbXS5jb25jYXQobGlua0VsZW1lbnRzLCBzdHlsZUVsZW1lbnRzKS5tYXAoKGVsZW1lbnQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVTdHlsZShlbGVtZW50LmlubmVySFRNTCwgc2hhZG93Qm91bmRhcnkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhY2hlRmFjdG9yeS5mZXRjaCh0aGlzLnBhdGguZ2V0UGF0aChlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKSkudGhlbigoYm9keSkgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVN0eWxlKGJvZHksIHNoYWRvd0JvdW5kYXJ5KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IHRoZSBlbGVtZW50IG5hbWUsIGFuZCBvcHRpb25hbGx5IHRoZSBlbGVtZW50IGV4dGVuc2lvbiwgZnJvbSBjb252ZXJ0aW5nIHRoZSBGdW5jdGlvbiB0byBhIFN0cmluZyB2aWFcbiAgICAgKiB0aGUgYHRvU3RyaW5nYCBtZXRob2QuIEl0J3Mgd29ydGggbm90aW5nIHRoYXQgdGhpcyBpcyBwcm9iYWJseSB0aGUgd2Vha2VzdCBwYXJ0IG9mIHRoZSBNYXBsZSBzeXN0ZW0gYmVjYXVzZSBpdFxuICAgICAqIHJlbGllcyBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkZXRlcm1pbmUgdGhlIG5hbWUgb2YgdGhlIHJlc3VsdGluZyBjdXN0b20gSFRNTCBlbGVtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXREZXNjcmlwdG9yXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlc2NyaXB0b3IoKSB7XG5cbiAgICAgICAgbGV0IG5hbWUgICA9IHRoaXMuc2NyaXB0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel9dKykvaSlbMV0sXG4gICAgICAgICAgICBleHRlbmQgPSBudWxsO1xuXG4gICAgICAgIGlmICh+bmFtZS5pbmRleE9mKCdfJykpIHtcblxuICAgICAgICAgICAgLy8gRG9lcyB0aGUgZWxlbWVudCBuYW1lIHJlZmVyZW5jZSBhbiBlbGVtZW50IHRvIGV4dGVuZD9cbiAgICAgICAgICAgIGxldCBzcGxpdCA9IG5hbWUuc3BsaXQoJ18nKTtcbiAgICAgICAgICAgIG5hbWUgICAgICA9IHNwbGl0WzBdO1xuICAgICAgICAgICAgZXh0ZW5kICAgID0gc3BsaXRbMV07XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IG5hbWU6IHV0aWxpdHkudG9TbmFrZUNhc2UobmFtZSksIGV4dGVuZDogZXh0ZW5kIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBZaWVsZHMgdGhlIHByb3RvdHlwZSBmb3IgdGhlIGN1c3RvbSBIVE1MIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlZ2lzdGVyZWQgZm9yIG91ciBjdXN0b20gUmVhY3QgY29tcG9uZW50LlxuICAgICAqIEl0IGxpc3RlbnMgZm9yIHdoZW4gdGhlIGN1c3RvbSBlbGVtZW50IGhhcyBiZWVuIGluc2VydGVkIGludG8gdGhlIERPTSwgYW5kIHRoZW4gc2V0cyB1cCB0aGUgc3R5bGVzLCBhcHBsaWVzXG4gICAgICogZGVmYXVsdCBSZWFjdCBwcm9wZXJ0aWVzLCBldGMuLi5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0RWxlbWVudFByb3RvdHlwZVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRFbGVtZW50UHJvdG90eXBlKCkge1xuXG4gICAgICAgIGxldCBsb2FkU3R5bGVzID0gdGhpcy5sb2FkU3R5bGVzLmJpbmQodGhpcyksXG4gICAgICAgICAgICBzY3JpcHQgICAgPSB0aGlzLnNjcmlwdCxcbiAgICAgICAgICAgIHBhdGggICAgICA9IHRoaXMucGF0aDtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGFwcGx5RGVmYXVsdFByb3BzXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBhcHBseURlZmF1bHRQcm9wcyhhdHRyaWJ1dGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcGxhY2VyICA9IC9eZGF0YS0vaTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLm5hbWUgPT09IHV0aWxpdHkuQVRUUklCVVRFX1JFQUNUSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKHJlcGxhY2VyLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHNbbmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwbHkgcHJvcGVydGllcyB0byB0aGUgY3VzdG9tIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RGVmYXVsdFByb3BzLmNhbGwodGhpcywgdGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgICAgICA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgUmVhY3QuanMgY29tcG9uZW50LCBpbXBvcnRpbmcgaXQgdW5kZXIgdGhlIHNoYWRvdyBib3VuZGFyeS5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkRWxlbWVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoc2NyaXB0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gUmVhY3QucmVuZGVyKHJlbmRlcmVkRWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgZXZlbnQgZGVsZWdhdGlvbiBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnJlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEltcG9ydCBleHRlcm5hbCBDU1MgZG9jdW1lbnRzIGFuZCByZXNvbHZlIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgcmVzb2x2ZUVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJlc29sdmVFbGVtZW50KCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChsb2FkU3R5bGVzKHNoYWRvd1Jvb3QpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdyZXNvbHZlZCcsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlRWxlbWVudC5hcHBseSh0aGlzKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2dnZXIgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0xvZ2dlci5qcyc7XG5pbXBvcnQgc2VsZWN0b3JzIGZyb20gJy4vLi4vaGVscGVycy9TZWxlY3RvcnMuanMnO1xuaW1wb3J0IHtTdGF0ZU1hbmFnZXIsIFN0YXRlfSBmcm9tICcuL1N0YXRlTWFuYWdlci5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZHVsZSBleHRlbmRzIFN0YXRlTWFuYWdlciB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0hUTUxMaW5rRWxlbWVudH0gbGlua0VsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGlua0VsZW1lbnQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgICAgPSB1dGlsaXR5LnJlc29sdmVyKGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpLCBsaW5rRWxlbWVudC5pbXBvcnQpLmRldmVsb3BtZW50O1xuICAgICAgICB0aGlzLnN0YXRlICAgICAgPSBTdGF0ZS5VTlJFU09MVkVEO1xuICAgICAgICB0aGlzLmVsZW1lbnRzICAgPSB7IGxpbms6IGxpbmtFbGVtZW50IH07XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIHRoaXMubG9hZE1vZHVsZShsaW5rRWxlbWVudCkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIFVzZSBvbmx5IHRoZSBmaXJzdCB0ZW1wbGF0ZSwgYmVjYXVzZSBvdGhlcndpc2UgTWFwbGVpZnkgd2lsbCBoYXZlIGEgZGlmZmljdWx0IGpvYiBhdHRlbXB0aW5nXG4gICAgICAgICAgICAvLyB0byByZXNvbHZlIHRoZSBwYXRocyB3aGVuIHRoZXJlJ3MgYSBtaXNtYXRjaCBiZXR3ZWVuIHRlbXBsYXRlIGVsZW1lbnRzIGFuZCBsaW5rIGVsZW1lbnRzLlxuICAgICAgICAgICAgLy8gUFJFVklPVVM6IHRoaXMuZ2V0VGVtcGxhdGVzKCkuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnRzID0gdGhpcy5nZXRUZW1wbGF0ZXMoKTtcblxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ29tcG9uZW50IFwiJHtsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1cIiBpcyBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIHR3byBjb21wb25lbnRzYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBbdGhpcy5nZXRUZW1wbGF0ZXMoKVswXV0uZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSBzZWxlY3RvcnMuZ2V0QWxsU2NyaXB0cyh0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cy5tYXAoKHNjcmlwdEVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc3JjID0gc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wYXRoLmlzTG9jYWxQYXRoKHNyYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KHRoaXMucGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHNldFN0YXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXRlXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2FkTW9kdWxlXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIGxvYWRNb2R1bGUodGVtcGxhdGVFbGVtZW50KSB7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAodGVtcGxhdGVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncmVmJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCByZXNvbHZlKHRlbXBsYXRlRWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZUVsZW1lbnQuaW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgcmVzb2x2ZSh0ZW1wbGF0ZUVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRlbXBsYXRlRWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRUZW1wbGF0ZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZXMoKSB7XG5cbiAgICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsZW1lbnRzLmxpbmsuaW1wb3J0O1xuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKSk7XG5cbiAgICB9XG5cbn0iLCIvKipcbiAqIEBjb25zdGFudCBTdGF0ZVxuICogQHR5cGUge3tVTlJFU09MVkVEOiBudW1iZXIsIFJFU09MVklORzogbnVtYmVyLCBSRVNPTFZFRDogbnVtYmVyfX1cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXRlID0geyBVTlJFU09MVkVEOiAwLCBSRVNPTFZJTkc6IDEsIFJFU09MVkVEOiAyIH07XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBTdGF0ZU1hbmFnZXJcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0ZU1hbmFnZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHJldHVybiB7QWJzdHJhY3R9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5VTlJFU09MVkVEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgc2V0U3RhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdGVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG5cbn0iXX0=
