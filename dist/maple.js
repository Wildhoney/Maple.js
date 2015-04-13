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

            var register = new (_bind.apply(_Register2['default'], [null].concat(_toConsumableArray(modules))))();
        });
    };

    $window.Maple = Maple;
    $window.Maple.Component = _Component2['default'];
})(window, document);

},{"./components/Component.js":2,"./components/Register.js":4}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Component = (function () {
  function Component() {
    _classCallCheck(this, Component);
  }

  _createClass(Component, [{
    key: "addEventListener",

    /**
     * @constructor
     * @param {String} name
     * @return {Component}
     */
    value: function addEventListener(name) {

      this.props.dispatcher.addEventListener(name, { reference: this, callback: function callback(event) {} });
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
})();

exports["default"] = Component;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
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
    _classCallCheck(this, Dispatcher);

    this.events = {};
  }

  _createClass(Dispatcher, [{
    key: "addEventListener",

    /**
     * @method addEventListener
     * @param {String} name
     * @param {Object} [options={}]
     * @return {void}
     */
    value: function addEventListener(name) {
      var options = arguments[1] === undefined ? { reference: null, callback: function callback() {} } : arguments[1];

      if (this.events[name]) {
        this.events[name] = [];
      }

      this.events[name].push(options);
    }
  }, {
    key: "removeEventListener",

    /**
     * @method removeEventListener
     * @param {String} name
     * @param {Object} reference
     * @return {void}
     */
    value: function removeEventListener(name, reference) {}
  }]);

  return Dispatcher;
})();

exports["default"] = Dispatcher;
module.exports = exports["default"];

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

            var importDocuments = document.querySelectorAll('link[rel="import"]');

            return _utility2['default'].toArray(importDocuments).map(function (importDocument) {

                return new Promise(function (resolve) {
                    importDocument.addEventListener('load', function (event) {
                        return resolve(event.path[0]);
                    });
                });
            });
        }
    }, {
        key: 'findImport',

        /**
         * Responsible for finding the import link that pertains to the class that we're currently dealing
         * with.
         *
         * @method findImport
         * @param {String} className
         * @return {Object}
         */
        value: function findImport(className) {

            return this.linkElements.filter(function (linkElement) {

                var regExp = new RegExp('' + className + '/(?:.+?).html', 'i');

                if (linkElement.href.match(regExp)) {
                    return true;
                }
            })[0];
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
            var templateElement = importDocument.querySelector('template');
            return _utility2['default'].toArray(templateElement.content.querySelectorAll('script[type="text/javascript"]'));
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

            this.log('Adding custom element "' + elementName + '"');
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

                        component.defaultProps = {
                            element: this.cloneNode(true),
                            dispatcher: dispatcher
                        };

                        this.innerHTML = '';
                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');

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

                        _css2['default'].associate(modulePath, shadowRoot);
                        shadowRoot.appendChild(contentElement);
                        _events2['default'].delegate(contentElement, React.render(renderedElement, contentElement));
                    }

                }

            });

            document.registerElement(elementName, {
                prototype: prototype
            });
        }
    }, {
        key: 'log',

        /**
         * @method log
         * @param {String} message
         * @return {void}
         */
        value: function log(message) {

            if (this.debug) {
                console.info('Maple.js: ' + message + '.');
            }
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
            var _this = this;

            for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                modules[_key2] = arguments[_key2];
            }

            modules = modules || this.findModules();

            Promise.all(this.getImports()).then(function (linkElements) {

                _this.linkElements = linkElements;

                modules.forEach(function (name) {

                    name = {
                        camelcase: name,
                        underscore: _utility2['default'].toSnakeCase(name)
                    };

                    var importDocument = _this.findImport(name.underscore),
                        scriptElements = _this.findScripts(importDocument['import']),
                        modulePath = _utility2['default'].getImportPath(importDocument.getAttribute('href'));

                    _this.log('Registering module "' + name.camelcase + '" with path "' + modulePath + '"');

                    scriptElements.forEach(function (scriptElement) {

                        var scriptSrc = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                            scriptPath = '' + modulePath + '/' + scriptSrc;

                        System['import'](scriptPath).then(function (Register) {

                            var className = Register['default'].toString().match(/(?:function|class)\s*([a-z]+)/i)[1];
                            var component = _this.components[className] = Register['default'];
                            _this.registerCustomElement(className, component, modulePath);
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

},{"./../helpers/Events.js":5,"./../helpers/Stylesheets.js":6,"./../helpers/Utility.js":7,"./Dispatcher.js":3}],5:[function(require,module,exports){
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
         * @return {void}
         */
        associate: function associate(componentPath, shadowRoot) {

            _utility2['default'].toArray(document.querySelectorAll('link')).forEach(function (link) {

                var href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    var templateElement = link['import'].querySelector('template'),
                        templateContent = templateElement.content,
                        cssDocuments = _utility2['default'].toArray(templateContent.querySelectorAll('link')).map(function (linkElement) {
                        return '' + componentPath + '/' + linkElement.getAttribute('href');
                    });

                    cssDocuments.forEach(function (cssDocument) {

                        var styleElement = $document.createElement('style');
                        styleElement.setAttribute('type', 'text/css');
                        styleElement.innerHTML = '@import url(' + cssDocument + ')';
                        shadowRoot.appendChild(styleElement);
                    });
                }
            });
        }

    };
})(document);

module.exports = exports['default'];

},{"./../helpers/Utility.js":7}],7:[function(require,module,exports){
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
            return Array.prototype.slice.apply(arrayLike);
        },

        /**
         * @method getImportPath
         * @param {String} importPath
         * @return {String}
         */
        getImportPath: function getImportPath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        }

    };
})();

