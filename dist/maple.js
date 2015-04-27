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
                                    });
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
                var _this2 = this;

                var linkElements = this.findLinks();

                return linkElements.map(function (linkElement) {

                    var href = linkElement.getAttribute('href'),
                        name = _utility2['default'].extractName(href),
                        path = _utility2['default'].extractPath(href);

                    _log2['default']('Parsing Component:', name, '#8B7E66');

                    return new Promise(function (resolve) {
                        return linkElement.addEventListener('load', function () {

                            var templates = [];

                            _this2.findTemplates(linkElement['import']).forEach(function (templateElement) {

                                // Instantiate our component with the name, path, and the associated element.
                                var template = new _Template2['default']({ name: name, path: path, element: templateElement });
                                templates.push(template);
                            });

                            resolve(templates);
                        });
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
                    return new Promise(function (resolve) {

                        var scriptElement = $document.createElement('script');
                        scriptElement.setAttribute('type', 'text/javascript');
                        scriptElement.setAttribute('src', script.getAttribute('src'));

                        scriptElement.addEventListener('load', function () {
                            resolve(scriptElement);
                        });

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
                    return new Promise(function (resolve) {

                        var scriptPath = template.resolveScriptPath(scriptElement.getAttribute('src'));

                        System['import'](scriptPath).then(function (moduleImport) {

                            // Resolve each script contained within the template element.
                            resolve(new _Component2['default']({ script: moduleImport['default'], template: template }));
                        });
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

                $document.registerElement(component.elementName(), {
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

    // No documents, no person.
    $document.addEventListener('DOMContentLoaded', function () {
        return new Maple();
    });
})(window, document);

},{"./helpers/Log.js":2,"./helpers/Utility.js":3,"./models/Component.js":4,"./models/Template.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * @constructor
 * @param {String} label
 * @param {String} message
 * @param {String} colour
 * @return {log}
 */
exports['default'] = lof;

function lof(label, message, colour) {

    'use strict';

    console.log('%c Maple.js: %c' + label + ' %c' + message, 'font-size: 11px; color: rgba(0, 0, 0, .25)', 'font-size: 11px; color: ' + colour, 'font-size: 11px; color: black');

    //console.log('Maple', label, message);
}

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
         * @property selector
         * @type {Object}
         */
        selector: {
            links: 'link[rel="import"]:not([data-ignore])',
            styles: 'link[type="text/css"]',
            scripts: 'script[type="text/javascript"]',
            components: 'script[type="text/maple-component"]',
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
        key: 'customElement',

        /**
         * @method customElement
         * @return {HTMLElement}
         */
        value: function customElement() {

            var name = this.elementName(),
                script = this.script,
                template = this.template;

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

                        _log2['default']('Registering Element:', name, '#708090');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2cuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7eUJDQXNCLHVCQUF1Qjs7Ozt3QkFDdkIsc0JBQXNCOzs7O3VCQUN0QixzQkFBc0I7Ozs7bUJBQ3RCLGtCQUFrQjs7OztBQUV4QyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7Ozs7O1FBT0ssS0FBSzs7Ozs7OztBQU1JLGlCQU5ULEtBQUssR0FNTztrQ0FOWixLQUFLOztBQU9ILGdCQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDekI7O3FCQVJDLEtBQUs7Ozs7Ozs7bUJBY08sMEJBQUc7OztBQUViLGtCQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87MkJBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLFNBQVMsRUFBSzs7QUFFekUsaUNBQVMsQ0FBQyxPQUFPLENBQUMsVUFB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QUksQ0FBQyxJQUFJLEdBQU0sSUFBSSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzFCOztpQkFiZ0IsUUFBUTs7Ozs7OztlQW1CUiw2QkFBRztBQUNoQixtQkFBTyxxQkFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMscUJBQVEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDM0Y7Ozs7Ozs7O2VBTWUsNEJBQUc7QUFDZixtQkFBTyxxQkFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMscUJBQVEsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDOUY7Ozs7Ozs7OztlQU9nQiwyQkFBQyxVQUFVLEVBQUU7QUFDMUIsd0JBQVUsSUFBSSxDQUFDLElBQUksU0FBSSxxQkFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUc7U0FDaEU7OztXQXRDZ0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL21vZGVscy9Db21wb25lbnQuanMnO1xuaW1wb3J0IFRlbXBsYXRlICBmcm9tICcuL21vZGVscy9UZW1wbGF0ZS5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgIGZyb20gJy4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2cgICAgICAgZnJvbSAnLi9oZWxwZXJzL0xvZy5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgPSAnYmFiZWwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmRDb21wb25lbnRzKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmaW5kQ29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZENvbXBvbmVudHMoKSB7XG5cbiAgICAgICAgICAgIFtdLmNvbmNhdCh0aGlzLmxvYWRMaW5rcygpKS5mb3JFYWNoKChwcm9taXNlKSA9PiBwcm9taXNlLnRoZW4oKHRlbXBsYXRlcykgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLmZvckVhY2goKHRlbXBsYXRlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCBhbGwgb2YgdGhlIHByZXJlcXVpc2l0ZXMgZm9yIHRoZSBjb21wb25lbnQuXG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHRoaXMubG9hZFRoaXJkUGFydHlTY3JpcHRzKHRlbXBsYXRlKSkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVNjcmlwdHModGVtcGxhdGUpLmZvckVhY2goKHByb21pc2UpID0+IHByb21pc2UudGhlbigoY29tcG9uZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgdGhlIHJlc29sdmVkIHNjcmlwdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBsb2FkTGlua3NcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZExpbmtzKCkge1xuXG4gICAgICAgICAgICBsZXQgbGlua0VsZW1lbnRzID0gdGhpcy5maW5kTGlua3MoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpbmtFbGVtZW50cy5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaHJlZiA9IGxpbmtFbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpLFxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdXRpbGl0eS5leHRyYWN0TmFtZShocmVmKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHV0aWxpdHkuZXh0cmFjdFBhdGgoaHJlZik7XG5cbiAgICAgICAgICAgICAgICBsb2coJ1BhcnNpbmcgQ29tcG9uZW50OicsIG5hbWUsICcjOEI3RTY2Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluZFRlbXBsYXRlcyhsaW5rRWxlbWVudC5pbXBvcnQpLmZvckVhY2goKHRlbXBsYXRlRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnN0YW50aWF0ZSBvdXIgY29tcG9uZW50IHdpdGggdGhlIG5hbWUsIHBhdGgsIGFuZCB0aGUgYXNzb2NpYXRlZCBlbGVtZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKHsgbmFtZTogbmFtZSwgcGF0aDogcGF0aCwgZWxlbWVudDogdGVtcGxhdGVFbGVtZW50IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVzLnB1c2godGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGVtcGxhdGVzKTtcblxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGxvYWRUaGlyZFBhcnR5U2NyaXB0c1xuICAgICAgICAgKiBAcGFyYW0ge1RlbXBsYXRlfSB0ZW1wbGF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICAgICAqL1xuICAgICAgICBsb2FkVGhpcmRQYXJ0eVNjcmlwdHModGVtcGxhdGUpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnRoaXJkUGFydHlTY3JpcHRzKCkubWFwKChzY3JpcHQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2NyaXB0RWxlbWVudCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3JjJykpO1xuXG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNjcmlwdEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgcmVzb2x2ZVNjcmlwdHNcbiAgICAgICAgICogQHBhcmFtIHtUZW1wbGF0ZX0gdGVtcGxhdGVcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVzb2x2ZVNjcmlwdHModGVtcGxhdGUpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbXBvbmVudFNjcmlwdHMoKS5tYXAoKHNjcmlwdEVsZW1lbnQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0UGF0aCA9IHRlbXBsYXRlLnJlc29sdmVTY3JpcHRQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG5cbiAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKG1vZHVsZUltcG9ydCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgZWFjaCBzY3JpcHQgY29udGFpbmVkIHdpdGhpbiB0aGUgdGVtcGxhdGUgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgQ29tcG9uZW50KHsgc2NyaXB0OiBtb2R1bGVJbXBvcnQuZGVmYXVsdCwgdGVtcGxhdGU6IHRlbXBsYXRlIH0pKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nICRkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQsIGFuZCB0aGVuIGFwcGVuZGluZ1xuICAgICAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgJGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQuZWxlbWVudE5hbWUoKSwge1xuICAgICAgICAgICAgICAgIHByb3RvdHlwZTogY29tcG9uZW50LmN1c3RvbUVsZW1lbnQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRMaW5rc1xuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRMaW5rcygpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoJGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci5saW5rcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmluZFRlbXBsYXRlc1xuICAgICAgICAgKiBAcGFyYW0ge0hUTUxEb2N1bWVudH0gW2RvY3VtZW50Um9vdD0kZG9jdW1lbnRdXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZFRlbXBsYXRlcyhkb2N1bWVudFJvb3QgPSAkZG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsaXR5LnRvQXJyYXkoZG9jdW1lbnRSb290LnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci50ZW1wbGF0ZXMpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gTm8gZG9jdW1lbnRzLCBubyBwZXJzb24uXG4gICAgJGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiBuZXcgTWFwbGUoKSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsIi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3VyXG4gKiBAcmV0dXJuIHtsb2d9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZihsYWJlbCwgbWVzc2FnZSwgY29sb3VyKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgJWMgTWFwbGUuanM6ICVjJHtsYWJlbH0gJWMke21lc3NhZ2V9YCxcbiAgICAgICAgJ2ZvbnQtc2l6ZTogMTFweDsgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjI1KScsXG4gICAgICAgIGBmb250LXNpemU6IDExcHg7IGNvbG9yOiAke2NvbG91cn1gLFxuICAgICAgICAnZm9udC1zaXplOiAxMXB4OyBjb2xvcjogYmxhY2snXG4gICAgKTtcblxuICAgIC8vY29uc29sZS5sb2coJ01hcGxlJywgbGFiZWwsIG1lc3NhZ2UpO1xuXG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgICAgIGxpbmtzOiAgICAgICdsaW5rW3JlbD1cImltcG9ydFwiXTpub3QoW2RhdGEtaWdub3JlXSknLFxuICAgICAgICAgICAgc3R5bGVzOiAgICAgJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICAgICAgICAgIHNjcmlwdHM6ICAgICdzY3JpcHRbdHlwZT1cInRleHQvamF2YXNjcmlwdFwiXScsXG4gICAgICAgICAgICBjb21wb25lbnRzOiAnc2NyaXB0W3R5cGU9XCJ0ZXh0L21hcGxlLWNvbXBvbmVudFwiXScsXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6ICAndGVtcGxhdGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSA/IEFycmF5LmZyb20oYXJyYXlMaWtlKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvU25ha2VDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYW1lbENhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtqb2luZXI9Jy0nXVxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0b1NuYWtlQ2FzZShjYW1lbENhc2UsIGpvaW5lciA9ICctJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbWVsQ2FzZS5zcGxpdCgvKFtBLVpdW2Etel17MCx9KS9nKS5maWx0ZXIocGFydHMgPT4gcGFydHMpLmpvaW4oam9pbmVyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGV4dHJhY3ROYW1lXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGV4dHJhY3ROYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLnBvcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGV4dHJhY3RQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGV4dHJhY3RQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZW1vdmVFeHRlbnNpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUV4dGVuc2lvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy4nKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgbG9nICAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdFxuICAgICAqIEBwYXJhbSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeyBzY3JpcHQsIHRlbXBsYXRlIH0pIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgICA9IHNjcmlwdDtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZWxlbWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZWxlbWVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvU25ha2VDYXNlKHRoaXMuc2NyaXB0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjdXN0b21FbGVtZW50XG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgY3VzdG9tRWxlbWVudCgpIHtcblxuICAgICAgICBsZXQgbmFtZSAgICAgPSB0aGlzLmVsZW1lbnROYW1lKCksXG4gICAgICAgICAgICBzY3JpcHQgICA9IHRoaXMuc2NyaXB0LFxuICAgICAgICAgICAgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9nKCdSZWdpc3RlcmluZyBFbGVtZW50OicsIG5hbWUsICcjNzA4MDkwJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHRlbXBsYXRlLnBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICAgICAgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZSB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHsgbmFtZSwgcGF0aCwgZWxlbWVudCB9KSB7XG4gICAgICAgIHRoaXMubmFtZSAgICA9IG5hbWU7XG4gICAgICAgIHRoaXMucGF0aCAgICA9IHBhdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCB0aGlyZFBhcnR5U2NyaXB0c1xuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXJkUGFydHlTY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KHRoaXMuZWxlbWVudC5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci5zY3JpcHRzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjb21wb25lbnRTY3JpcHRzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgY29tcG9uZW50U2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3IuY29tcG9uZW50cykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVzb2x2ZVNjcmlwdFBhdGhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NyaXB0TmFtZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICByZXNvbHZlU2NyaXB0UGF0aChzY3JpcHROYW1lKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnBhdGh9LyR7dXRpbGl0eS5yZW1vdmVFeHRlbnNpb24oc2NyaXB0TmFtZSl9YDtcbiAgICB9XG5cbn0iXX0=
