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

var _helpersLoggerJs = require('./helpers/Logger.js');

var _helpersLoggerJs2 = _interopRequireDefault(_helpersLoggerJs);

var _helpersEventsJs = require('./helpers/Events.js');

var _helpersEventsJs2 = _interopRequireDefault(_helpersEventsJs);

var _helpersOptionsJs = require('./helpers/Options.js');

var _helpersOptionsJs2 = _interopRequireDefault(_helpersOptionsJs);

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

            // Listen for any changes to the DOM where HTML imports can be dynamically imported
            // into the document.
            this.observeMutations();
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
                var _this = this;

                _helpersSelectorsJs2['default'].getImports($document).forEach(function (linkElement) {
                    return _this.waitForLinkElement(linkElement);
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
        }, {
            key: 'waitForLinkElement',

            /**
             * @method waitForLinkElement
             * @param {HTMLLinkElement} linkElement
             * @return {void}
             */
            value: function waitForLinkElement(linkElement) {

                if (linkElement['import']) {
                    return void new _modelsModuleJs2['default'](linkElement);
                }

                new Promise(function (resolve, reject) {

                    linkElement.addEventListener('load', function () {
                        return resolve(linkElement);
                    });

                    var href = linkElement.getAttribute('href'),
                        errorMessage = 'Timeout of ' + _helpersOptionsJs2['default'].RESOLVE_TIMEOUT / 1000 + ' seconds exceeded whilst waiting for HTML import: "' + href + '"';
                    _helpersUtilityJs2['default'].resolveTimeout(errorMessage, reject);
                }).then(function (linkElement) {
                    return new _modelsModuleJs2['default'](linkElement);
                }, function (message) {
                    return _helpersLoggerJs2['default'].error(message);
                });
            }
        }, {
            key: 'observeMutations',

            /**
             * Listens for changes to the `HTMLHeadElement` node and registers any new imports that are
             * dynamically imported into the document.
             *
             * @method observeMutations
             * @return {void}
             */
            value: function observeMutations() {
                var _this2 = this;

                var observer = new MutationObserver(function (mutations) {

                    mutations.forEach(function (mutation) {

                        var addedNodes = _helpersUtilityJs2['default'].toArray(mutation.addedNodes);

                        addedNodes.forEach(function (node) {

                            if (_helpersUtilityJs2['default'].isHTMLImport(node)) {
                                _this2.waitForLinkElement(node);
                            }
                        });
                    });
                });

                observer.observe($document.head, { childList: true });
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

},{"./helpers/Events.js":3,"./helpers/Logger.js":4,"./helpers/Options.js":5,"./helpers/Selectors.js":6,"./helpers/Utility.js":7,"./models/Component.js":8,"./models/Module.js":10}],2:[function(require,module,exports){
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

                $window.fetch(url).then(function (response) {
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

},{"./Utility.js":7}],4:[function(require,module,exports){
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
            $console.log('%cMaple.js: %c' + message + '.', 'color: rgba(0, 0, 0, .5)', 'color: #5F9EA0');
        },

        /**
         * @method info
         * @param {String} message
         * @return {void}
         */
        info: function info(message) {
            $console.log('%cMaple.js: %c' + message + '.', 'color: rgba(0, 0, 0, .5)', 'color: #008DDB');
        },

        /**
         * @method error
         * @param {String} message
         * @return {void}
         */
        error: function error(message) {
            $console.log('%cMaple.js: %c' + message + '.', 'color: rgba(0, 0, 0, .5)', 'color: #CD6090');
        }

    };
})(window.console);

module.exports = exports['default'];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = (function main() {

    "use strict";

    return {

        /**
         * @constant RESOLVE_TIMEOUT
         * @type {Number}
         * @default 60000
         */
        RESOLVE_TIMEOUT: 60000

    };
})();

module.exports = exports["default"];

},{}],6:[function(require,module,exports){
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
            return queryAll.call(element, "link[type=\"text/css\"],link[type=\"text/scss\"]");
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

},{"./Utility.js":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _LoggerJs = require('./Logger.js');

var _LoggerJs2 = _interopRequireDefault(_LoggerJs);

var _OptionsJs = require('./Options.js');

var _OptionsJs2 = _interopRequireDefault(_OptionsJs);

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
        },

        /**
         * @method isHTMLImport
         * @param {HTMLElement} htmlElement
         * @return {Boolean}
         */
        isHTMLImport: function isHTMLImport(htmlElement) {

            var isInstance = htmlElement instanceof HTMLLinkElement,
                isImport = String(htmlElement.getAttribute('rel')).toLowerCase() === 'import',
                hasHrefAttr = htmlElement.hasAttribute('href'),
                hasTypeHtml = String(htmlElement.getAttribute('type')).toLowerCase() === 'text/html';

            return isInstance && isImport && hasHrefAttr && hasTypeHtml;
        },

        /**
         * @method resolveTimeout
         * @param {String} errorMessage
         * @param {Function} reject
         * @return {void}
         */
        resolveTimeout: function resolveTimeout(errorMessage, reject) {
            setTimeout(function () {
                return reject(errorMessage);
            }, _OptionsJs2['default'].RESOLVE_TIMEOUT);
        },

        /**
         * @method tryRegisterElement
         * @param {String} name
         * @param {Object} properties
         * @return {void}
         */
        tryRegisterElement: function tryRegisterElement(name, properties) {

            /**
             * @constant ERROR_MAP
             * @type {Object}
             */
            var ERROR_MAP = {
                'A type with that name is already registered': 'Custom element "' + name + '" has already been registered',
                'The type name is invalid': 'Element name ' + name + ' is invalid and must consist of at least one hyphen'
            };

            try {

                $document.registerElement(name, properties);
            } catch (e) {

                var errorData = Object.keys(ERROR_MAP).map(function (error) {

                    var regExp = new RegExp(error, 'i');

                    if (e.message.match(regExp)) {
                        _LoggerJs2['default'].error(ERROR_MAP[error]);
                        return true;
                    }

                    return false;
                });

                if (!errorData.some(function (model) {
                    return model;
                })) {
                    throw e;
                }
            }
        }

    };
})(window.document);

module.exports = exports['default'];

},{"./Logger.js":4,"./Options.js":5}],8:[function(require,module,exports){
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

var _helpersOptionsJs = require('./../helpers/Options.js');

var _helpersOptionsJs2 = _interopRequireDefault(_helpersOptionsJs);

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
            }, function (message) {
                return _helpersLoggerJs2['default'].error(message);
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

                return new Promise(function (resolve, reject) {

                    scriptElement.addEventListener('load', function () {
                        return resolve();
                    });
                    document.head.appendChild(scriptElement);

                    var href = scriptElement.getAttribute('src'),
                        errorMessage = 'Timeout of ' + _helpersOptionsJs2['default'].RESOLVE_TIMEOUT / 1000 + ' seconds exceeded whilst waiting for third-party script: "' + href + '"';
                    _helpersUtilityJs2['default'].resolveTimeout(errorMessage, reject);
                });
            });
        }
    }]);

    return Component;
})(_StateManagerJs.StateManager);

