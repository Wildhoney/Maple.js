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
            var _this = this;

            _classCallCheck(this, Maple);

            /**
             * @property components
             * @type {Array}
             */
            this.components = [];

            $document.addEventListener('DOMContentLoaded', function () {
                _this.findComponents();
            });
        }

        _createClass(Maple, [{
            key: 'findComponents',

            /**
             * @method findComponents
             * @return {void}
             */
            value: function findComponents() {
                var _this2 = this;

                [].concat(this.loadLinks()).forEach(function (promise) {
                    return promise.then(function (templates) {

                        templates.forEach(function (template) {

                            _this2.resolveScripts(template).forEach(function (promise) {
                                return promise.then(function (component) {

                                    // Register the custom element using the resolved script.
                                    _this2.registerElement(component);
                                });
                            });

                            // Import the template element minus the Maple scripts and styles.
                            var imported = $document.importNode(template.content(), true);
                            $document.body.appendChild(imported);
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
                var _this3 = this;

                var linkElements = this.findLinks();

                return linkElements.map(function (linkElement) {

                    var href = linkElement.getAttribute('href'),
                        name = _utility2['default'].extractName(href),
                        path = _utility2['default'].extractPath(href);

                    _log2['default']('Parsing Component:', name, '#8B7E66');

                    return new Promise(function (resolve) {
                        return linkElement.addEventListener('load', function () {

                            var templates = [];

                            _this3.findTemplates(linkElement['import']).forEach(function (templateElement) {

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
            key: 'resolveScripts',

            /**
             * @method resolveScripts
             * @param {Template} template
             * @return {Promise[]}
             */
            value: function resolveScripts(template) {

                return template.scripts().map(function (scriptElement) {
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

    $window.Maple = Maple;
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
            links: 'link[rel="import"]',
            styles: 'link[type="text/css"]',
            scripts: 'script[type="text/maple"]',
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
        key: 'scripts',

        /**
         * @method getScripts
         * @return {Array}
         */
        value: function scripts() {
            return _utility2['default'].toArray(this.element.content.querySelectorAll(_utility2['default'].selector.scripts));
        }
    }, {
        key: 'content',

        /**
         * @method content
         * @return {DocumentFragment}
         */
        value: function content() {

            var cloned = this.element.cloneNode(true).content,
                styles = _utility2['default'].toArray(cloned.querySelectorAll(_utility2['default'].selector.styles)),
                scripts = _utility2['default'].toArray(cloned.querySelectorAll(_utility2['default'].selector.scripts));

            [].concat(styles, scripts).forEach(function (node) {
                node.remove();
            });

            return cloned;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Mb2cuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7eUJDQXNCLHVCQUF1Qjs7Ozt3QkFDdkIsc0JBQXNCOzs7O3VCQUN0QixzQkFBc0I7Ozs7bUJBQ3RCLGtCQUFrQjs7OztBQUV4QyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7O0FBRWIsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDL0IsY0FBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDL0I7Ozs7Ozs7O1FBT0ssS0FBSzs7Ozs7OztBQU1JLGlCQU5ULEtBQUssR0FNTzs7O2tDQU5aLEtBQUs7Ozs7OztBQVlILGdCQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIscUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0FBQ2pELHNCQUFLLGNBQWMsRUFBRSxDQUFDO2FBQ3pCLENBQUMsQ0FBQztTQUVOOztxQkFsQkMsS0FBSzs7Ozs7OzttQkF3Qk8sMEJBQUc7OztBQUViLGtCQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUs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QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMscUJBQVEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0FBRWpGLGNBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN6QyxvQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2pCLENBQUMsQ0FBQzs7QUFFSCxtQkFBTyxNQUFNLENBQUM7U0FFakI7Ozs7Ozs7OztlQU9nQiwyQkFBQyxVQUFVLEVBQUU7QUFDMUIsd0JBQVUsSUFBSSxDQUFDLElBQUksU0FBSSxxQkFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUc7U0FDaEU7OztXQWhEZ0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL21vZGVscy9Db21wb25lbnQuanMnO1xuaW1wb3J0IFRlbXBsYXRlICBmcm9tICcuL21vZGVscy9UZW1wbGF0ZS5qcyc7XG5pbXBvcnQgdXRpbGl0eSAgIGZyb20gJy4vaGVscGVycy9VdGlsaXR5LmpzJztcbmltcG9ydCBsb2cgICAgICAgZnJvbSAnLi9oZWxwZXJzL0xvZy5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgPSAnYmFiZWwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtb2R1bGUgTWFwbGVcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKi9cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHByb3BlcnR5IGNvbXBvbmVudHNcbiAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG5cbiAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmluZENvbXBvbmVudHMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmaW5kQ29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZENvbXBvbmVudHMoKSB7XG5cbiAgICAgICAgICAgIFtdLmNvbmNhdCh0aGlzLmxvYWRMaW5rcygpKS5mb3JFYWNoKChwcm9taXNlKSA9PiBwcm9taXNlLnRoZW4oKHRlbXBsYXRlcykgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLmZvckVhY2goKHRlbXBsYXRlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlU2NyaXB0cyh0ZW1wbGF0ZSkuZm9yRWFjaCgocHJvbWlzZSkgPT4gcHJvbWlzZS50aGVuKChjb21wb25lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nIHRoZSByZXNvbHZlZCBzY3JpcHQuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgdGhlIHRlbXBsYXRlIGVsZW1lbnQgbWludXMgdGhlIE1hcGxlIHNjcmlwdHMgYW5kIHN0eWxlcy5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydGVkID0gJGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCgpLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1wb3J0ZWQpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgbG9hZExpbmtzXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbiAgICAgICAgICovXG4gICAgICAgIGxvYWRMaW5rcygpIHtcblxuICAgICAgICAgICAgbGV0IGxpbmtFbGVtZW50cyA9IHRoaXMuZmluZExpbmtzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaW5rRWxlbWVudHMubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgPSBsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHV0aWxpdHkuZXh0cmFjdE5hbWUoaHJlZiksXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSB1dGlsaXR5LmV4dHJhY3RQYXRoKGhyZWYpO1xuXG4gICAgICAgICAgICAgICAgbG9nKCdQYXJzaW5nIENvbXBvbmVudDonLCBuYW1lLCAnIzhCN0U2NicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmRUZW1wbGF0ZXMobGlua0VsZW1lbnQuaW1wb3J0KS5mb3JFYWNoKCh0ZW1wbGF0ZUVsZW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5zdGFudGlhdGUgb3VyIGNvbXBvbmVudCB3aXRoIHRoZSBuYW1lLCBwYXRoLCBhbmQgdGhlIGFzc29jaWF0ZWQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZSh7IG5hbWU6IG5hbWUsIHBhdGg6IHBhdGgsIGVsZW1lbnQ6IHRlbXBsYXRlRWxlbWVudCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRlbXBsYXRlcyk7XG5cbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZXNvbHZlU2NyaXB0c1xuICAgICAgICAgKiBAcGFyYW0ge1RlbXBsYXRlfSB0ZW1wbGF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlW119XG4gICAgICAgICAqL1xuICAgICAgICByZXNvbHZlU2NyaXB0cyh0ZW1wbGF0ZSkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUuc2NyaXB0cygpLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRQYXRoID0gdGVtcGxhdGUucmVzb2x2ZVNjcmlwdFBhdGgoc2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpKTtcblxuICAgICAgICAgICAgICAgIFN5c3RlbS5pbXBvcnQoc2NyaXB0UGF0aCkudGhlbigobW9kdWxlSW1wb3J0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBlYWNoIHNjcmlwdCBjb250YWluZWQgd2l0aGluIHRoZSB0ZW1wbGF0ZSBlbGVtZW50LlxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBDb21wb25lbnQoeyBzY3JpcHQ6IG1vZHVsZUltcG9ydC5kZWZhdWx0LCB0ZW1wbGF0ZTogdGVtcGxhdGUgfSkpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgJGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCwgYW5kIHRoZW4gYXBwZW5kaW5nXG4gICAgICAgICAqIHRoZSBhc3NvY2lhdGVkIFJlYWN0LmpzIGNvbXBvbmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCByZWdpc3RlckVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVnaXN0ZXJFbGVtZW50KGNvbXBvbmVudCkge1xuXG4gICAgICAgICAgICAkZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGNvbXBvbmVudC5lbGVtZW50TmFtZSgpLCB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlOiBjb21wb25lbnQuY3VzdG9tRWxlbWVudCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZmluZExpbmtzXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZExpbmtzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSgkZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLmxpbmtzKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmaW5kVGVtcGxhdGVzXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTERvY3VtZW50fSBbZG9jdW1lbnRSb290PSRkb2N1bWVudF1cbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBmaW5kVGVtcGxhdGVzKGRvY3VtZW50Um9vdCA9ICRkb2N1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheShkb2N1bWVudFJvb3QucXVlcnlTZWxlY3RvckFsbCh1dGlsaXR5LnNlbGVjdG9yLnRlbXBsYXRlcykpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAkd2luZG93Lk1hcGxlID0gTWFwbGU7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsIi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sb3VyXG4gKiBAcmV0dXJuIHtsb2d9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZihsYWJlbCwgbWVzc2FnZSwgY29sb3VyKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgJWMgTWFwbGUuanM6ICVjJHtsYWJlbH0gJWMke21lc3NhZ2V9YCxcbiAgICAgICAgJ2ZvbnQtc2l6ZTogMTFweDsgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjI1KScsXG4gICAgICAgIGBmb250LXNpemU6IDExcHg7IGNvbG9yOiAke2NvbG91cn1gLFxuICAgICAgICAnZm9udC1zaXplOiAxMXB4OyBjb2xvcjogYmxhY2snXG4gICAgKTtcblxuICAgIC8vY29uc29sZS5sb2coJ01hcGxlJywgbGFiZWwsIG1lc3NhZ2UpO1xuXG59IiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgICAgIGxpbmtzOiAgICAgJ2xpbmtbcmVsPVwiaW1wb3J0XCJdJyxcbiAgICAgICAgICAgIHN0eWxlczogICAgJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICAgICAgICAgIHNjcmlwdHM6ICAgJ3NjcmlwdFt0eXBlPVwidGV4dC9tYXBsZVwiXScsXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6ICd0ZW1wbGF0ZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheShhcnJheUxpa2UpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tID8gQXJyYXkuZnJvbShhcnJheUxpa2UpIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9TbmFrZUNhc2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2pvaW5lcj0nLSddXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRvU25ha2VDYXNlKGNhbWVsQ2FzZSwgam9pbmVyID0gJy0nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FtZWxDYXNlLnNwbGl0KC8oW0EtWl1bYS16XXswLH0pL2cpLmZpbHRlcihwYXJ0cyA9PiBwYXJ0cykuam9pbihqb2luZXIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZXh0cmFjdE5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgICAgIGV4dHJhY3ROYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLnBvcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGV4dHJhY3RQYXRoXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpbXBvcnRQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGV4dHJhY3RQYXRoKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZW1vdmVFeHRlbnNpb25cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUV4dGVuc2lvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KCcuJykuc2xpY2UoMCwgLTEpLmpvaW4oJy4nKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSkoKTsiLCJpbXBvcnQgdXRpbGl0eSBmcm9tICcuLy4uL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5pbXBvcnQgbG9nICAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdFxuICAgICAqIEBwYXJhbSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeyBzY3JpcHQsIHRlbXBsYXRlIH0pIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgICA9IHNjcmlwdDtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZWxlbWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZWxlbWVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvU25ha2VDYXNlKHRoaXMuc2NyaXB0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjdXN0b21FbGVtZW50XG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgY3VzdG9tRWxlbWVudCgpIHtcblxuICAgICAgICBsZXQgbmFtZSAgICAgPSB0aGlzLmVsZW1lbnROYW1lKCksXG4gICAgICAgICAgICBzY3JpcHQgICA9IHRoaXMuc2NyaXB0LFxuICAgICAgICAgICAgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbG9nKCdSZWdpc3RlcmluZyBFbGVtZW50OicsIG5hbWUsICcjNzA4MDkwJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHRlbXBsYXRlLnBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICAgICAgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZSB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHsgbmFtZSwgcGF0aCwgZWxlbWVudCB9KSB7XG4gICAgICAgIHRoaXMubmFtZSAgICA9IG5hbWU7XG4gICAgICAgIHRoaXMucGF0aCAgICA9IHBhdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRTY3JpcHRzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKHV0aWxpdHkuc2VsZWN0b3Iuc2NyaXB0cykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY29udGVudFxuICAgICAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gICAgICovXG4gICAgY29udGVudCgpIHtcblxuICAgICAgICBsZXQgY2xvbmVkICA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkuY29udGVudCxcbiAgICAgICAgICAgIHN0eWxlcyAgPSB1dGlsaXR5LnRvQXJyYXkoY2xvbmVkLnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci5zdHlsZXMpKSxcbiAgICAgICAgICAgIHNjcmlwdHMgPSB1dGlsaXR5LnRvQXJyYXkoY2xvbmVkLnF1ZXJ5U2VsZWN0b3JBbGwodXRpbGl0eS5zZWxlY3Rvci5zY3JpcHRzKSk7XG5cbiAgICAgICAgW10uY29uY2F0KHN0eWxlcywgc2NyaXB0cykuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNsb25lZDtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVzb2x2ZVNjcmlwdFBhdGhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NyaXB0TmFtZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICByZXNvbHZlU2NyaXB0UGF0aChzY3JpcHROYW1lKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnBhdGh9LyR7dXRpbGl0eS5yZW1vdmVFeHRlbnNpb24oc2NyaXB0TmFtZSl9YDtcbiAgICB9XG5cbn0iXX0=
