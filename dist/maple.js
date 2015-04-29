(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Component = require('./models/Component.js');

var _Component2 = _interopRequireWildcard(_Component);

var _Template = require('./models/Template.js');

var _Template2 = _interopRequireWildcard(_Template);

var _utility = require('./helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var _log = require('./helpers/Log.js');

var _log2 = _interopRequireWildcard(_log);

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
                var _this = this;

                [].concat(this.loadLinks()).forEach(function (promise) {
                    return promise.then(function (templates) {

                        templates.forEach(function (template) {

                            // Load all of the prerequisites for the component.
                            Promise.all(_this.loadThirdPartyScripts(template)).then(function () {

                                _this.resolveScripts(template).forEach(function (promise) {
                                    return promise.then(function (component) {

                                        // Register the custom element using the resolved script.
                                        _this.registerElement(component);
                                    })['catch'](function (error) {
                                        return _log2['default']('Timeout', error.message, '#DC143C');
                                    });
                                });
                            })['catch'](function (error) {
                                return _log2['default']('Timeout', error.message, '#DC143C');
                            });
                        });
                    })['catch'](function (error) {
                        return _log2['default']('Timeout', error.message, '#DC143C');
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

                var linkElements = this.findLinks();

                return linkElements.map(function (linkElement) {

                    var href = linkElement.getAttribute('href'),
                        name = _utility2['default'].extractName(href),
                        path = _utility2['default'].extractPath(href);

                    _log2['default']('Component', name, '#8B864E');

                    return new Promise(function (resolve, reject) {

                        /**
                         * @method findTemplates
                         * @return {void}
                         */
                        var findTemplates = function findTemplates() {

                            var templates = [];

                            _this2.findTemplates(linkElement['import']).forEach(function (templateElement) {

                                // Instantiate our component with the name, path, and the associated element.
                                var template = new _Template2['default']({ name: name, path: path, element: templateElement });
                                templates.push(template);
                            });

                            resolve(templates);
                            _utility2['default'].timeoutPromise(reject, 'Link: ' + href);
                        };

                        if (linkElement['import']) {
                            return void findTemplates();
                        }

                        linkElement.addEventListener('load', findTemplates);
                    });
                });
            }
        }, {
            key: 'loadThirdPartyScripts',

            /**
             * @method loadThirdPartyScripts
             * @param {Template} template
             * @return {Promise[]}
             */
            value: function loadThirdPartyScripts(template) {

                return template.thirdPartyScripts().map(function (script) {

                    return new Promise(function (resolve, reject) {

                        var scriptElement = $document.createElement('script');
                        scriptElement.setAttribute('type', 'text/javascript');
                        scriptElement.setAttribute('src', script.getAttribute('src'));

                        scriptElement.addEventListener('load', function () {
                            resolve(scriptElement);
                        });

                        _utility2['default'].timeoutPromise(reject, 'Third Party: ' + scriptElement.getAttribute('src'));
                        $document.head.appendChild(scriptElement);
                    });
                });
            }
        }, {
            key: 'resolveScripts',

            /**
             * @method resolveScripts
             * @param {Template} template
             * @return {Promise[]}
             */
            value: function resolveScripts(template) {

                return template.componentScripts().map(function (scriptElement) {
                    return new Promise(function (resolve, reject) {

                        var scriptPath = template.resolveScriptPath(scriptElement.getAttribute('src'));

                        System['import'](scriptPath).then(function (moduleImport) {

                            // Resolve each script contained within the template element.
                            resolve(new _Component2['default']({ script: moduleImport['default'], template: template }));
                        });

                        _utility2['default'].timeoutPromise(reject, 'Component: ' + scriptElement.getAttribute('src'));
                    });
                });
            }
        }, {
            key: 'registerElement',

            /**
             * Responsible for creating the custom element using $document.registerElement, and then appending
             * the associated React.js component.
             *
             * @method registerElement
             * @param {Component} component
             * @return {void}
             */
            value: function registerElement(component) {

                var name = component.elementName();

                if (name.split('-').length <= 1) {
                    _log2['default']('Invalid Tag', '' + name, '#DB7093');
                    return;
                }

                $document.registerElement(name, {
                    prototype: component.customElement()
                });
            }
        }, {
            key: 'findLinks',

            /**
             * @method findLinks
             * @return {Array}
             */
            value: function findLinks() {
                return _utility2['default'].toArray($document.querySelectorAll(_utility2['default'].selector.links));
            }
        }, {
            key: 'findTemplates',

            /**
             * @method findTemplates
             * @param {HTMLDocument} [documentRoot=$document]
             * @return {Array}
             */
            value: function findTemplates() {
                var documentRoot = arguments[0] === undefined ? $document : arguments[0];

                return _utility2['default'].toArray(documentRoot.querySelectorAll(_utility2['default'].selector.templates));
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

},{"./helpers/Log.js":2,"./helpers/Utility.js":3,"./models/Component.js":4,"./models/Template.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//console.log('%c ', 'line-height: 100px; padding: 32px 134px; background: url(https://github.com/Wildhoney/Maple.js/blob/master/media/console-logo.png?raw=true)');

/**
 * @constructor
 * @param {String} label
 * @param {String} message
 * @param {String} colour
 * @return {log}
 */
exports["default"] = log;

function log(label, message, colour) {

    "use strict";

    var commonStyles = "text-transform: uppercase; line-height: 20px; font-size: 9px;";

    console.log("%c Maple %c " + label + " %c " + message, "" + commonStyles + " color: white; background-color: black; padding: 3px 5px", "" + commonStyles + " color: " + colour + "; text-transform: lowercase", "" + commonStyles + " color: rgba(0, 0, 0, .55)");
}

module.exports = exports["default"];

},{}],3:[function(require,module,exports){
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
    var WAIT_TIMEOUT = 10000;

    return {

        /**
         * @property selector
         * @type {Object}
         */
        selector: {
            links: 'link[rel="import"]:not([data-ignore])',
            styles: 'link[type="text/css"]',
            scripts: 'script[type="text/javascript"][src*="../"]',
            inlines: 'style[type="text/css"]',
            components: 'script[type="text/javascript"]:not([src*="../"])',
            templates: 'template'
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
         * @method extractName
         * @param {String} importPath
         * @return {String}
         */
        extractName: function extractName(importPath) {
            return importPath.split('/').slice(0, -1).pop();
        },

        /**
         * @method extractPath
         * @param {String} importPath
         * @return {String}
         */
        extractPath: function extractPath(importPath) {
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

},{}],4:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var _log = require('./../helpers/Log.js');

var _log2 = _interopRequireWildcard(_log);

var Component = (function () {

    /**
     * @constructor
     * @param {HTMLScriptElement} script
     * @param {Template} template
     */

    function Component(_ref) {
        var script = _ref.script;
        var template = _ref.template;

        _classCallCheck(this, Component);

        this.script = script;
        this.template = template;
    }

    _createClass(Component, [{
        key: 'elementName',

        /**
         * @method elementName
         * @return {String}
         */
        value: function elementName() {
            return _utility2['default'].toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
        }
    }, {
        key: 'importLinks',

        /**
         * @method importLinks
         * @param {ShadowRoot} shadowBoundary
         * @return {Promise[]}
         */
        value: function importLinks(shadowBoundary) {
            var _this = this;

            /**
             * @method appendStyle
             * @param {String} body
             * @return {void}
             */
            function appendStyle(body) {
                var styleElement = document.createElement('style');
                styleElement.setAttribute('type', 'text/css');
                styleElement.innerHTML = body;
                shadowBoundary.appendChild(styleElement);
            }

            var content = this.template.element.content,
                linkElements = _utility2['default'].toArray(content.querySelectorAll(_utility2['default'].selector.styles)),
                styleElements = _utility2['default'].toArray(content.querySelectorAll(_utility2['default'].selector.inlines));

            return [].concat(linkElements, styleElements).map(function (element) {
                return new Promise(function (resolve) {

                    if (element.nodeName.toLowerCase() === 'style') {
                        appendStyle(element.innerHTML);
                        resolve();
                        return;
                    }

                    var href = element.getAttribute('href'),
                        url = href.match(/\.\./i) ? href : '' + _this.template.path + '/' + href;

                    // Create the associated style element and resolve the promise with it.
                    fetch(url).then(function (response) {
                        return response.text();
                    }).then(function (body) {

                        appendStyle(body);
                        resolve();
                    })['catch'](function (error) {
                        return _log2['default']('Error', error.message, '#DC143C');
                    });
                });
            });
        }
    }, {
        key: 'customElement',

        /**
         * @method customElement
         * @return {HTMLElement}
         */
        value: function customElement() {

            var name = this.elementName(),
                script = this.script,
                template = this.template,
                importLinks = this.importLinks.bind(this);

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

                        _log2['default']('Element', name, '#009ACD');
                        script.defaultProps = { path: template.path, element: this.cloneNode(true) };
                        this.innerHTML = '';

                        // Import attributes from the element and transfer to the React.js class.
                        for (var index = 0, attributes = this.attributes; index < attributes.length; index++) {

                            var attribute = attributes.item(index);

                            if (attribute.value) {
                                var _name = attribute.name.replace(/^data-/i, '');
                                script.defaultProps[_name] = attribute.value;
                            }
                        }

                        var renderedElement = React.createElement(script),
                            contentElement = document.createElement('content'),
                            shadowRoot = this.createShadowRoot();

                        shadowRoot.appendChild(contentElement);
                        React.render(renderedElement, contentElement);

                        // Import external CSS documents.
                        Promise.all(importLinks(shadowRoot)).then(function () {

                            _this2.removeAttribute('unresolved');
                            _this2.setAttribute('resolved', '');
                        })['catch'](function (error) {
                            return _log2['default']('Timeout', error.message, '#DC143C');
                        });
                    }

                }

            });
        }
    }]);

    return Component;
})();

exports['default'] = Component;
module.exports = exports['default'];

},{"./../helpers/Log.js":2,"./../helpers/Utility.js":3}],5:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

var Template = (function () {

    /**
     * @constructor
     * @param {String} name
     * @param {String} path
     * @param {HTMLTemplateElement} element
     * @return {Component}
     */

    function Template(_ref) {
        var name = _ref.name;
        var path = _ref.path;
        var element = _ref.element;

        _classCallCheck(this, Template);

        this.name = name;
        this.path = path;
        this.element = element;
    }

    _createClass(Template, [{
        key: 'thirdPartyScripts',

        /**
         * @method thirdPartyScripts
         * @return {Array}
         */
        value: function thirdPartyScripts() {
            return _utility2['default'].toArray(this.element.content.querySelectorAll(_utility2['default'].selector.scripts));
        }
    }, {
        key: 'componentScripts',

        /**
         * @method componentScripts
         * @return {Array}
         */
        value: function componentScripts() {
            return _utility2['default'].toArray(this.element.content.querySelectorAll(_utility2['default'].selector.components));
        }
    }, {
        key: 'resolveScriptPath',

        /**
         * @method resolveScriptPath
         * @param {String} scriptName
         * @return {String}
         */
        value: function resolveScriptPath(scriptName) {
            return '' + this.path + '/' + _utility2['default'].removeExtension(scriptName);
        }
    }]);

    return Template;
})();

exports['default'] = Template;
module.exports = exports['default'];

},{"./../helpers/Utility.js":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2cuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7eUJDQXNCLHVCQUF1Qjs7Ozt3QkFDdkIsc0JBQXNCOzs7O3VCQUN0QixzQkFBc0I7Ozs7bUJBQ3RCLGtCQUFrQjs7OztBQUV4QyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7OztBQU1ELFFBQUksYUFBYSxHQUFHLEtBQUssQ0FBQzs7Ozs7OztBQU8xQixhQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDcEIsZUFBUSxDQUFDLGFBQWEsS0FBSyxLQUFLLEtBQUssYUFBYSxJQUFJLEtBQUssS0FBSyxVQUFVLENBQUEsQUFBQyxDQUFFO0tBQ2hGOzs7Ozs7OztRQU9LLEtBQUs7Ozs7Ozs7QUFNSSxpQkFOVCxLQUFLLEdBTU87a0NBTlosS0FBSzs7QUFPSCx5QkFBYSxHQUFHLElBQUksQ0FBQztBQUNyQixnQkFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3pC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OztBQVNkLGFBVE0sUUFBUSxPQVNZO1lBQXZCLElBQUksUUFBSixJQUFJO1lBQUUsSUFBSSxRQUFKLElBQUk7WUFBRSxPQUFPLFFBQVAsT0FBTzs7OEJBVGhCLFFBQVE7O0FBVXJCLFlBQUksQ0FBQyxJQUFJLEdBQU0sSUFBSSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxJQUFJLEdBQU0sSUFBSSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzFCOztpQkFiZ0IsUUFBUTs7Ozs7OztlQW1CUiw2QkFBRztBQUNoQixtQkFBTyxxQkFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMscUJBQVEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDM0Y7Ozs7Ozs7O2VBTWUsNEJBQUc7QUFDZixtQkFBTyxxQkFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMscUJBQVEsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDOUY7Ozs7Ozs7OztlQU9nQiwyQkFBQyxVQUFVLEVBQUU7QUFDMUIsd0JBQVUsSUFBSSxDQUFDLElBQUksU0FBSSxxQkFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUc7U0FDaEU7OztXQXRDZ0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL21vZGVscy9Db21wb25lbnQuanMnO1xuaW1wb3J0IFRlbXBsYXRlICBmcm9tICcuL21vZGVscy9UZW1wbGF0ZS5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgIGZyb20gJy4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2cgICAgICAgZnJvbSAnLi9oZWxwZXJzL0xvZy5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgPSAnYmFiZWwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjb25zdGFudCBIQVNfSU5JVElBVEVEXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgbGV0IEhBU19JTklUSUFURUQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaXNSZWFkeVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNSZWFkeShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gKCFIQVNfSU5JVElBVEVEICYmIChzdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJyB8fCBzdGF0ZSA9PT0gJ2NvbXBsZXRlJykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBIQVNfSU5JVElBVEVEID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZmluZENvbXBvbmVudHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRDb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQ29tcG9uZW50cygpIHtcblxuICAgICAgICAgICAgW10uY29uY2F0KHRoaXMubG9hZExpbmtzKCkpLmZvckVhY2goKHByb21pc2UpID0+IHByb21pc2UudGhlbigodGVtcGxhdGVzKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMuZm9yRWFjaCgodGVtcGxhdGUpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBMb2FkIGFsbCBvZiB0aGUgcHJlcmVxdWlzaXRlcyBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5sb2FkVGhpcmRQYXJ0eVNjcmlwdHModGVtcGxhdGUpKS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlU2NyaXB0cyh0ZW1wbGF0ZSkuZm9yRWFjaCgocHJvbWlzZSkgPT4gcHJvbWlzZS50aGVuKChjb21wb25lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBjdXN0b20gZWxlbWVudCB1c2luZyB0aGUgcmVzb2x2ZWQgc2NyaXB0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nKCdUaW1lb3V0JywgZXJyb3IubWVzc2FnZSwgJyNEQzE0M0MnKSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nKCdUaW1lb3V0JywgZXJyb3IubWVzc2FnZSwgJyNEQzE0M0MnKSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBsb2coJ1RpbWVvdXQnLCBlcnJvci5tZXNzYWdlLCAnI0RDMTQzQycpKSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGxvYWRMaW5rc1xuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICAgICAqL1xuICAgICAgICBsb2FkTGlua3MoKSB7XG5cbiAgICAgICAgICAgIGxldCBsaW5rRWxlbWVudHMgPSB0aGlzLmZpbmRMaW5rcygpO1xuXG4gICAgICAgICAgICByZXR1cm4gbGlua0VsZW1lbnRzLm1hcCgobGlua0VsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBocmVmID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyksXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSB1dGlsaXR5LmV4dHJhY3ROYW1lKGhyZWYpLFxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gdXRpbGl0eS5leHRyYWN0UGF0aChocmVmKTtcblxuICAgICAgICAgICAgICAgIGxvZygnQ29tcG9uZW50JywgbmFtZSwgJyM4Qjg2NEUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgZmluZFRlbXBsYXRlc1xuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmRUZW1wbGF0ZXMgPSAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kVGVtcGxhdGVzKGxpbmtFbGVtZW50LmltcG9ydCkuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnN0YW50aWF0ZSBvdXIgY29tcG9uZW50IHdpdGggdGhlIG5hbWUsIHBhdGgsIGFuZCB0aGUgYXNzb2NpYXRlZCBlbGVtZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZSh7IG5hbWU6IG5hbWUsIHBhdGg6IHBhdGgsIGVsZW1lbnQ6IHRlbXBsYXRlRWxlbWVudCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRlbXBsYXRlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsaXR5LnRpbWVvdXRQcm9taXNlKHJlamVjdCwgYExpbms6ICR7aHJlZn1gKTtcblxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5rRWxlbWVudC5pbXBvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIGZpbmRUZW1wbGF0ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmaW5kVGVtcGxhdGVzKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgbG9hZFRoaXJkUGFydHlTY3JpcHRzXG4gICAgICAgICAqIEBwYXJhbSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgICAgICovXG4gICAgICAgIGxvYWRUaGlyZFBhcnR5U2NyaXB0cyh0ZW1wbGF0ZSkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUudGhpcmRQYXJ0eVNjcmlwdHMoKS5tYXAoKHNjcmlwdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RWxlbWVudCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzY3JpcHQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdXRpbGl0eS50aW1lb3V0UHJvbWlzZShyZWplY3QsIGBUaGlyZCBQYXJ0eTogJHtzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyl9YCk7XG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZXNvbHZlU2NyaXB0c1xuICAgICAgICAgKiBAcGFyYW0ge1RlbXBsYXRlfSB0ZW1wbGF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICAgICAqL1xuICAgICAgICByZXNvbHZlU2NyaXB0cyh0ZW1wbGF0ZSkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUuY29tcG9uZW50U2NyaXB0cygpLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdFBhdGggPSB0ZW1wbGF0ZS5yZXNvbHZlU2NyaXB0UGF0aChzY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpO1xuXG4gICAgICAgICAgICAgICAgU3lzdGVtLmltcG9ydChzY3JpcHRQYXRoKS50aGVuKChtb2R1bGVJbXBvcnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGVhY2ggc2NyaXB0IGNvbnRhaW5lZCB3aXRoaW4gdGhlIHRlbXBsYXRlIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IENvbXBvbmVudCh7IHNjcmlwdDogbW9kdWxlSW1wb3J0LmRlZmF1bHQsIHRlbXBsYXRlOiB0ZW1wbGF0ZSB9KSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHV0aWxpdHkudGltZW91dFByb21pc2UocmVqZWN0LCBgQ29tcG9uZW50OiAke3NjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKX1gKTtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBjdXN0b20gZWxlbWVudCB1c2luZyAkZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50LCBhbmQgdGhlbiBhcHBlbmRpbmdcbiAgICAgICAgICogdGhlIGFzc29jaWF0ZWQgUmVhY3QuanMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyRWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlckVsZW1lbnQoY29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBuYW1lID0gY29tcG9uZW50LmVsZW1lbnROYW1lKCk7XG5cbiAgICAgICAgICAgIGlmIChuYW1lLnNwbGl0KCctJykubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICBsb2coJ0ludmFsaWQgVGFnJywgYCR7bmFtZX1gLCAnI0RCNzA5MycpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlOiBjb21wb25lbnQuY3VzdG9tRWxlbWVudCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmluZExpbmtzXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZExpbmtzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSgkZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLmxpbmtzKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmaW5kVGVtcGxhdGVzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTERvY3VtZW50fSBbZG9jdW1lbnRSb290PSRkb2N1bWVudF1cbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kVGVtcGxhdGVzKGRvY3VtZW50Um9vdCA9ICRkb2N1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudFJvb3QucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLnRlbXBsYXRlcykpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBTdXBwb3J0IGZvciB0aGUgXCJhc3luY1wiIGF0dHJpYnV0ZSBvbiB0aGUgTWFwbGUgc2NyaXB0IGVsZW1lbnQuXG4gICAgaWYgKGlzUmVhZHkoJGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgIG5ldyBNYXBsZSgpO1xuICAgIH1cblxuICAgIC8vIE5vIGRvY3VtZW50cywgbm8gcGVyc29uLlxuICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gbmV3IE1hcGxlKCkpO1xuXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCIvL2NvbnNvbGUubG9nKCclYyAnLCAnbGluZS1oZWlnaHQ6IDEwMHB4OyBwYWRkaW5nOiAzMnB4IDEzNHB4OyBiYWNrZ3JvdW5kOiB1cmwoaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qcy9ibG9iL21hc3Rlci9tZWRpYS9jb25zb2xlLWxvZ28ucG5nP3Jhdz10cnVlKScpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG91clxuICogQHJldHVybiB7bG9nfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2cobGFiZWwsIG1lc3NhZ2UsIGNvbG91cikge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBsZXQgY29tbW9uU3R5bGVzID0gJ3RleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IGxpbmUtaGVpZ2h0OiAyMHB4OyBmb250LXNpemU6IDlweDsnO1xuXG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIGAlYyBNYXBsZSAlYyAke2xhYmVsfSAlYyAke21lc3NhZ2V9YCxcbiAgICAgICAgYCR7Y29tbW9uU3R5bGVzfSBjb2xvcjogd2hpdGU7IGJhY2tncm91bmQtY29sb3I6IGJsYWNrOyBwYWRkaW5nOiAzcHggNXB4YCxcbiAgICAgICAgYCR7Y29tbW9uU3R5bGVzfSBjb2xvcjogJHtjb2xvdXJ9OyB0ZXh0LXRyYW5zZm9ybTogbG93ZXJjYXNlYCxcbiAgICAgICAgYCR7Y29tbW9uU3R5bGVzfSBjb2xvcjogcmdiYSgwLCAwLCAwLCAuNTUpYFxuICAgICk7XG5cbn0iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IFdBSVRfVElNRU9VVFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgY29uc3QgV0FJVF9USU1FT1VUID0gMTAwMDA7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkgc2VsZWN0b3JcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgICAgICBsaW5rczogICAgICAnbGlua1tyZWw9XCJpbXBvcnRcIl06bm90KFtkYXRhLWlnbm9yZV0pJyxcbiAgICAgICAgICAgIHN0eWxlczogICAgICdsaW5rW3R5cGU9XCJ0ZXh0L2Nzc1wiXScsXG4gICAgICAgICAgICBzY3JpcHRzOiAgICAnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl1bc3JjKj1cIi4uL1wiXScsXG4gICAgICAgICAgICBpbmxpbmVzOiAgICAnc3R5bGVbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICAgICAgICAgIGNvbXBvbmVudHM6ICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXTpub3QoW3NyYyo9XCIuLi9cIl0pJyxcbiAgICAgICAgICAgIHRlbXBsYXRlczogICd0ZW1wbGF0ZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tID8gQXJyYXkuZnJvbShhcnJheUxpa2UpIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdGltZW91dFByb21pc2VcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lb3V0PVdBSVRfVElNRU9VVF1cbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHRpbWVvdXRQcm9taXNlKHJlamVjdCwgZXJyb3JNZXNzYWdlID0gJ1RpbWVvdXQnLCB0aW1lb3V0ID0gV0FJVF9USU1FT1VUKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlamVjdChuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSksIHRpbWVvdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvU25ha2VDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYW1lbENhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtqb2luZXI9Jy0nXVxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0b1NuYWtlQ2FzZShjYW1lbENhc2UsIGpvaW5lciA9ICctJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbWVsQ2FzZS5zcGxpdCgvKFtBLVpdW2Etel17MCx9KS9nKS5maWx0ZXIocGFydHMgPT4gcGFydHMpLmpvaW4oam9pbmVyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGV4dHJhY3ROYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGV4dHJhY3ROYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLnBvcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGV4dHJhY3RQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGV4dHJhY3RQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZW1vdmVFeHRlbnNpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUV4dGVuc2lvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy4nKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgbG9nICAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdFxuICAgICAqIEBwYXJhbSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeyBzY3JpcHQsIHRlbXBsYXRlIH0pIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgICA9IHNjcmlwdDtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZWxlbWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZWxlbWVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvU25ha2VDYXNlKHRoaXMuc2NyaXB0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBpbXBvcnRMaW5rc1xuICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Qm91bmRhcnlcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICovXG4gICAgaW1wb3J0TGlua3Moc2hhZG93Qm91bmRhcnkpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBhcHBlbmRTdHlsZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXBwZW5kU3R5bGUoYm9keSkge1xuICAgICAgICAgICAgbGV0IHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYm9keTtcbiAgICAgICAgICAgIHNoYWRvd0JvdW5kYXJ5LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29udGVudCAgICAgICA9IHRoaXMudGVtcGxhdGUuZWxlbWVudC5jb250ZW50LFxuICAgICAgICAgICAgbGlua0VsZW1lbnRzICA9IHV0aWxpdHkudG9BcnJheShjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci5zdHlsZXMpKSxcbiAgICAgICAgICAgIHN0eWxlRWxlbWVudHMgPSB1dGlsaXR5LnRvQXJyYXkoY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3IuaW5saW5lcykpO1xuXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQobGlua0VsZW1lbnRzLCBzdHlsZUVsZW1lbnRzKS5tYXAoKGVsZW1lbnQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgICBhcHBlbmRTdHlsZShlbGVtZW50LmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGhyZWYgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpLFxuICAgICAgICAgICAgICAgIHVybCAgPSBocmVmLm1hdGNoKC9cXC5cXC4vaSkgPyBocmVmIDogYCR7dGhpcy50ZW1wbGF0ZS5wYXRofS8ke2hyZWZ9YDtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBhc3NvY2lhdGVkIHN0eWxlIGVsZW1lbnQgYW5kIHJlc29sdmUgdGhlIHByb21pc2Ugd2l0aCBpdC5cbiAgICAgICAgICAgIGZldGNoKHVybCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKSkudGhlbigoYm9keSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgYXBwZW5kU3R5bGUoYm9keSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IGxvZygnRXJyb3InLCBlcnJvci5tZXNzYWdlLCAnI0RDMTQzQycpKTtcblxuICAgICAgICB9KSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGN1c3RvbUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjdXN0b21FbGVtZW50KCkge1xuXG4gICAgICAgIGxldCBuYW1lICAgICAgICA9IHRoaXMuZWxlbWVudE5hbWUoKSxcbiAgICAgICAgICAgIHNjcmlwdCAgICAgID0gdGhpcy5zY3JpcHQsXG4gICAgICAgICAgICB0ZW1wbGF0ZSAgICA9IHRoaXMudGVtcGxhdGUsXG4gICAgICAgICAgICBpbXBvcnRMaW5rcyA9IHRoaXMuaW1wb3J0TGlua3MuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxvZygnRWxlbWVudCcsIG5hbWUsICcjMDA5QUNEJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHRlbXBsYXRlLnBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICAgICAgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgZXh0ZXJuYWwgQ1NTIGRvY3VtZW50cy5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoaW1wb3J0TGlua3Moc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nKCdUaW1lb3V0JywgZXJyb3IubWVzc2FnZSwgJyNEQzE0M0MnKSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGUge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih7IG5hbWUsIHBhdGgsIGVsZW1lbnQgfSkge1xuICAgICAgICB0aGlzLm5hbWUgICAgPSBuYW1lO1xuICAgICAgICB0aGlzLnBhdGggICAgPSBwYXRoO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgdGhpcmRQYXJ0eVNjcmlwdHNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlyZFBhcnR5U2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3Iuc2NyaXB0cykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY29tcG9uZW50U2NyaXB0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGNvbXBvbmVudFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkodGhpcy5lbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLmNvbXBvbmVudHMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlc29sdmVTY3JpcHRQYXRoXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNjcmlwdE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgcmVzb2x2ZVNjcmlwdFBhdGgoc2NyaXB0TmFtZSkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXRofS8ke3V0aWxpdHkucmVtb3ZlRXh0ZW5zaW9uKHNjcmlwdE5hbWUpfWA7XG4gICAgfVxuXG59Il19