exports['default'] = Component;
module.exports = exports['default'];

},{"./../helpers/Logger.js":4,"./../helpers/Options.js":5,"./../helpers/Utility.js":7,"./Element.js":9,"./StateManager.js":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _helpersEventsJs = require('./../helpers/Events.js');

var _helpersEventsJs2 = _interopRequireDefault(_helpersEventsJs);

var _helpersUtilityJs = require('./../helpers/Utility.js');

var _helpersUtilityJs2 = _interopRequireDefault(_helpersUtilityJs);

var _helpersLoggerJs = require('./../helpers/Logger.js');

var _helpersLoggerJs2 = _interopRequireDefault(_helpersLoggerJs);

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
        this.sass = typeof Sass === 'undefined' ? null : new Sass();
        this.elements = { script: scriptElement, template: templateElement };
        this.script = importScript;

        var descriptor = this.getDescriptor();

        if (!descriptor.extend) {

            return void _helpersUtilityJs2['default'].tryRegisterElement(descriptor.name, {
                prototype: this.getElementPrototype()
            });
        }

        var prototype = 'HTML' + descriptor.extend + 'Element';

        _helpersUtilityJs2['default'].tryRegisterElement(descriptor.name, {
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
             * @method addCSS
             * @param {String} body
             * @return {void}
             */
            function addCSS(body) {
                var styleElement = document.createElement('style');
                styleElement.setAttribute('type', 'text/css');
                styleElement.innerHTML = body;
                shadowBoundary.appendChild(styleElement);
            }

            this.setState(_StateManagerJs.State.RESOLVING);

            var content = this.elements.template.content;
            var linkElements = _helpersSelectorsJs2['default'].getCSSLinks(content);
            var styleElements = _helpersSelectorsJs2['default'].getCSSInlines(content);
            var promises = [].concat(linkElements, styleElements).map(function (element) {
                return new Promise(function (resolve) {

                    if (element.nodeName.toLowerCase() === 'style') {
                        addCSS(element.innerHTML);
                        resolve(element.innerHTML);
                        return;
                    }

                    _helpersCacheFactoryJs2['default'].fetch(_this.path.getPath(element.getAttribute('href'))).then(function (body) {

                        if (element.getAttribute('type') === 'text/scss') {

                            if (!_this.sass) {
                                _helpersLoggerJs2['default'].error('You should include "sass.js" for development runtime SASS compilation');
                                return void reject();
                            }

                            _helpersLoggerJs2['default'].warn('All of your SASS documents should be compiled to CSS for production via your build process');

                            // Compile SCSS document into CSS prior to appending it to the body.
                            return void _this.sass.compile(body, function (response) {
                                addCSS(response.text);
                                resolve(response.text);
                            });
                        }

                        addCSS(body);
                        resolve(body);
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

            // With ES6 the `Function.prototype.name` property is beginning to be standardised, which means
            // in many cases we won't have to resort to the feeble `toString` approach. Hoorah!
            var name = this.script.name || this.script.toString().match(/(?:function|class)\s*([a-z_]+)/i)[1],
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

},{"./../helpers/CacheFactory.js":2,"./../helpers/Events.js":3,"./../helpers/Logger.js":4,"./../helpers/Selectors.js":6,"./../helpers/Utility.js":7,"./StateManager.js":11}],10:[function(require,module,exports){
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

var _helpersOptionsJs = require('./../helpers/Options.js');

var _helpersOptionsJs2 = _interopRequireDefault(_helpersOptionsJs);

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
        }, function (message) {
            return _helpersLoggerJs2['default'].error(message);
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
         * @param {HTMLTemplateElement} linkElement
         * @return {Promise}
         */
        value: function loadModule(linkElement) {

            this.setState(_StateManagerJs.State.RESOLVING);

            return new Promise(function (resolve, reject) {

                if (linkElement.hasAttribute('ref')) {
                    return void resolve(linkElement);
                }

                if (linkElement['import']) {
                    return void resolve(linkElement);
                }

                linkElement.addEventListener('load', function () {
                    return resolve(linkElement);
                });

                var href = linkElement.getAttribute('href'),
                    errorMessage = 'Timeout of ' + _helpersOptionsJs2['default'].RESOLVE_TIMEOUT / 1000 + ' seconds exceeded whilst waiting for HTML import: "' + href + '"';
                _helpersUtilityJs2['default'].resolveTimeout(errorMessage, reject);
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

},{"./../helpers/Logger.js":4,"./../helpers/Options.js":5,"./../helpers/Selectors.js":6,"./../helpers/Utility.js":7,"./Component.js":8,"./StateManager.js":11}],11:[function(require,module,exports){
/**
 * @constant State
 * @type {{UNRESOLVED: number, RESOLVING: number, RESOLVED: number}}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9DYWNoZUZhY3RvcnkuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2dnZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9PcHRpb25zLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvU2VsZWN0b3JzLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvVXRpbGl0eS5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9tb2RlbHMvQ29tcG9uZW50LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9FbGVtZW50LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Nb2R1bGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL1N0YXRlTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OzhCQ0FzQixvQkFBb0I7Ozs7aUNBQ3BCLHVCQUF1Qjs7OztrQ0FDdkIsd0JBQXdCOzs7O2dDQUN4QixzQkFBc0I7Ozs7K0JBQ3RCLHFCQUFxQjs7OzsrQkFDckIscUJBQXFCOzs7O2dDQUNy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QUMsV0FBVyxDQUFDLENBQUM7aUJBQ3BDOztBQUVELDJCQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFOzJCQUFNLE9BQU8sQ0FBQyxXQUFXLENBQUM7aUJBQUEsQ0FBQyxDQUFDOztBQUVqRSxvQkFBSSxJQUFJLEdBQVcsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7b0JBQy9DLFlBQVksbUJBQWlCLDhCQUFRLGVBQWUsR0FBRyxJQUFJLDJEQUFzRCxJQUFJLE1BQUcsQ0FBQztBQUM3SCw4Q0FBUSxjQUFjLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBRWhELENBQUMsQ0FBQztTQUVOOzs7Ozs7OztlQU1XLHdCQUFHOztBQUVYLGdCQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksVUFBTyxDQUFDO0FBQzlDLG1CQUFPLDhCQUFRLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUV0RTs7O1dBcEdnQixNQUFNO21CQUZuQixZQUFZOztxQkFFQyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIcEIsSUFBTSxLQUFLLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDOztRQUFyRCxLQUFLLEdBQUwsS0FBSzs7Ozs7Ozs7SUFRTCxZQUFZOzs7Ozs7O0FBTVYsV0FORixZQUFZLEdBTVA7MEJBTkwsWUFBWTs7QUFPakIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0dBQ2pDOztlQVJRLFlBQVk7Ozs7Ozs7O1dBZWIsa0JBQUMsS0FBSyxFQUFFO0FBQ1osVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDdEI7OztTQWpCUSxZQUFZOzs7UUFBWixZQUFZLEdBQVosWUFBWSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTW9kdWxlICAgIGZyb20gJy4vbW9kZWxzL01vZHVsZS5qcyc7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vbW9kZWxzL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgc2VsZWN0b3JzIGZyb20gJy4vaGVscGVycy9TZWxlY3RvcnMuanMnO1xuaW1wb3J0IHV0aWxpdHkgICBmcm9tICcuL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgbG9nZ2VyICAgIGZyb20gJy4vaGVscGVycy9Mb2dnZXIuanMnO1xuaW1wb3J0IGV2ZW50cyAgICBmcm9tICcuL2hlbHBlcnMvRXZlbnRzLmpzJztcbmltcG9ydCBvcHRpb25zICAgZnJvbSAnLi9oZWxwZXJzL09wdGlvbnMuanMnO1xuXG4oZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKHR5cGVvZiBTeXN0ZW0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIFN5c3RlbS50cmFuc3BpbGVyICAgPSAnYmFiZWwnO1xuICAgICAgICBTeXN0ZW0uYmFiZWxPcHRpb25zID0geyBibGFja2xpc3Q6IFtdIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IEhBU19JTklUSUFURURcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBsZXQgSEFTX0lOSVRJQVRFRCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5maW5kTGlua3MoKTtcbiAgICAgICAgICAgIHRoaXMuZmluZFRlbXBsYXRlcygpO1xuXG4gICAgICAgICAgICAvLyBDb25maWd1cmUgdGhlIGV2ZW50IGRlbGVnYXRpb24gbWFwcGluZ3MuXG4gICAgICAgICAgICBldmVudHMuc2V0dXBEZWxlZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIC8vIExpc3RlbiBmb3IgYW55IGNoYW5nZXMgdG8gdGhlIERPTSB3aGVyZSBIVE1MIGltcG9ydHMgY2FuIGJlIGR5bmFtaWNhbGx5IGltcG9ydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC5cbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZU11dGF0aW9ucygpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBleHRlcm5hbCBsaW5rIGVsZW1lbnRzLCBhcyB3ZWxsIGFzIHRoZSBpbmxpbmUgdGVtcGxhdGUgZWxlbWVudHNcbiAgICAgICAgICogdGhhdCBjYW4gYmUgaGFuZGNyYWZ0ZWQsIG9yIGJha2VkIGludG8gdGhlIEhUTUwgZG9jdW1lbnQgd2hlbiBjb21waWxpbmcgYSBwcm9qZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRMaW5rc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZExpbmtzKCkge1xuXG4gICAgICAgICAgICBzZWxlY3RvcnMuZ2V0SW1wb3J0cygkZG9jdW1lbnQpLmZvckVhY2goKGxpbmtFbGVtZW50KSA9PiB0aGlzLndhaXRGb3JMaW5rRWxlbWVudChsaW5rRWxlbWVudCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSB0ZW1wbGF0ZSBIVE1MIGVsZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgYHJlZmAgYXR0cmlidXRlIHdoaWNoXG4gICAgICAgICAqIGlzIHRoZSBjb21wb25lbnQncyBvcmlnaW5hbCBwYXRoIGJlZm9yZSBNYXBsZWlmeS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBmaW5kVGVtcGxhdGVzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kVGVtcGxhdGVzKCkge1xuXG4gICAgICAgICAgICBzZWxlY3RvcnMuZ2V0VGVtcGxhdGVzKCRkb2N1bWVudCkuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudHMgPSBzZWxlY3RvcnMuZ2V0QWxsU2NyaXB0cyh0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCk7XG4gICAgICAgICAgICAgICAgbGV0IHJlZiAgICAgICAgICAgID0gdGVtcGxhdGVFbGVtZW50LmdldEF0dHJpYnV0ZSgncmVmJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBhdGggICAgICAgICAgID0gdXRpbGl0eS5yZXNvbHZlcihyZWYsIG51bGwpLnByb2R1Y3Rpb247XG5cbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cy5mb3JFYWNoKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdGguaXNMb2NhbFBhdGgoc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHdhaXRGb3JMaW5rRWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxMaW5rRWxlbWVudH0gbGlua0VsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHdhaXRGb3JMaW5rRWxlbWVudChsaW5rRWxlbWVudCkge1xuXG4gICAgICAgICAgICBpZiAobGlua0VsZW1lbnQuaW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgbmV3IE1vZHVsZShsaW5rRWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiByZXNvbHZlKGxpbmtFbGVtZW50KSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgaHJlZiAgICAgICAgID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBUaW1lb3V0IG9mICR7b3B0aW9ucy5SRVNPTFZFX1RJTUVPVVQgLyAxMDAwfSBzZWNvbmRzIGV4Y2VlZGVkIHdoaWxzdCB3YWl0aW5nIGZvciBIVE1MIGltcG9ydDogXCIke2hyZWZ9XCJgO1xuICAgICAgICAgICAgICAgIHV0aWxpdHkucmVzb2x2ZVRpbWVvdXQoZXJyb3JNZXNzYWdlLCByZWplY3QpO1xuXG4gICAgICAgICAgICB9KS50aGVuKChsaW5rRWxlbWVudCkgPT4gbmV3IE1vZHVsZShsaW5rRWxlbWVudCksIChtZXNzYWdlKSA9PiBsb2dnZXIuZXJyb3IobWVzc2FnZSkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTGlzdGVucyBmb3IgY2hhbmdlcyB0byB0aGUgYEhUTUxIZWFkRWxlbWVudGAgbm9kZSBhbmQgcmVnaXN0ZXJzIGFueSBuZXcgaW1wb3J0cyB0aGF0IGFyZVxuICAgICAgICAgKiBkeW5hbWljYWxseSBpbXBvcnRlZCBpbnRvIHRoZSBkb2N1bWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBvYnNlcnZlTXV0YXRpb25zXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBvYnNlcnZlTXV0YXRpb25zKCkge1xuXG4gICAgICAgICAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgYWRkZWROb2RlcyA9IHV0aWxpdHkudG9BcnJheShtdXRhdGlvbi5hZGRlZE5vZGVzKTtcblxuICAgICAgICAgICAgICAgICAgICBhZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWxpdHkuaXNIVE1MSW1wb3J0KG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53YWl0Rm9yTGlua0VsZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSgkZG9jdW1lbnQuaGVhZCwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBpbml0aWFsaXNlXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0aWFsaXNlKCkge1xuXG4gICAgICAgIGxldCBzdGF0ZSAgICAgICA9ICRkb2N1bWVudC5yZWFkeVN0YXRlLFxuICAgICAgICAgICAgcmVhZHlTdGF0ZXMgPSBbJ2ludGVyYWN0aXZlJywgJ2NvbXBsZXRlJ107XG5cbiAgICAgICAgaWYgKCFIQVNfSU5JVElBVEVEICYmIH5yZWFkeVN0YXRlcy5pbmRleE9mKHN0YXRlKSkge1xuXG4gICAgICAgICAgICBIQVNfSU5JVElBVEVEID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gTm8gZG9jdW1lbnRzLCBubyBwZXJzb24uXG4gICAgICAgICAgICBuZXcgTWFwbGUoKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBTdXBwb3J0IGZvciBhc3luYywgZGVmZXIsIGFuZCBub3JtYWwgaW5jbHVzaW9uLlxuICAgIGluaXRpYWxpc2UoKTtcbiAgICAkZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRpYWxpc2UpO1xuXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkd2luZG93KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBjYWNoZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgbGV0IGNhY2hlID0ge307XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNwb25zaWJsZSBmb3IgZGVsZWdhdGluZyB0byB0aGUgbmF0aXZlIGBmZXRjaGAgZnVuY3Rpb24gKHBvbHlmaWxsIHByb3ZpZGVkKSwgYnV0IHdpbGwgY2FjaGUgdGhlXG4gICAgICAgICAqIGluaXRpYWwgcHJvbWlzZSBpbiBvcmRlciBmb3Igb3RoZXIgaW52b2NhdGlvbnMgdG8gdGhlIHNhbWUgVVJMIHRvIHlpZWxkIHRoZSBzYW1lIHByb21pc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgZmV0Y2hcbiAgICAgICAgICogQHBhcmFtIHVybCB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgKi9cbiAgICAgICAgZmV0Y2godXJsKSB7XG5cbiAgICAgICAgICAgIGlmIChjYWNoZVt1cmxdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3VybF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhY2hlW3VybF0gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5mZXRjaCh1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShib2R5KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjYWNoZVt1cmxdO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKHdpbmRvdyk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5LmpzJztcblxuLyoqXG4gKiBAbWV0aG9kIG92ZXJyaWRlU3RvcFByb3BhZ2F0aW9uXG4gKiBAc2VlOiBodHRwOi8vYml0Lmx5LzFkUHB4SGxcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbihmdW5jdGlvbiBvdmVycmlkZVN0b3BQcm9wYWdhdGlvbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IG92ZXJyaWRkZW5TdG9wID0gRXZlbnQucHJvdG90eXBlLnN0b3BQcm9wYWdhdGlvbjtcblxuICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgICAgIHRoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgICAgICBvdmVycmlkZGVuU3RvcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50c1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBsZXQgY29tcG9uZW50cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGV2ZW50TmFtZXNcbiAgICAgKiBAdHlwZSB7QXJyYXl8bnVsbH1cbiAgICAgKi9cbiAgICBsZXQgZXZlbnROYW1lcyA9IG51bGw7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWN1cnNpdmVseSBkaXNjb3ZlciBhIGNvbXBvbmVudCB2aWEgaXRzIFJlYWN0IElEIHRoYXQgaXMgc2V0IGFzIGEgZGF0YSBhdHRyaWJ1dGVcbiAgICAgICAgICogb24gZWFjaCBSZWFjdCBlbGVtZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRCeUlkXG4gICAgICAgICAqIEBwYXJhbSBpZCB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQnlJZChpZCkge1xuXG4gICAgICAgICAgICBsZXQgbW9kZWw7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBmaW5kXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZWRDb21wb25lbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50Q29tcG9uZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kKHJlbmRlcmVkQ29tcG9uZW50LCBjdXJyZW50Q29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWRDb21wb25lbnQuX3Jvb3ROb2RlSUQgPT09IGlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgYmluZE1vZGVsXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gYmluZE1vZGVsKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB0aGlzLl9jdXJyZW50RWxlbWVudC5wcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGN1cnJlbnRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHJlbmRlcmVkQ29tcG9uZW50KSkoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENoaWxkcmVuO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZChjaGlsZHJlbltpbmRleF0sIGN1cnJlbnRDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpbmQoY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50LCBjb21wb25lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybUtleXNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG1hcFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYW5zZm9ybWVyPSd0b0xvd2VyQ2FzZSddXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRyYW5zZm9ybUtleXMobWFwLCB0cmFuc2Zvcm1lciA9ICd0b0xvd2VyQ2FzZScpIHtcblxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkTWFwID0ge307XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG1hcCkuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoKGtleSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkTWFwW2tleVt0cmFuc2Zvcm1lcl0oKV0gPSBtYXBba2V5XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtZWRNYXA7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZWdpc3RlckNvbXBvbmVudFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlckNvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHNldHVwRGVsZWdhdGlvblxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0dXBEZWxlZ2F0aW9uKCkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERldGVybWluZXMgYWxsIG9mIHRoZSBldmVudCB0eXBlcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgYnJvd3Nlci4gV2lsbCBjYWNoZSB0aGUgcmVzdWx0c1xuICAgICAgICAgICAgICogb2YgdGhpcyBkaXNjb3ZlcnkgZm9yIHBlcmZvcm1hbmNlIGJlbmVmaXRzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBldmVudHNcbiAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50TmFtZXMgfHwgKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBhRWxlbWVudCAgID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlciAgICA9IC9eb24vaSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gYUVsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5Lm1hdGNoKG1hdGNoZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE5hbWVzLnB1c2goa2V5LnJlcGxhY2UobWF0Y2hlciwgJycpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZXM7XG5cbiAgICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudFR5cGUpID0+IHtcblxuICAgICAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGBvbiR7ZXZlbnQudHlwZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdXRpbGl0eS50b0FycmF5KGV2ZW50LnBhdGgpLmZvckVhY2goKGl0ZW0pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXRob2QgYHN0b3BQcm9wYWdhdGlvbmAgd2FzIGludm9rZWQgb24gdGhlIGN1cnJlbnQgZXZlbnQsIHdoaWNoIHByZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXMgZnJvbSBwcm9wYWdhdGluZyBhbnkgZnVydGhlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmdldEF0dHJpYnV0ZSB8fCAhaXRlbS5oYXNBdHRyaWJ1dGUodXRpbGl0eS5BVFRSSUJVVEVfUkVBQ1RJRCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgZWxlbWVudCBpcyBub3QgYSB2YWxpZCBSZWFjdCBlbGVtZW50IGJlY2F1c2UgaXQgZG9lc24ndCBoYXZlIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWFjdCBJRCBkYXRhIGF0dHJpYnV0ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXR0ZW1wdCB0byBmaWVsZCB0aGUgY29tcG9uZW50IGJ5IHRoZSBhc3NvY2lhdGVkIFJlYWN0IElELlxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5maW5kQnlJZChpdGVtLmdldEF0dHJpYnV0ZSh1dGlsaXR5LkFUVFJJQlVURV9SRUFDVElEKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbCAmJiBtb2RlbC5wcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmFuc2Zvcm0gdGhlIGN1cnJlbnQgUmVhY3QgZXZlbnRzIGludG8gbG93ZXIgY2FzZSBrZXlzLCBzbyB0aGF0IHdlIGNhbiBwYWlyIHRoZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cCB3aXRoIHRoZSBldmVudCB0eXBlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWQgPSB0aGlzLnRyYW5zZm9ybUtleXMobW9kZWwucHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lIGluIHRyYW5zZm9ybWVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZGVmZXIgdGhlIGludm9jYXRpb24gb2YgdGhlIGV2ZW50IG1ldGhvZCwgYmVjYXVzZSBvdGhlcndpc2UgUmVhY3QuanNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCByZS1yZW5kZXIsIGFuZCB0aGUgUmVhY3QgSURzIHdpbGwgdGhlbiBiZSBcIm91dCBvZiBzeW5jXCIgZm9yIHRoaXMgZXZlbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5wdXNoKHRyYW5zZm9ybWVkW2V2ZW50TmFtZV0uYmluZChtb2RlbC5jb21wb25lbnQsIGV2ZW50KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgZWFjaCBmb3VuZCBldmVudCBmb3IgdGhlIGV2ZW50IHR5cGUuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5mb3JFYWNoKChldmVudEludm9jYXRpb24pID0+IGV2ZW50SW52b2NhdGlvbigpKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSh3aW5kb3cuZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCRjb25zb2xlKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2Qgd2FyblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybihtZXNzYWdlKSB7XG4gICAgICAgICAgICAkY29uc29sZS5sb2coYCVjTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6IHJnYmEoMCwgMCwgMCwgLjUpJywgJ2NvbG9yOiAjNUY5RUEwJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgaW5mb1xuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbyhtZXNzYWdlKSB7XG4gICAgICAgICAgICAkY29uc29sZS5sb2coYCVjTWFwbGUuanM6ICVjJHttZXNzYWdlfS5gLCAnY29sb3I6IHJnYmEoMCwgMCwgMCwgLjUpJywgJ2NvbG9yOiAjMDA4RERCJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZXJyb3JcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGVycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICRjb25zb2xlLmxvZyhgJWNNYXBsZS5qczogJWMke21lc3NhZ2V9LmAsICdjb2xvcjogcmdiYSgwLCAwLCAwLCAuNSknLCAnY29sb3I6ICNDRDYwOTAnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkod2luZG93LmNvbnNvbGUpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RhbnQgUkVTT0xWRV9USU1FT1VUXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDYwMDAwXG4gICAgICAgICAqL1xuICAgICAgICBSRVNPTFZFX1RJTUVPVVQ6IDYwMDAwXG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vVXRpbGl0eS5qcyc7XG5cbi8qKlxuICogQG1ldGhvZCBxdWVyeUFsbFxuICogQHBhcmFtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5sZXQgcXVlcnlBbGwgPSBmdW5jdGlvbiBxdWVyeUFsbChleHByZXNzaW9uKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoZXhwcmVzc2lvbikpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0Q1NTTGlua3NcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRDU1NMaW5rcyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0sbGlua1t0eXBlPVwidGV4dC9zY3NzXCJdJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZ2V0Q1NTSW5saW5lc1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxEb2N1bWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGdldENTU0lubGluZXMoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5QWxsLmNhbGwoZWxlbWVudCwgJ3N0eWxlW3R5cGU9XCJ0ZXh0L2Nzc1wiXScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldEltcG9ydHNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRJbXBvcnRzKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeUFsbC5jYWxsKGVsZW1lbnQsICdsaW5rW3JlbD1cImltcG9ydFwiXTpub3QoW2RhdGEtaWdub3JlXSknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRUZW1wbGF0ZXNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRUZW1wbGF0ZXMoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5QWxsLmNhbGwoZWxlbWVudCwgJ3RlbXBsYXRlW3JlZl0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRTY3JpcHRzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2NyaXB0cyhlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlBbGwuY2FsbChlbGVtZW50LCAnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRBbGxTY3JpcHRzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTERvY3VtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0QWxsU2NyaXB0cyhlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQganN4RmlsZXMgPSBxdWVyeUFsbC5jYWxsKGVsZW1lbnQsICdzY3JpcHRbdHlwZT1cInRleHQvanN4XCJdJyk7XG4gICAgICAgICAgICByZXR1cm4gW10uY29uY2F0KHV0aWxpdHkudG9BcnJheSh0aGlzLmdldFNjcmlwdHMoZWxlbWVudCkpLCB1dGlsaXR5LnRvQXJyYXkoanN4RmlsZXMpKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgbG9nZ2VyICBmcm9tICcuL0xvZ2dlci5qcyc7XG5pbXBvcnQgb3B0aW9ucyBmcm9tICcuL09wdGlvbnMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0YW50IEFUVFJJQlVURV9SRUFDVElEXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBBVFRSSUJVVEVfUkVBQ1RJRDogJ2RhdGEtcmVhY3RpZCcsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgcmVzb2x2ZXJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxEb2N1bWVudHxudWxsfSBvd25lckRvY3VtZW50XG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHJlc29sdmVyKHVybCwgb3duZXJEb2N1bWVudCkge1xuXG4gICAgICAgICAgICBsZXQgY29tcG9uZW50UGF0aCA9IHRoaXMuZ2V0UGF0aCh1cmwpLFxuICAgICAgICAgICAgICAgIGdldFBhdGggICAgICAgPSB0aGlzLmdldFBhdGguYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBnZXROYW1lICAgICAgID0gdGhpcy5nZXROYW1lLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgcmVzb2x2ZVBhdGhcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0hUTUxEb2N1bWVudH0gb3ZlcnJpZGVEb2N1bWVudFxuICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiByZXNvbHZlUGF0aChwYXRoLCBvdmVycmlkZURvY3VtZW50ID0gJGRvY3VtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgID0gb3ZlcnJpZGVEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gcGF0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5ocmVmO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQHByb3BlcnR5IHByb2R1Y3Rpb25cbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByb2R1Y3Rpb246IHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFBhdGgocGF0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xvY2FsUGF0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLmdldEFic29sdXRlUGF0aCgpfS8ke2dldE5hbWUocGF0aCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQYXRoKHBhdGgsICRkb2N1bWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRTcmNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0U3JjKHNyYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE5hbWUoc3JjKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRBYnNvbHV0ZVBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0QWJzb2x1dGVQYXRoKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQYXRoKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0UmVsYXRpdmVQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFJlbGF0aXZlUGF0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgaXNMb2NhbFBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlzTG9jYWxQYXRoKHBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIX5wYXRoLmluZGV4T2YodXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBkZXZlbG9wbWVudFxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGV2ZWxvcG1lbnQ6IHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRQYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldFBhdGgocGF0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xvY2FsUGF0aChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLmdldEFic29sdXRlUGF0aCgpfS8ke3BhdGh9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQYXRoKHBhdGgsICRkb2N1bWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRTcmNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0U3JjKHNyYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNyYztcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRBYnNvbHV0ZVBhdGhcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0QWJzb2x1dGVQYXRoKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVQYXRoKGNvbXBvbmVudFBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIGdldFJlbGF0aXZlUGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXRSZWxhdGl2ZVBhdGgoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50UGF0aDtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBpc0xvY2FsUGF0aFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGF0aCB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaXNMb2NhbFBhdGgocGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IGdldFBhdGgocmVzb2x2ZVBhdGgocGF0aCwgb3duZXJEb2N1bWVudCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhfnJlc29sdmVQYXRoKGNvbXBvbmVudFBhdGgpLmluZGV4T2YocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSA/IEFycmF5LmZyb20oYXJyYXlMaWtlKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZsYXR0ZW5BcnJheVxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gW2dpdmVuQXJyPVtdXVxuICAgICAgICAgKi9cbiAgICAgICAgZmxhdHRlbkFycmF5KGFyciwgZ2l2ZW5BcnIgPSBbXSkge1xuXG4gICAgICAgICAgICAvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbiAgICAgICAgICAgIGFyci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoaXRlbSkpICYmICh0aGlzLmZsYXR0ZW5BcnJheShpdGVtLCBnaXZlbkFycikpO1xuICAgICAgICAgICAgICAgICghQXJyYXkuaXNBcnJheShpdGVtKSkgJiYgKGdpdmVuQXJyLnB1c2goaXRlbSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cbiAgICAgICAgICAgIHJldHVybiBnaXZlbkFycjtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvU25ha2VDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYW1lbENhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtqb2luZXI9Jy0nXVxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0b1NuYWtlQ2FzZShjYW1lbENhc2UsIGpvaW5lciA9ICctJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbWVsQ2FzZS5zcGxpdCgvKFtBLVpdW2Etel17MCx9KS9nKS5maWx0ZXIocGFydHMgPT4gcGFydHMpLmpvaW4oam9pbmVyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGdldE5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TmFtZShpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldFBhdGgoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlbW92ZUV4dGVuc2lvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRXh0ZW5zaW9uKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZVBhdGguc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGlzSFRNTEltcG9ydFxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBodG1sRWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgaXNIVE1MSW1wb3J0KGh0bWxFbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBpc0luc3RhbmNlICA9IGh0bWxFbGVtZW50IGluc3RhbmNlb2YgSFRNTExpbmtFbGVtZW50LFxuICAgICAgICAgICAgICAgIGlzSW1wb3J0ICAgID0gU3RyaW5nKGh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZSgncmVsJykpLnRvTG93ZXJDYXNlKCkgPT09ICdpbXBvcnQnLFxuICAgICAgICAgICAgICAgIGhhc0hyZWZBdHRyID0gaHRtbEVsZW1lbnQuaGFzQXR0cmlidXRlKCdocmVmJyksXG4gICAgICAgICAgICAgICAgaGFzVHlwZUh0bWwgPSBTdHJpbmcoaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykpLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0L2h0bWwnO1xuXG4gICAgICAgICAgICByZXR1cm4gaXNJbnN0YW5jZSAmJiBpc0ltcG9ydCAmJiBoYXNIcmVmQXR0ciAmJiBoYXNUeXBlSHRtbDtcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVUaW1lb3V0XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICByZXNvbHZlVGltZW91dChlcnJvck1lc3NhZ2UsIHJlamVjdCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByZWplY3QoZXJyb3JNZXNzYWdlKSwgb3B0aW9ucy5SRVNPTFZFX1RJTUVPVVQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRyeVJlZ2lzdGVyRWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdHJ5UmVnaXN0ZXJFbGVtZW50KG5hbWUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAY29uc3RhbnQgRVJST1JfTUFQXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBFUlJPUl9NQVAgPSB7XG4gICAgICAgICAgICAgICAgJ0EgdHlwZSB3aXRoIHRoYXQgbmFtZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnOiBgQ3VzdG9tIGVsZW1lbnQgXCIke25hbWV9XCIgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkYCxcbiAgICAgICAgICAgICAgICAnVGhlIHR5cGUgbmFtZSBpcyBpbnZhbGlkJzogYEVsZW1lbnQgbmFtZSAke25hbWV9IGlzIGludmFsaWQgYW5kIG11c3QgY29uc2lzdCBvZiBhdCBsZWFzdCBvbmUgaHlwaGVuYFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgICRkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwgcHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBlcnJvckRhdGEgPSBPYmplY3Qua2V5cyhFUlJPUl9NQVApLm1hcCgoZXJyb3IpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnRXhwID0gbmV3IFJlZ0V4cChlcnJvciwgJ2knKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5tZXNzYWdlLm1hdGNoKHJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihFUlJPUl9NQVBbZXJyb3JdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVycm9yRGF0YS5zb21lKChtb2RlbCkgPT4gbW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93KGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKHdpbmRvdy5kb2N1bWVudCk7IiwiaW1wb3J0IEN1c3RvbUVsZW1lbnQgZnJvbSAnLi9FbGVtZW50LmpzJztcbmltcG9ydCB1dGlsaXR5ICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2dnZXIgICAgICAgIGZyb20gJy4vLi4vaGVscGVycy9Mb2dnZXIuanMnO1xuaW1wb3J0IG9wdGlvbnMgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL09wdGlvbnMuanMnO1xuaW1wb3J0IHtTdGF0ZU1hbmFnZXIsIFN0YXRlfSBmcm9tICcuL1N0YXRlTWFuYWdlci5qcyc7XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBDb21wb25lbnRcbiAqIEBleHRlbmRzIFN0YXRlTWFuYWdlclxuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgU3RhdGVNYW5hZ2VyIHtcblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBsb2FkaW5nIGFueSBwcmVyZXF1aXNpdGVzIGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIGRlbGVnYXRlZCB0byBlYWNoIGBDdXN0b21FbGVtZW50YFxuICAgICAqIG9iamVjdCBmb3IgY3JlYXRpbmcgYSBjdXN0b20gZWxlbWVudCwgYW5kIGxhc3RseSByZW5kZXJpbmcgdGhlIFJlYWN0IGNvbXBvbmVudCB0byB0aGUgZGVzaWduYXRlZCBIVE1MIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0RWxlbWVudFxuICAgICAqIEByZXR1cm4ge01vZHVsZX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZW1wbGF0ZUVsZW1lbnQsIHNjcmlwdEVsZW1lbnQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgID0gcGF0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IHsgc2NyaXB0OiBzY3JpcHRFbGVtZW50LCB0ZW1wbGF0ZTogdGVtcGxhdGVFbGVtZW50IH07XG5cbiAgICAgICAgbGV0IHNyYyA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgVVJMIG9mIHRoZSBjb21wb25lbnQgZm9yIEVTNiBgU3lzdGVtLmltcG9ydGAsIHdoaWNoIGlzIGFsc28gcG9seWZpbGxlZCBpbiBjYXNlIHRoZVxuICAgICAgICAvLyBjdXJyZW50IGJyb3dzZXIgZG9lcyBub3QgcHJvdmlkZSBzdXBwb3J0IGZvciBkeW5hbWljIG1vZHVsZSBsb2FkaW5nLlxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy5wYXRoLmdldFJlbGF0aXZlUGF0aCgpfS8ke3V0aWxpdHkucmVtb3ZlRXh0ZW5zaW9uKHNyYyl9YDtcblxuICAgICAgICBpZiAoc3JjLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKSA9PT0gJ2pzeCcpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIGxvZ2dlci5lcnJvcihgVXNlIEpTIGV4dGVuc2lvbiBpbnN0ZWFkIG9mIEpTWCDigJMgSlNYIGNvbXBpbGF0aW9uIHdpbGwgd29yayBhcyBleHBlY3RlZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgU3lzdGVtLmltcG9ydChgJHt1cmx9YCkudGhlbigoaW1wb3J0cykgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWltcG9ydHMuZGVmYXVsdCkge1xuXG4gICAgICAgICAgICAgICAgLy8gQ29tcG9uZW50cyB0aGF0IGRvIG5vdCBoYXZlIGEgZGVmYXVsdCBleHBvcnQgKGkuZTogZXhwb3J0IGRlZmF1bHQgY2xhc3MuLi4pIHdpbGwgYmUgaWdub3JlZC5cbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCBhbGwgdGhpcmQtcGFydHkgc2NyaXB0cyB0aGF0IGFyZSBhIHByZXJlcXVpc2l0ZSBvZiByZXNvbHZpbmcgdGhlIGN1c3RvbSBlbGVtZW50LlxuICAgICAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5sb2FkVGhpcmRQYXJ0eVNjcmlwdHMoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEN1c3RvbUVsZW1lbnQocGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50LCBpbXBvcnRzLmRlZmF1bHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVTT0xWRUQpO1xuICAgICAgICAgICAgfSwgKG1lc3NhZ2UpID0+IGxvZ2dlci5lcnJvcihtZXNzYWdlKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNjb3ZlciBhbGwgb2YgdGhlIHRoaXJkIHBhcnR5IEphdmFTY3JpcHQgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHJlcXVpcmVkIHRvIGhhdmUgYmVlbiBsb2FkZWQgYmVmb3JlXG4gICAgICogYXR0ZW1wdGluZyB0byByZW5kZXIgdGhlIGN1c3RvbSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkVGhpcmRQYXJ0eVNjcmlwdHNcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFRoaXJkUGFydHlTY3JpcHRzKCkge1xuXG4gICAgICAgIGxldCBzY3JpcHRFbGVtZW50cyAgICA9IHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnRzLnRlbXBsYXRlLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSksXG4gICAgICAgICAgICB0aGlyZFBhcnR5U2NyaXB0cyA9IHNjcmlwdEVsZW1lbnRzLmZpbHRlcigoc2NyaXB0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5wYXRoLmlzTG9jYWxQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcmRQYXJ0eVNjcmlwdHMubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBzcmMgICAgICAgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICAgICAgICBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICBzY3JpcHRFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMpO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgICAgICAgICA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFRpbWVvdXQgb2YgJHtvcHRpb25zLlJFU09MVkVfVElNRU9VVCAvIDEwMDB9IHNlY29uZHMgZXhjZWVkZWQgd2hpbHN0IHdhaXRpbmcgZm9yIHRoaXJkLXBhcnR5IHNjcmlwdDogXCIke2hyZWZ9XCJgO1xuICAgICAgICAgICAgICAgIHV0aWxpdHkucmVzb2x2ZVRpbWVvdXQoZXJyb3JNZXNzYWdlLCByZWplY3QpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImltcG9ydCBldmVudHMgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0V2ZW50cy5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2dnZXIgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL0xvZ2dlci5qcyc7XG5pbXBvcnQgY2FjaGVGYWN0b3J5IGZyb20gJy4vLi4vaGVscGVycy9DYWNoZUZhY3RvcnkuanMnO1xuaW1wb3J0IHNlbGVjdG9ycyAgICBmcm9tICcuLy4uL2hlbHBlcnMvU2VsZWN0b3JzLmpzJztcbmltcG9ydCB7U3RhdGVNYW5hZ2VyLCBTdGF0ZX0gZnJvbSAnLi9TdGF0ZU1hbmFnZXIuanMnO1xuXG4vKipcbiAqIEBtb2R1bGUgTWFwbGVcbiAqIEBzdWJtb2R1bGUgQ3VzdG9tRWxlbWVudFxuICogQGV4dGVuZHMgU3RhdGVNYW5hZ2VyXG4gKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21FbGVtZW50IGV4dGVuZHMgU3RhdGVNYW5hZ2VyIHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0RWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gdGVtcGxhdGVFbGVtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFNjcmlwdFxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGF0aCwgdGVtcGxhdGVFbGVtZW50LCBzY3JpcHRFbGVtZW50LCBpbXBvcnRTY3JpcHQpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhdGggICAgID0gcGF0aDtcbiAgICAgICAgdGhpcy5zYXNzICAgICA9ICh0eXBlb2YgU2FzcyA9PT0gJ3VuZGVmaW5lZCcpID8gbnVsbCA6IG5ldyBTYXNzKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB7IHNjcmlwdDogc2NyaXB0RWxlbWVudCwgdGVtcGxhdGU6IHRlbXBsYXRlRWxlbWVudCB9O1xuICAgICAgICB0aGlzLnNjcmlwdCAgID0gaW1wb3J0U2NyaXB0O1xuXG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gdGhpcy5nZXREZXNjcmlwdG9yKCk7XG5cbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yLmV4dGVuZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gdm9pZCB1dGlsaXR5LnRyeVJlZ2lzdGVyRWxlbWVudChkZXNjcmlwdG9yLm5hbWUsIHtcbiAgICAgICAgICAgICAgICBwcm90b3R5cGU6IHRoaXMuZ2V0RWxlbWVudFByb3RvdHlwZSgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByb3RvdHlwZSA9IGBIVE1MJHtkZXNjcmlwdG9yLmV4dGVuZH1FbGVtZW50YDtcblxuICAgICAgICB1dGlsaXR5LnRyeVJlZ2lzdGVyRWxlbWVudChkZXNjcmlwdG9yLm5hbWUsIHtcbiAgICAgICAgICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZSh3aW5kb3dbcHJvdG90eXBlXS5wcm90b3R5cGUsIHRoaXMuZ2V0RWxlbWVudFByb3RvdHlwZSgpKSxcbiAgICAgICAgICAgIGV4dGVuZHM6IGRlc2NyaXB0b3IuZXh0ZW5kLnRvTG93ZXJDYXNlKClcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zaWJsZSBmb3IgbG9hZGluZyBhc3NvY2lhdGVkIHN0eWxlcyBpbnRvIGVpdGhlciB0aGUgc2hhZG93IERPTSwgaWYgdGhlIHBhdGggaXMgZGV0ZXJtaW5lZCB0byBiZSBsb2NhbFxuICAgICAqIHRvIHRoZSBjb21wb25lbnQsIG9yIGdsb2JhbGx5IGlmIG5vdC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9hZFN0eWxlc1xuICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Qm91bmRhcnlcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgbG9hZFN0eWxlcyhzaGFkb3dCb3VuZGFyeSkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFkZENTU1xuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWRkQ1NTKGJvZHkpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGJvZHk7XG4gICAgICAgICAgICBzaGFkb3dCb3VuZGFyeS5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZJTkcpO1xuXG4gICAgICAgIGxldCBjb250ZW50ICAgICAgID0gdGhpcy5lbGVtZW50cy50ZW1wbGF0ZS5jb250ZW50O1xuICAgICAgICBsZXQgbGlua0VsZW1lbnRzICA9IHNlbGVjdG9ycy5nZXRDU1NMaW5rcyhjb250ZW50KTtcbiAgICAgICAgbGV0IHN0eWxlRWxlbWVudHMgPSBzZWxlY3RvcnMuZ2V0Q1NTSW5saW5lcyhjb250ZW50KTtcbiAgICAgICAgbGV0IHByb21pc2VzICAgICAgPSBbXS5jb25jYXQobGlua0VsZW1lbnRzLCBzdHlsZUVsZW1lbnRzKS5tYXAoKGVsZW1lbnQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgICBhZGRDU1MoZWxlbWVudC5pbm5lckhUTUwpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZWxlbWVudC5pbm5lckhUTUwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FjaGVGYWN0b3J5LmZldGNoKHRoaXMucGF0aC5nZXRQYXRoKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpKS50aGVuKChib2R5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3RleHQvc2NzcycpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2Fzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdZb3Ugc2hvdWxkIGluY2x1ZGUgXCJzYXNzLmpzXCIgZm9yIGRldmVsb3BtZW50IHJ1bnRpbWUgU0FTUyBjb21waWxhdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignQWxsIG9mIHlvdXIgU0FTUyBkb2N1bWVudHMgc2hvdWxkIGJlIGNvbXBpbGVkIHRvIENTUyBmb3IgcHJvZHVjdGlvbiB2aWEgeW91ciBidWlsZCBwcm9jZXNzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29tcGlsZSBTQ1NTIGRvY3VtZW50IGludG8gQ1NTIHByaW9yIHRvIGFwcGVuZGluZyBpdCB0byB0aGUgYm9keS5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgdGhpcy5zYXNzLmNvbXBpbGUoYm9keSwgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDU1MocmVzcG9uc2UudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFkZENTUyhib2R5KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGJvZHkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRVNPTFZFRCkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IHRoZSBlbGVtZW50IG5hbWUsIGFuZCBvcHRpb25hbGx5IHRoZSBlbGVtZW50IGV4dGVuc2lvbiwgZnJvbSBjb252ZXJ0aW5nIHRoZSBGdW5jdGlvbiB0byBhIFN0cmluZyB2aWFcbiAgICAgKiB0aGUgYHRvU3RyaW5nYCBtZXRob2QuIEl0J3Mgd29ydGggbm90aW5nIHRoYXQgdGhpcyBpcyBwcm9iYWJseSB0aGUgd2Vha2VzdCBwYXJ0IG9mIHRoZSBNYXBsZSBzeXN0ZW0gYmVjYXVzZSBpdFxuICAgICAqIHJlbGllcyBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkZXRlcm1pbmUgdGhlIG5hbWUgb2YgdGhlIHJlc3VsdGluZyBjdXN0b20gSFRNTCBlbGVtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXREZXNjcmlwdG9yXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlc2NyaXB0b3IoKSB7XG5cbiAgICAgICAgLy8gV2l0aCBFUzYgdGhlIGBGdW5jdGlvbi5wcm90b3R5cGUubmFtZWAgcHJvcGVydHkgaXMgYmVnaW5uaW5nIHRvIGJlIHN0YW5kYXJkaXNlZCwgd2hpY2ggbWVhbnNcbiAgICAgICAgLy8gaW4gbWFueSBjYXNlcyB3ZSB3b24ndCBoYXZlIHRvIHJlc29ydCB0byB0aGUgZmVlYmxlIGB0b1N0cmluZ2AgYXBwcm9hY2guIEhvb3JhaCFcbiAgICAgICAgbGV0IG5hbWUgICA9IHRoaXMuc2NyaXB0Lm5hbWUgfHwgdGhpcy5zY3JpcHQudG9TdHJpbmcoKS5tYXRjaCgvKD86ZnVuY3Rpb258Y2xhc3MpXFxzKihbYS16X10rKS9pKVsxXSxcbiAgICAgICAgICAgIGV4dGVuZCA9IG51bGw7XG5cbiAgICAgICAgaWYgKH5uYW1lLmluZGV4T2YoJ18nKSkge1xuXG4gICAgICAgICAgICAvLyBEb2VzIHRoZSBlbGVtZW50IG5hbWUgcmVmZXJlbmNlIGFuIGVsZW1lbnQgdG8gZXh0ZW5kP1xuICAgICAgICAgICAgbGV0IHNwbGl0ID0gbmFtZS5zcGxpdCgnXycpO1xuICAgICAgICAgICAgbmFtZSAgICAgID0gc3BsaXRbMF07XG4gICAgICAgICAgICBleHRlbmQgICAgPSBzcGxpdFsxXTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgbmFtZTogdXRpbGl0eS50b1NuYWtlQ2FzZShuYW1lKSwgZXh0ZW5kOiBleHRlbmQgfTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFlpZWxkcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgY3VzdG9tIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVnaXN0ZXJlZCBmb3Igb3VyIGN1c3RvbSBSZWFjdCBjb21wb25lbnQuXG4gICAgICogSXQgbGlzdGVucyBmb3Igd2hlbiB0aGUgY3VzdG9tIGVsZW1lbnQgaGFzIGJlZW4gaW5zZXJ0ZWQgaW50byB0aGUgRE9NLCBhbmQgdGhlbiBzZXRzIHVwIHRoZSBzdHlsZXMsIGFwcGxpZXNcbiAgICAgKiBkZWZhdWx0IFJlYWN0IHByb3BlcnRpZXMsIGV0Yy4uLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRFbGVtZW50UHJvdG90eXBlXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRQcm90b3R5cGUoKSB7XG5cbiAgICAgICAgbGV0IGxvYWRTdHlsZXMgPSB0aGlzLmxvYWRTdHlsZXMuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHNjcmlwdCAgICA9IHRoaXMuc2NyaXB0LFxuICAgICAgICAgICAgcGF0aCAgICAgID0gdGhpcy5wYXRoO1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgYXBwbHlEZWZhdWx0UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFwcGx5RGVmYXVsdFByb3BzKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVwbGFjZXIgID0gL15kYXRhLS9pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUubmFtZSA9PT0gdXRpbGl0eS5BVFRSSUJVVEVfUkVBQ1RJRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UocmVwbGFjZXIsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSBwcm9wZXJ0aWVzIHRvIHRoZSBjdXN0b20gZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmRlZmF1bHRQcm9wcyA9IHsgcGF0aDogcGF0aCwgZWxlbWVudDogdGhpcy5jbG9uZU5vZGUodHJ1ZSkgfTtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlEZWZhdWx0UHJvcHMuY2FsbCh0aGlzLCB0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCAgICAgID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBSZWFjdC5qcyBjb21wb25lbnQsIGltcG9ydGluZyBpdCB1bmRlciB0aGUgc2hhZG93IGJvdW5kYXJ5LlxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIocmVuZGVyZWRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBldmVudCBkZWxlZ2F0aW9uIGZvciB0aGUgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgICAgICBldmVudHMucmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSW1wb3J0IGV4dGVybmFsIENTUyBkb2N1bWVudHMgYW5kIHJlc29sdmUgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCByZXNvbHZlRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZUVsZW1lbnQoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGxvYWRTdHlsZXMoc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVFbGVtZW50LmFwcGx5KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vQ29tcG9uZW50LmpzJztcbmltcG9ydCB1dGlsaXR5ICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZ2dlciAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nZ2VyLmpzJztcbmltcG9ydCBvcHRpb25zICAgZnJvbSAnLi8uLi9oZWxwZXJzL09wdGlvbnMuanMnO1xuaW1wb3J0IHNlbGVjdG9ycyBmcm9tICcuLy4uL2hlbHBlcnMvU2VsZWN0b3JzLmpzJztcbmltcG9ydCB7U3RhdGVNYW5hZ2VyLCBTdGF0ZX0gZnJvbSAnLi9TdGF0ZU1hbmFnZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2R1bGUgZXh0ZW5kcyBTdGF0ZU1hbmFnZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtIVE1MTGlua0VsZW1lbnR9IGxpbmtFbGVtZW50XG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxpbmtFbGVtZW50KSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXRoICAgICAgID0gdXRpbGl0eS5yZXNvbHZlcihsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSwgbGlua0VsZW1lbnQuaW1wb3J0KS5kZXZlbG9wbWVudDtcbiAgICAgICAgdGhpcy5zdGF0ZSAgICAgID0gU3RhdGUuVU5SRVNPTFZFRDtcbiAgICAgICAgdGhpcy5lbGVtZW50cyAgID0geyBsaW5rOiBsaW5rRWxlbWVudCB9O1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcblxuICAgICAgICB0aGlzLmxvYWRNb2R1bGUobGlua0VsZW1lbnQpLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAvLyBVc2Ugb25seSB0aGUgZmlyc3QgdGVtcGxhdGUsIGJlY2F1c2Ugb3RoZXJ3aXNlIE1hcGxlaWZ5IHdpbGwgaGF2ZSBhIGRpZmZpY3VsdCBqb2IgYXR0ZW1wdGluZ1xuICAgICAgICAgICAgLy8gdG8gcmVzb2x2ZSB0aGUgcGF0aHMgd2hlbiB0aGVyZSdzIGEgbWlzbWF0Y2ggYmV0d2VlbiB0ZW1wbGF0ZSBlbGVtZW50cyBhbmQgbGluayBlbGVtZW50cy5cbiAgICAgICAgICAgIC8vIFBSRVZJT1VTOiB0aGlzLmdldFRlbXBsYXRlcygpLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGVFbGVtZW50cyA9IHRoaXMuZ2V0VGVtcGxhdGVzKCk7XG5cbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZUVsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYENvbXBvbmVudCBcIiR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9XCIgaXMgYXR0ZW1wdGluZyB0byByZWdpc3RlciB0d28gY29tcG9uZW50c2ApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgW3RoaXMuZ2V0VGVtcGxhdGVzKClbMF1dLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEVsZW1lbnRzID0gc2VsZWN0b3JzLmdldEFsbFNjcmlwdHModGVtcGxhdGVFbGVtZW50LmNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudHMubWFwKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNyYyA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGF0aC5pc0xvY2FsUGF0aChzcmMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudCh0aGlzLnBhdGgsIHRlbXBsYXRlRWxlbWVudCwgc2NyaXB0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVTT0xWRUQpO1xuXG4gICAgICAgIH0sIChtZXNzYWdlKSA9PiBsb2dnZXIuZXJyb3IobWVzc2FnZSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBzZXRTdGF0ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0ZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZE1vZHVsZVxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gbGlua0VsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIGxvYWRNb2R1bGUobGlua0VsZW1lbnQpIHtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFU09MVklORyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgaWYgKGxpbmtFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncmVmJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCByZXNvbHZlKGxpbmtFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxpbmtFbGVtZW50LmltcG9ydCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIHJlc29sdmUobGlua0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZShsaW5rRWxlbWVudCkpO1xuXG4gICAgICAgICAgICBsZXQgaHJlZiAgICAgICAgID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyksXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFRpbWVvdXQgb2YgJHtvcHRpb25zLlJFU09MVkVfVElNRU9VVCAvIDEwMDB9IHNlY29uZHMgZXhjZWVkZWQgd2hpbHN0IHdhaXRpbmcgZm9yIEhUTUwgaW1wb3J0OiBcIiR7aHJlZn1cImA7XG4gICAgICAgICAgICB1dGlsaXR5LnJlc29sdmVUaW1lb3V0KGVycm9yTWVzc2FnZSwgcmVqZWN0KTtcblxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRUZW1wbGF0ZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZXMoKSB7XG5cbiAgICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsZW1lbnRzLmxpbmsuaW1wb3J0O1xuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKSk7XG5cbiAgICB9XG5cbn0iLCIvKipcbiAqIEBjb25zdGFudCBTdGF0ZVxuICogQHR5cGUge3tVTlJFU09MVkVEOiBudW1iZXIsIFJFU09MVklORzogbnVtYmVyLCBSRVNPTFZFRDogbnVtYmVyfX1cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXRlID0geyBVTlJFU09MVkVEOiAwLCBSRVNPTFZJTkc6IDEsIFJFU09MVkVEOiAyIH07XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBTdGF0ZU1hbmFnZXJcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0ZU1hbmFnZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHJldHVybiB7QWJzdHJhY3R9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZS5VTlJFU09MVkVEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgc2V0U3RhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdGVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG5cbn0iXX0=