module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9EaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2NvbXBvbmVudHMvUmVnaXN0ZXIuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9TdHlsZXNoZWV0cy5qcyIsIi9Vc2Vycy9hdGltYmVybGFrZS9XZWJyb290L01hcGxlLmpzL3NyYy9oZWxwZXJzL1V0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O3lCQ0FzQiwyQkFBMkI7Ozs7d0JBQzNCLDBCQUEwQjs7OztBQUVoRCxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7Ozs7Ozs7O1FBT1AsS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxHQU9pQjswQ0FBVCxPQUFPO0FBQVAsbUJBQU87Ozs4QkFQcEIsS0FBSzs7QUFTSCxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQU07O0FBRWpELGdCQUFJLFFBQVEsNEVBQW1CLE9BQU8sTUFBQyxDQUFDO1NBRTNDLENBQUMsQ0FBQztLQUVOOztBQUlMLFdBQU8sQ0FBQyxLQUFLLEdBQWEsS0FBSyxDQUFDO0FBQ2hDLFdBQU8sQ0FBQyxL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QkFFTjthQUVKLENBQUMsQ0FBQztTQUVOOztLQUVKLENBQUM7Q0FFTCxDQUFBLENBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7OztxQkNuREcsQ0FBQyxTQUFTLElBQUksR0FBRzs7QUFFNUIsZ0JBQVksQ0FBQzs7QUFFYixXQUFPOzs7Ozs7OztBQVFILG1CQUFXLEVBQUEscUJBQUMsU0FBUyxFQUFnQjtnQkFBZCxNQUFNLGdDQUFHLEdBQUc7O0FBQy9CLG1CQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLO3VCQUFJLEtBQUs7YUFBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pHOzs7Ozs7O0FBT0QsZUFBTyxFQUFBLGlCQUFDLFNBQVMsRUFBRTtBQUNmLG1CQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqRDs7Ozs7OztBQU9ELHFCQUFhLEVBQUEsdUJBQUMsVUFBVSxFQUFFO0FBQ3RCLG1CQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2RDs7S0FFSixDQUFDO0NBRUwsQ0FBQSxFQUFHIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgUmVnaXN0ZXIgIGZyb20gJy4vY29tcG9uZW50cy9SZWdpc3Rlci5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbW9kdWxlIE1hcGxlXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICAgICAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gICAgICovXG4gICAgY2xhc3MgTWFwbGUge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoLi4ubW9kdWxlcykge1xuXG4gICAgICAgICAgICAkZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCByZWdpc3RlciA9IG5ldyBSZWdpc3RlciguLi5tb2R1bGVzKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgJHdpbmRvdy5NYXBsZSAgICAgICAgICAgPSBNYXBsZTtcbiAgICAkd2luZG93Lk1hcGxlLkNvbXBvbmVudCA9IENvbXBvbmVudDtcblxufSkod2luZG93LCBkb2N1bWVudCk7IiwiLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIENvbXBvbmVudFxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIobmFtZSkge1xuXG4gICAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIHsgcmVmZXJlbmNlOiB0aGlzLCBjYWxsYmFjazogKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgfX0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSkge1xuICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCB0aGlzKTtcbiAgICB9XG5cbn0iLCIvKipcbiAqIEBtb2R1bGUgTWFwbGVcbiAqIEBzdWJtb2R1bGUgRGlzcGF0Y2hlclxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGF0Y2hlciB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcmV0dXJuIHtEaXNwYXRjaGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgYWRkRXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBvcHRpb25zID0geyByZWZlcmVuY2U6IG51bGwsIGNhbGxiYWNrOiAoKSA9PiB7fSB9KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW25hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tuYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHNbbmFtZV0ucHVzaChvcHRpb25zKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZmVyZW5jZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCByZWZlcmVuY2UpIHtcblxuICAgIH1cblxufSIsImltcG9ydCBldmVudHMgICAgIGZyb20gJy4vLi4vaGVscGVycy9FdmVudHMuanMnO1xuaW1wb3J0IGNzcyAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgIGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4vRGlzcGF0Y2hlci5qcyc7XG5cbi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBSZWdpc3RlclxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0ZXIge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAqIEByZXR1cm4ge1JlZ2lzdGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyAgICAgID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgYWxsIG9mIHRoZSBIVE1MIGltcG9ydHMgYW5kIHJldHVybmluZyBhIHByb21pc2Ugd2hlbiBlYWNoIG9mIHRoZVxuICAgICAqIEhUTUwgaW1wb3J0cyBoYXZlIGJlZW4gc3VjY2Vzc2Z1bGx5IGltcG9ydGVkLiBUaGlzIGFsbG93cyB1cyB0byBhY2Nlc3MgdGhlIGBvd25lckRvY3VtZW50YFxuICAgICAqIG9uIGVhY2ggb2YgdGhlIGxpbmsgZWxlbWVudHMga25vd2luZyB0aGF0IGl0IGlzbid0IG51bGwuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEltcG9ydHNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRJbXBvcnRzKCkge1xuXG4gICAgICAgIGxldCBpbXBvcnREb2N1bWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cImltcG9ydFwiXScpO1xuXG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoaW1wb3J0RG9jdW1lbnRzKS5tYXAoKGltcG9ydERvY3VtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGltcG9ydERvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBldmVudCA9PiByZXNvbHZlKGV2ZW50LnBhdGhbMF0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGZpbmRpbmcgdGhlIGltcG9ydCBsaW5rIHRoYXQgcGVydGFpbnMgdG8gdGhlIGNsYXNzIHRoYXQgd2UncmUgY3VycmVudGx5IGRlYWxpbmdcbiAgICAgKiB3aXRoLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBmaW5kSW1wb3J0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBmaW5kSW1wb3J0KGNsYXNzTmFtZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtFbGVtZW50cy5maWx0ZXIoKGxpbmtFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCByZWdFeHAgPSBuZXcgUmVnRXhwKGAke2NsYXNzTmFtZX1cXC8oPzouKz8pXFwuaHRtbGAsICdpJyk7XG5cbiAgICAgICAgICAgIGlmIChsaW5rRWxlbWVudC5ocmVmLm1hdGNoKHJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVswXTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNpYmxlIGZvciBmaW5kaW5nIGFsbCBvZiB0aGUgSFRNTCBpbXBvcnRzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50LiBJdCB3aWxsIGJlIGludm9rZWQgaWZcbiAgICAgKiB0aGUgZGV2ZWxvcGVyIGRvZXNuJ3QgZXhwbGljaXRseSBwYXNzIGluIGFuIGFycmF5IG9mIG1vZHVsZXMgdG8gbG9hZCB2aWEgdGhlIE1hcGxlIGNvbnN0cnVjdG9yIHdoZW5cbiAgICAgKiBpbnN0YW50aWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBmaW5kTW9kdWxlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGZpbmRNb2R1bGVzKCkge1xuXG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJpbXBvcnRcIl0nKSkubWFwKChpbXBvcnREb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW1wb3J0UGF0aCA9IHV0aWxpdHkuZ2V0SW1wb3J0UGF0aChpbXBvcnREb2N1bWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGZpbmRTY3JpcHRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltcG9ydERvY3VtZW50XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZmluZFNjcmlwdHMoaW1wb3J0RG9jdW1lbnQpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGltcG9ydERvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBjdXN0b20gZWxlbWVudCB1c2luZyBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQsIGFuZCB0aGVuIGFwcGVuZGluZ1xuICAgICAqIHRoZSBhc3NvY2lhdGVkIFJlYWN0LmpzIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVnaXN0ZXJDdXN0b21FbGVtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kdWxlUGF0aFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcmVnaXN0ZXJDdXN0b21FbGVtZW50KGNsYXNzTmFtZSwgY29tcG9uZW50LCBtb2R1bGVQYXRoKSB7XG5cbiAgICAgICAgbGV0IGVsZW1lbnROYW1lID0gdXRpbGl0eS50b1NuYWtlQ2FzZShjbGFzc05hbWUpLFxuICAgICAgICAgICAgZGlzcGF0Y2hlciAgPSB0aGlzLmRpc3BhdGNoZXI7XG5cbiAgICAgICAgdGhpcy5sb2coYEFkZGluZyBjdXN0b20gZWxlbWVudCBcIiR7ZWxlbWVudE5hbWV9XCJgKTtcbiAgICAgICAgbGV0IHByb3RvdHlwZSAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAgICB0aGlzLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXI6IGRpc3BhdGNoZXJcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgncmVzb2x2ZWQnLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudCBhbmQgdHJhbnNmZXIgdG8gdGhlIFJlYWN0LmpzIGNsYXNzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDAsIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXM7IGluZGV4IDwgYXR0cmlidXRlcy5sZW5ndGg7IGluZGV4KyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoL15kYXRhLS9pLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlZmF1bHRQcm9wc1tuYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbmRlcmVkRWxlbWVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzcy5hc3NvY2lhdGUobW9kdWxlUGF0aCwgc2hhZG93Um9vdCk7XG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZWxlbWVudE5hbWUsIHtcbiAgICAgICAgICAgIHByb3RvdHlwZTogcHJvdG90eXBlXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2dcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9nKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGBNYXBsZS5qczogJHttZXNzYWdlfS5gKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW50cnkgcG9pbnQgZm9yIHRoZSBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uIEl0IGFjY2VwdHMgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRvIGluaXRpYWxpc2VcbiAgICAgKiBtb2R1bGVzIGV4cGxpY2l0bHksIG90aGVyd2lzZSB0aGlzLmZpbmRNb2R1bGVzIHdpbGwgYmUgaW52b2tlZCwgYW5kIG1vZHVsZXMgd2lsbCBiZSBmb3VuZFxuICAgICAqIGF1dG9tYXRpY2FsbHkgZnJvbSB0aGUgY3VycmVudCBIVE1MIGltcG9ydHMgb2YgdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWxlZ2F0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZHVsZXNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlZ2lzdGVyKC4uLm1vZHVsZXMpIHtcblxuICAgICAgICBtb2R1bGVzID0gbW9kdWxlcyB8fCB0aGlzLmZpbmRNb2R1bGVzKCk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5nZXRJbXBvcnRzKCkpLnRoZW4oKGxpbmtFbGVtZW50cykgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmxpbmtFbGVtZW50cyA9IGxpbmtFbGVtZW50cztcblxuICAgICAgICAgICAgbW9kdWxlcy5mb3JFYWNoKChuYW1lKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBuYW1lID0ge1xuICAgICAgICAgICAgICAgICAgICBjYW1lbGNhc2U6ICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICB1bmRlcnNjb3JlOiB1dGlsaXR5LnRvU25ha2VDYXNlKG5hbWUpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGxldCBpbXBvcnREb2N1bWVudCA9IHRoaXMuZmluZEltcG9ydChuYW1lLnVuZGVyc2NvcmUpLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cyA9IHRoaXMuZmluZFNjcmlwdHMoaW1wb3J0RG9jdW1lbnQuaW1wb3J0KSxcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlUGF0aCAgICAgPSB1dGlsaXR5LmdldEltcG9ydFBhdGgoaW1wb3J0RG9jdW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFJlZ2lzdGVyaW5nIG1vZHVsZSBcIiR7bmFtZS5jYW1lbGNhc2V9XCIgd2l0aCBwYXRoIFwiJHttb2R1bGVQYXRofVwiYCk7XG5cbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50cy5mb3JFYWNoKChzY3JpcHRFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcmlwdFNyYyAgPSBzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0UGF0aCA9IGAke21vZHVsZVBhdGh9LyR7c2NyaXB0U3JjfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgU3lzdGVtLmltcG9ydChzY3JpcHRQYXRoKS50aGVuKChSZWdpc3RlcikgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gUmVnaXN0ZXIuZGVmYXVsdC50b1N0cmluZygpLm1hdGNoKC8oPzpmdW5jdGlvbnxjbGFzcylcXHMqKFthLXpdKykvaSlbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW2NsYXNzTmFtZV0gPSBSZWdpc3Rlci5kZWZhdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckN1c3RvbUVsZW1lbnQoY2xhc3NOYW1lLCBjb21wb25lbnQsIG1vZHVsZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtSZWFjdENsYXNzLmNyZWF0ZUNsYXNzLkNvbnN0cnVjdG9yfSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlbGVnYXRlKGNvbnRlbnRFbGVtZW50LCBjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGFFbGVtZW50ICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXG4gICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IFtdLFxuICAgICAgICAgICAgICAgIGV2ZW50RXNxdWUgPSAvb25bYS16XSsvaTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYUVsZW1lbnQpLmZvckVhY2goKGtleSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGtleS5tYXRjaChldmVudEVzcXVlKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChrZXkucmVwbGFjZSgvXm9uLywgJycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0RXZlbnRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRFdmVudChldmVudE5hbWUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaE5hbWUgPSBuZXcgUmVnRXhwKGV2ZW50TmFtZSwgJ2knKSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiAgID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Lm1hdGNoKG1hdGNoTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRGbjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZmluZEV2ZW50c1xuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZWFjdElkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEV2ZW50cyhub2RlLCByZWFjdElkLCBldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBldmVudHMgICAgICA9IFtdLFxuICAgICAgICAgICAgICAgICAgICByb290RXZlbnRGbiA9IGdldEV2ZW50KGV2ZW50TmFtZSwgbm9kZS5fY3VycmVudEVsZW1lbnQuX3N0b3JlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb290RXZlbnRGbikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGV2ZW50IGluIHJvb3QhXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKHJvb3RFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChub2RlLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5fcmVuZGVyZWRDaGlsZHJlbjtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkIGluIGNoaWxkcmVuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGlkKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGNoaWxkcmVuW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3Jvb3ROb2RlSUQgPT09IHJlYWN0SWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIGl0ZW0uX2luc3RhbmNlLnByb3BzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiBjaGlsZHJlbiFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goY2hpbGRFdmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX3JlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmluZEV2ZW50cyhpdGVtLCByZWFjdElkLCBldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgY3JlYXRlRXZlbnRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRzID0gY29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50Ll9yZW5kZXJlZENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICAgPSBgb24ke2V2ZW50LnR5cGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBmaW5kRXZlbnRzKGNvbXBvbmVudHMsIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVhY3RpZCcpLCBldmVudEZuKTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRGbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGbi5hcHBseShjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50TmFtZSBvZiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFdmVudChldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKCk7IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGxpbmtTZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZShjb21wb25lbnRQYXRoLCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIHV0aWxpdHkudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLmZvckVhY2goKGxpbmspID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBocmVmID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgIGlmIChocmVmLm1hdGNoKGNvbXBvbmVudFBhdGgpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGxpbmsuaW1wb3J0LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cyAgICA9IHV0aWxpdHkudG9BcnJheSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2NvbXBvbmVudFBhdGh9LyR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cy5mb3JFYWNoKChjc3NEb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYEBpbXBvcnQgdXJsKCR7Y3NzRG9jdW1lbnR9KWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRJbXBvcnRQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldEltcG9ydFBhdGgoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyJdfQ==
