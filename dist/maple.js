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

                    var url = '' + _this.template.path + '/' + element.getAttribute('href');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2cuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7eUJDQXNCLHVCQUF1Qjs7Ozt3QkFDdkIsc0JBQXNCOzs7O3VCQUN0QixzQkFBc0I7Ozs7bUJBQ3RCLGtCQUFrQjs7OztBQUV4QyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7OztBQU1ELFFBQUksYUFBYSxHQUFHLEtBQUssQ0FBQzs7Ozs7OztBQU8xQixhQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDcEIsZUFBUSxDQUFDLGFBQWEsS0FBSyxLQUFLLEtBQUssYUFBYSxJQUFJLEtBQUssS0FBSyxVQUFVLENBQUEsQUFBQyxDQUFFO0tBQ2hGOzs7Ozs7OztRQU9LLEtBQUs7Ozs7Ozs7QUFNSSxpQkFOVCxLQUFLLEdBTU87a0NBTlosS0FBSzs7QUFPSCx5QkFBYSxHQUFHLElBQUksQ0FBQztBQUNyQixnQkFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3pC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LE9BQU8sUUFBUCxPQUFPOzs4QkFUaEIsUUFBUTs7QUFVckIsWUFBSSxDQUFDLElBQUksR0FBTSxJQUFJLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBTSxJQUFJLENBQUM7QUFDcEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7S0FDMUI7O2lCQWJnQixRQUFROzs7Ozs7O2VBbUJSLDZCQUFHO0FBQ2hCLG1CQUFPLHFCQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBUSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMzRjs7Ozs7Ozs7ZUFNZSw0QkFBRztBQUNmLG1CQUFPLHFCQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBUSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUM5Rjs7Ozs7Ozs7O2VBT2dCLDJCQUFDLFVBQVUsRUFBRTtBQUMxQix3QkFBVSxJQUFJLENBQUMsSUFBSSxTQUFJLHFCQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBRztTQUNoRTs7O1dBdENnQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vbW9kZWxzL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgVGVtcGxhdGUgIGZyb20gJy4vbW9kZWxzL1RlbXBsYXRlLmpzJztcbmltcG9ydCB1dGlsaXR5ICAgZnJvbSAnLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuaW1wb3J0IGxvZyAgICAgICBmcm9tICcuL2hlbHBlcnMvTG9nLmpzJztcblxuKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmICh0eXBlb2YgU3lzdGVtICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBTeXN0ZW0udHJhbnNwaWxlciA9ICdiYWJlbCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IEhBU19JTklUSUFURURcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBsZXQgSEFTX0lOSVRJQVRFRCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBpc1JlYWR5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1JlYWR5KHN0YXRlKSB7XG4gICAgICAgIHJldHVybiAoIUhBU19JTklUSUFURUQgJiYgKHN0YXRlID09PSAnaW50ZXJhY3RpdmUnIHx8IHN0YXRlID09PSAnY29tcGxldGUnKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIEhBU19JTklUSUFURUQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5maW5kQ29tcG9uZW50cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmluZENvbXBvbmVudHNcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRDb21wb25lbnRzKCkge1xuXG4gICAgICAgICAgICBbXS5jb25jYXQodGhpcy5sb2FkTGlua3MoKSkuZm9yRWFjaCgocHJvbWlzZSkgPT4gcHJvbWlzZS50aGVuKCh0ZW1wbGF0ZXMpID0+IHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5mb3JFYWNoKCh0ZW1wbGF0ZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIExvYWQgYWxsIG9mIHRoZSBwcmVyZXF1aXNpdGVzIGZvciB0aGUgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCh0aGlzLmxvYWRUaGlyZFBhcnR5U2NyaXB0cyh0ZW1wbGF0ZSkpLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVTY3JpcHRzKHRlbXBsYXRlKS5mb3JFYWNoKChwcm9taXNlKSA9PiBwcm9taXNlLnRoZW4oKGNvbXBvbmVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nIHRoZSByZXNvbHZlZCBzY3JpcHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBsb2coJ1RpbWVvdXQnLCBlcnJvci5tZXNzYWdlLCAnI0RDMTQzQycpKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBsb2coJ1RpbWVvdXQnLCBlcnJvci5tZXNzYWdlLCAnI0RDMTQzQycpKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IGxvZygnVGltZW91dCcsIGVycm9yLm1lc3NhZ2UsICcjREMxNDNDJykpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgbG9hZExpbmtzXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgICAgICovXG4gICAgICAgIGxvYWRMaW5rcygpIHtcblxuICAgICAgICAgICAgbGV0IGxpbmtFbGVtZW50cyA9IHRoaXMuZmluZExpbmtzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaW5rRWxlbWVudHMubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgPSBsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHV0aWxpdHkuZXh0cmFjdE5hbWUoaHJlZiksXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSB1dGlsaXR5LmV4dHJhY3RQYXRoKGhyZWYpO1xuXG4gICAgICAgICAgICAgICAgbG9nKCdDb21wb25lbnQnLCBuYW1lLCAnIzhCODY0RScpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCBmaW5kVGVtcGxhdGVzXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmluZFRlbXBsYXRlcyA9ICgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmRUZW1wbGF0ZXMobGlua0VsZW1lbnQuaW1wb3J0KS5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluc3RhbnRpYXRlIG91ciBjb21wb25lbnQgd2l0aCB0aGUgbmFtZSwgcGF0aCwgYW5kIHRoZSBhc3NvY2lhdGVkIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKHsgbmFtZTogbmFtZSwgcGF0aDogcGF0aCwgZWxlbWVudDogdGVtcGxhdGVFbGVtZW50IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGVtcGxhdGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxpdHkudGltZW91dFByb21pc2UocmVqZWN0LCBgTGluazogJHtocmVmfWApO1xuXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmtFbGVtZW50LmltcG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgZmluZFRlbXBsYXRlcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZpbmRUZW1wbGF0ZXMpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBsb2FkVGhpcmRQYXJ0eVNjcmlwdHNcbiAgICAgICAgICogQHBhcmFtIHtUZW1wbGF0ZX0gdGVtcGxhdGVcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZFRoaXJkUGFydHlTY3JpcHRzKHRlbXBsYXRlKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS50aGlyZFBhcnR5U2NyaXB0cygpLm1hcCgoc2NyaXB0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ3NyYycpKTtcblxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNjcmlwdEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB1dGlsaXR5LnRpbWVvdXRQcm9taXNlKHJlamVjdCwgYFRoaXJkIFBhcnR5OiAke3NjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKX1gKTtcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlc29sdmVTY3JpcHRzXG4gICAgICAgICAqIEBwYXJhbSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgICAgICovXG4gICAgICAgIHJlc29sdmVTY3JpcHRzKHRlbXBsYXRlKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb21wb25lbnRTY3JpcHRzKCkubWFwKChzY3JpcHRFbGVtZW50KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0UGF0aCA9IHRlbXBsYXRlLnJlc29sdmVTY3JpcHRQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG5cbiAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKG1vZHVsZUltcG9ydCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgZWFjaCBzY3JpcHQgY29udGFpbmVkIHdpdGhpbiB0aGUgdGVtcGxhdGUgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgQ29tcG9uZW50KHsgc2NyaXB0OiBtb2R1bGVJbXBvcnQuZGVmYXVsdCwgdGVtcGxhdGU6IHRlbXBsYXRlIH0pKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdXRpbGl0eS50aW1lb3V0UHJvbWlzZShyZWplY3QsIGBDb21wb25lbnQ6ICR7c2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpfWApO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nICRkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQsIGFuZCB0aGVuIGFwcGVuZGluZ1xuICAgICAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgbGV0IG5hbWUgPSBjb21wb25lbnQuZWxlbWVudE5hbWUoKTtcblxuICAgICAgICAgICAgaWYgKG5hbWUuc3BsaXQoJy0nKS5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgIGxvZygnSW52YWxpZCBUYWcnLCBgJHtuYW1lfWAsICcjREI3MDkzJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgICAgICAgICBwcm90b3R5cGU6IGNvbXBvbmVudC5jdXN0b21FbGVtZW50KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmaW5kTGlua3NcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kTGlua3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KCRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3IubGlua3MpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRUZW1wbGF0ZXNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IFtkb2N1bWVudFJvb3Q9JGRvY3VtZW50XVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRUZW1wbGF0ZXMoZG9jdW1lbnRSb290ID0gJGRvY3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50Um9vdC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3IudGVtcGxhdGVzKSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZm9yIHRoZSBcImFzeW5jXCIgYXR0cmlidXRlIG9uIHRoZSBNYXBsZSBzY3JpcHQgZWxlbWVudC5cbiAgICBpZiAoaXNSZWFkeSgkZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgbmV3IE1hcGxlKCk7XG4gICAgfVxuXG4gICAgLy8gTm8gZG9jdW1lbnRzLCBubyBwZXJzb24uXG4gICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiBuZXcgTWFwbGUoKSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsIi8vY29uc29sZS5sb2coJyVjICcsICdsaW5lLWhlaWdodDogMTAwcHg7IHBhZGRpbmc6IDMycHggMTM0cHg7IGJhY2tncm91bmQ6IHVybChodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzL2Jsb2IvbWFzdGVyL21lZGlhL2NvbnNvbGUtbG9nby5wbmc/cmF3PXRydWUpJyk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3VyXG4gKiBAcmV0dXJuIHtsb2d9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZyhsYWJlbCwgbWVzc2FnZSwgY29sb3VyKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBjb21tb25TdHlsZXMgPSAndGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgbGluZS1oZWlnaHQ6IDIwcHg7IGZvbnQtc2l6ZTogOXB4Oyc7XG5cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYCVjIE1hcGxlICVjICR7bGFiZWx9ICVjICR7bWVzc2FnZX1gLFxuICAgICAgICBgJHtjb21tb25TdHlsZXN9IGNvbG9yOiB3aGl0ZTsgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7IHBhZGRpbmc6IDNweCA1cHhgLFxuICAgICAgICBgJHtjb21tb25TdHlsZXN9IGNvbG9yOiAke2NvbG91cn07IHRleHQtdHJhbnNmb3JtOiBsb3dlcmNhc2VgLFxuICAgICAgICBgJHtjb21tb25TdHlsZXN9IGNvbG9yOiByZ2JhKDAsIDAsIDAsIC41NSlgXG4gICAgKTtcblxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RhbnQgV0FJVF9USU1FT1VUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdCBXQUlUX1RJTUVPVVQgPSAxMDAwMDtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgICAgIGxpbmtzOiAgICAgICdsaW5rW3JlbD1cImltcG9ydFwiXTpub3QoW2RhdGEtaWdub3JlXSknLFxuICAgICAgICAgICAgc3R5bGVzOiAgICAgJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICAgICAgICAgIHNjcmlwdHM6ICAgICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXVtzcmMqPVwiLi4vXCJdJyxcbiAgICAgICAgICAgIGlubGluZXM6ICAgICdzdHlsZVt0eXBlPVwidGV4dC9jc3NcIl0nLFxuICAgICAgICAgICAgY29tcG9uZW50czogJ3NjcmlwdFt0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCJdOm5vdChbc3JjKj1cIi4uL1wiXSknLFxuICAgICAgICAgICAgdGVtcGxhdGVzOiAgJ3RlbXBsYXRlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20gPyBBcnJheS5mcm9tKGFycmF5TGlrZSkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0aW1lb3V0UHJvbWlzZVxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGVycm9yTWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVvdXQ9V0FJVF9USU1FT1VUXVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdGltZW91dFByb21pc2UocmVqZWN0LCBlcnJvck1lc3NhZ2UgPSAnVGltZW91dCcsIHRpbWVvdXQgPSBXQUlUX1RJTUVPVVQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpKSwgdGltZW91dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9TbmFrZUNhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2pvaW5lcj0nLSddXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRvU25ha2VDYXNlKGNhbWVsQ2FzZSwgam9pbmVyID0gJy0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FtZWxDYXNlLnNwbGl0KC8oW0EtWl1bYS16XXswLH0pL2cpLmZpbHRlcihwYXJ0cyA9PiBwYXJ0cykuam9pbihqb2luZXIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZXh0cmFjdE5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZXh0cmFjdE5hbWUoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkucG9wKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZXh0cmFjdFBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZXh0cmFjdFBhdGgoaW1wb3J0UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGltcG9ydFBhdGguc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlbW92ZUV4dGVuc2lvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRXh0ZW5zaW9uKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZVBhdGguc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2cgICAgIGZyb20gJy4vLi4vaGVscGVycy9Mb2cuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0XG4gICAgICogQHBhcmFtIHtUZW1wbGF0ZX0gdGVtcGxhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih7IHNjcmlwdCwgdGVtcGxhdGUgfSkge1xuICAgICAgICB0aGlzLnNjcmlwdCAgID0gc2NyaXB0O1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBlbGVtZW50TmFtZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBlbGVtZW50TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9TbmFrZUNhc2UodGhpcy5zY3JpcHQudG9TdHJpbmcoKS5tYXRjaCgvKD86ZnVuY3Rpb258Y2xhc3MpXFxzKihbYS16XSspL2kpWzFdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGltcG9ydExpbmtzXG4gICAgICogQHBhcmFtIHtTaGFkb3dSb290fSBzaGFkb3dCb3VuZGFyeVxuICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgKi9cbiAgICBpbXBvcnRMaW5rcyhzaGFkb3dCb3VuZGFyeSkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFwcGVuZFN0eWxlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBib2R5XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhcHBlbmRTdHlsZShib2R5KSB7XG4gICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBib2R5O1xuICAgICAgICAgICAgc2hhZG93Qm91bmRhcnkuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb250ZW50ICAgICAgID0gdGhpcy50ZW1wbGF0ZS5lbGVtZW50LmNvbnRlbnQsXG4gICAgICAgICAgICBsaW5rRWxlbWVudHMgID0gdXRpbGl0eS50b0FycmF5KGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLnN0eWxlcykpLFxuICAgICAgICAgICAgc3R5bGVFbGVtZW50cyA9IHV0aWxpdHkudG9BcnJheShjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci5pbmxpbmVzKSk7XG5cbiAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChsaW5rRWxlbWVudHMsIHN0eWxlRWxlbWVudHMpLm1hcCgoZWxlbWVudCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgICAgIGFwcGVuZFN0eWxlKGVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy50ZW1wbGF0ZS5wYXRofS8ke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBhc3NvY2lhdGVkIHN0eWxlIGVsZW1lbnQgYW5kIHJlc29sdmUgdGhlIHByb21pc2Ugd2l0aCBpdC5cbiAgICAgICAgICAgIGZldGNoKHVybCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKSkudGhlbigoYm9keSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgYXBwZW5kU3R5bGUoYm9keSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IGxvZygnRXJyb3InLCBlcnJvci5tZXNzYWdlLCAnI0RDMTQzQycpKTtcblxuICAgICAgICB9KSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGN1c3RvbUVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjdXN0b21FbGVtZW50KCkge1xuXG4gICAgICAgIGxldCBuYW1lICAgICAgICA9IHRoaXMuZWxlbWVudE5hbWUoKSxcbiAgICAgICAgICAgIHNjcmlwdCAgICAgID0gdGhpcy5zY3JpcHQsXG4gICAgICAgICAgICB0ZW1wbGF0ZSAgICA9IHRoaXMudGVtcGxhdGUsXG4gICAgICAgICAgICBpbXBvcnRMaW5rcyA9IHRoaXMuaW1wb3J0TGlua3MuYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxvZygnRWxlbWVudCcsIG5hbWUsICcjMDA5QUNEJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHRlbXBsYXRlLnBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICAgICAgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgZXh0ZXJuYWwgQ1NTIGRvY3VtZW50cy5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoaW1wb3J0TGlua3Moc2hhZG93Um9vdCkpLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndW5yZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Jlc29sdmVkJywgJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4gbG9nKCdUaW1lb3V0JywgZXJyb3IubWVzc2FnZSwgJyNEQzE0M0MnKSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGUge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih7IG5hbWUsIHBhdGgsIGVsZW1lbnQgfSkge1xuICAgICAgICB0aGlzLm5hbWUgICAgPSBuYW1lO1xuICAgICAgICB0aGlzLnBhdGggICAgPSBwYXRoO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgdGhpcmRQYXJ0eVNjcmlwdHNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlyZFBhcnR5U2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3Iuc2NyaXB0cykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY29tcG9uZW50U2NyaXB0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGNvbXBvbmVudFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkodGhpcy5lbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLmNvbXBvbmVudHMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlc29sdmVTY3JpcHRQYXRoXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNjcmlwdE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgcmVzb2x2ZVNjcmlwdFBhdGgoc2NyaXB0TmFtZSkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXRofS8ke3V0aWxpdHkucmVtb3ZlRXh0ZW5zaW9uKHNjcmlwdE5hbWUpfWA7XG4gICAgfVxuXG59Il19
