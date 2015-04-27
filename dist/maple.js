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

(function main($window, $document) {

    'use strict';

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
    }

    /**
     * @constant SELECTOR
     * @type {Object}
     */
    var SELECTOR = {
        LINKS: 'link[rel="import"]',
        TEMPLATES: 'template',
        STYLES: 'link[type="text/css"]',
        SCRIPTS: 'script[type="text/maple"]'
    };

    /**
     * @module Maple
     * @link https://github.com/Wildhoney/Maple.js
     * @author Adam Timberlake
     */

    var Maple = (function () {

        /**
         * @constructor
         * @param {Array} blacklist
         * @return {void}
         */

        function Maple() {
            var _this = this;

            for (var _len = arguments.length, blacklist = Array(_len), _key = 0; _key < _len; _key++) {
                blacklist[_key] = arguments[_key];
            }

            _classCallCheck(this, Maple);

            /**
             * @property components
             * @type {Array}
             */
            this.components = [];

            $document.addEventListener('DOMContentLoaded', function () {
                _this.findComponents.apply(_this, blacklist);
            });
        }

        _createClass(Maple, [{
            key: 'findComponents',

            /**
             * @method findComponents
             * @param {Array} blacklist
             * @return {void}
             */
            value: function findComponents() {
                var _this2 = this;

                for (var _len2 = arguments.length, blacklist = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    blacklist[_key2] = arguments[_key2];
                }

                void blacklist;

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

                var linkElements = _utility2['default'].toArray($document.querySelectorAll(SELECTOR.LINKS));

                return linkElements.map(function (linkElement) {

                    var href = linkElement.getAttribute('href'),
                        path = _utility2['default'].modulePath(href),
                        name = _utility2['default'].moduleName(href);

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
            key: 'findTemplates',

            /**
             * @method findTemplates
             * @param {HTMLDocument} [documentRoot=$document]
             * @return {Array}
             */
            value: function findTemplates() {
                var documentRoot = arguments[0] === undefined ? $document : arguments[0];

                return _utility2['default'].toArray(documentRoot.querySelectorAll(SELECTOR.TEMPLATES));
            }
        }]);

        return Maple;
    })();

    $window.Maple = Maple;
})(window, document);

},{"./helpers/Utility.js":2,"./models/Component.js":3,"./models/Template.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    return {

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
         * @method getBase
         * @param {String} name
         * @return {String}
         */
        getBase: function getBase(name) {
            return name.split('.').slice(0, -1).join('/');
        },

        /**
         * @method modulePath
         * @param {String} importPath
         * @return {String}
         */
        modulePath: function modulePath(importPath) {
            return importPath.split('/').slice(0, -1).join('/');
        },

        /**
         * @method moduleName
         * @param {String} importPath
         * @return {String}
         */
        moduleName: function moduleName(importPath) {
            return importPath.split('/').slice(0, -1).pop();
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

},{}],3:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _utility = require('./../helpers/Utility.js');

var _utility2 = _interopRequireWildcard(_utility);

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

            var script = this.script,
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

},{"./../helpers/Utility.js":2}],4:[function(require,module,exports){
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
            return _utility2['default'].toArray(this.element.content.querySelectorAll('script[type="text/maple"]'));
        }
    }, {
        key: 'content',

        /**
         * @method content
         * @return {DocumentFragment}
         */
        value: function content() {

            var cloned = this.element.cloneNode(true).content,
                styles = _utility2['default'].toArray(cloned.querySelectorAll('link[type="text/css"]')),
                scripts = _utility2['default'].toArray(cloned.querySelectorAll('script[type="text/maple"]'));

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

//import events     from './../helpers/Events.js';
//import css        from './../helpers/Stylesheets.js';
//import utility    from './../helpers/Utility.js';
//import logger     from './../helpers/Logger.js';
//
///**
// * @constant SELECTOR
// * @type {Object}
// */
//const SELECTOR = {
//    LINKS:     'link[rel="import"]',
//    TEMPLATES: 'template',
//    STYLES:    'link[type="text/css"]',
//    SCRIPTS:   'script[type="text/javascript"]'
//};
//
///**
// * @module Maple
// * @submodule Register
// * @link https://github.com/Wildhoney/Maple.js
// * @author Adam Timberlake
// */
//export default class Register {
//
//    /**
//     * @constructor
//     * @param {Array} modules
//     * @return {Register}
//     */
//    constructor(...modules) {
//        this.register(...modules);
//    }
//
//    /**
//     * @method register
//     * @param {Array} modules
//     * @return {void}
//     */
//    register(...modules) {
//
//        [].concat(this.loadLinks()).forEach((promise) => {
//
//            promise.then((component) => {
//
//                if (modules.length && !~modules.indexOf(component.moduleName)) {
//                    return;
//                }
//
//                component.scripts.forEach((script) => {
//
//                    System.import(script).then((moduleImport) => {
//
//                        let componentName = moduleImport.default.toString().match(/(?:function|class)\s*([a-z]+)/i)[1];
//                        this.registerElement(componentName, moduleImport.default, component.modulePath, component.styles);
//
//                    });
//
//                });
//
//            });
//
//        });
//
//    }
//
//    /**
//     * @method loadLinks
//     * @return {Promise[]}
//     */
//    loadLinks() {
//
//        return utility.toArray(document.querySelectorAll(SELECTOR.LINKS)).map((linkElement) => {
//
//            return new Promise((resolve) => {
//
//                linkElement.addEventListener('load', () => {
//
//                    let hrefAttribute   = linkElement.getAttribute('href'),
//                        modulePath      = utility.getModulePath(hrefAttribute),
//                        moduleName      = utility.getModuleName(hrefAttribute),
//                        templateElement = linkElement.import.querySelector(SELECTOR.TEMPLATES);
//
//                    resolve({
//                        path: modulePath,
//                        name: moduleName,
//                        styles: utility.toArray(templateElement.content.querySelectorAll(SELECTOR.STYLES)).map((linkElement) => {
//                            return `${modulePath}/${linkElement.getAttribute('href')}`;
//                        }),
//                        scripts: utility.toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS)).map((scriptElement) => {
//                            return `${modulePath}/${utility.getBase(scriptElement.getAttribute('src'))}`;
//                        })
//                    });
//
//                });
//
//            });
//
//        });
//
//    }
//
//    /**
//     * Responsible for creating the custom element using document.registerElement, and then appending
//     * the associated React.js component.
//     *
//     * @method registerElement
//     * @param {String} className
//     * @param {Object} component
//     * @param {String} modulePath
//     * @param {Array} styles
//     * @return {void}
//     */
//    registerElement(className, component, modulePath, styles) {
//
//        let elementName = utility.toSnakeCase(className),
//            prototype   = Object.create(HTMLElement.prototype, {
//
//            /**
//             * @property attachedCallback
//             * @type {Object}
//             */
//            attachedCallback: {
//
//                /**
//                 * @method value
//                 * @return {void}
//                 */
//                value: function value() {
//
//                    component.defaultProps = { path: modulePath, element: this.cloneNode(true) };
//                    this.innerHTML         = '';
//
//                    // Import attributes from the element and transfer to the React.js class.
//                    for (let index = 0, attributes = this.attributes; index < attributes.length; index++) {
//
//                        let attribute = attributes.item(index);
//
//                        if (attribute.value) {
//                            let name = attribute.name.replace(/^data-/i, '');
//                            component.defaultProps[name] = attribute.value;
//                        }
//
//                    }
//
//                    let renderedElement = React.createElement(component),
//                        contentElement  = document.createElement('content'),
//                        shadowRoot      = this.createShadowRoot();
//
//                    shadowRoot.appendChild(contentElement);
//                    events.delegate(contentElement, React.render(renderedElement, contentElement));
//
//                    Promise.all(css.associate(styles, shadowRoot)).then(() => {
//                        this.removeAttribute('unresolved');
//                        this.setAttribute('resolved', '');
//                    });
//
//                }
//
//            }
//
//        });
//
//        document.registerElement(elementName, {
//            prototype: prototype
//        });
//
//    }
//
//}

},{"./../helpers/Utility.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9VdGlsaXR5LmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL21vZGVscy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvbW9kZWxzL1RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7eUJDQXNCLHVCQUF1Qjs7Ozt3QkFDdkIsc0JBQXNCOzs7O3VCQUN0QixzQkFBc0I7Ozs7QUFFNUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFOztBQUUvQixnQkFBWSxDQUFDOztBQUViLFFBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO0FBQy9CLGNBQU0sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0tBQy9COzs7Ozs7QUFNRCxRQUFNLFFBQVEsR0FBRztBQUNiLGFBQUssRUFBTSxvQkFBb0I7QUFDL0IsaUJBQVMsRUFBRSxVQUFVO0FBQ3JCLGNBQU0sRUFBSyx1QkFBdUI7QUFDbEMsZUFBTyxFQUFJLDJCQUEyQjtLQUN6QyxDQUFDOzs7Ozs7OztRQU9JLEtBQUs7Ozs7Ozs7O0FBT0ksaUJBUFQsS0FBSyxHQU9tQjs7OzhDQUFYLFNBQVM7QUFBVCx5QkFBUzs7O2tDQVB0QixLQUFLOzs7Ozs7QUFhSCxnQkFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLHFCQUFTLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBTTtBQUNqRCxzQkFBSyxjQUFjLE1BQUEsUUFBSSxTQUFTLENBQUMsQ0FBQzthQUNyQyxD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QUFDLFVBQVUsQ0FBQyxDQUFHO1NBQ2hFOzs7V0FoRGdCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9tb2RlbHMvQ29tcG9uZW50LmpzJztcbmltcG9ydCBUZW1wbGF0ZSAgZnJvbSAnLi9tb2RlbHMvVGVtcGxhdGUuanMnO1xuaW1wb3J0IHV0aWxpdHkgICBmcm9tICcuL2hlbHBlcnMvVXRpbGl0eS5qcyc7XG5cbihmdW5jdGlvbiBtYWluKCR3aW5kb3csICRkb2N1bWVudCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodHlwZW9mIFN5c3RlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgU3lzdGVtLnRyYW5zcGlsZXIgPSAnYmFiZWwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjb25zdGFudCBTRUxFQ1RPUlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgU0VMRUNUT1IgPSB7XG4gICAgICAgIExJTktTOiAgICAgJ2xpbmtbcmVsPVwiaW1wb3J0XCJdJyxcbiAgICAgICAgVEVNUExBVEVTOiAndGVtcGxhdGUnLFxuICAgICAgICBTVFlMRVM6ICAgICdsaW5rW3R5cGU9XCJ0ZXh0L2Nzc1wiXScsXG4gICAgICAgIFNDUklQVFM6ICAgJ3NjcmlwdFt0eXBlPVwidGV4dC9tYXBsZVwiXSdcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGJsYWNrbGlzdFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYmxhY2tsaXN0KSB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHByb3BlcnR5IGNvbXBvbmVudHNcbiAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG5cbiAgICAgICAgICAgICRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmluZENvbXBvbmVudHMoLi4uYmxhY2tsaXN0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBmaW5kQ29tcG9uZW50c1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBibGFja2xpc3RcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRDb21wb25lbnRzKC4uLmJsYWNrbGlzdCkge1xuXG4gICAgICAgICAgICB2b2lkIGJsYWNrbGlzdDtcblxuICAgICAgICAgICAgW10uY29uY2F0KHRoaXMubG9hZExpbmtzKCkpLmZvckVhY2goKHByb21pc2UpID0+IHByb21pc2UudGhlbigodGVtcGxhdGVzKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMuZm9yRWFjaCgodGVtcGxhdGUpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVTY3JpcHRzKHRlbXBsYXRlKS5mb3JFYWNoKChwcm9taXNlKSA9PiBwcm9taXNlLnRoZW4oKGNvbXBvbmVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgY3VzdG9tIGVsZW1lbnQgdXNpbmcgdGhlIHJlc29sdmVkIHNjcmlwdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCB0aGUgdGVtcGxhdGUgZWxlbWVudCBtaW51cyB0aGUgTWFwbGUgc2NyaXB0cyBhbmQgc3R5bGVzLlxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1wb3J0ZWQgPSAkZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50KCksIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbXBvcnRlZCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBsb2FkTGlua3NcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZExpbmtzKCkge1xuXG4gICAgICAgICAgICBsZXQgbGlua0VsZW1lbnRzID0gdXRpbGl0eS50b0FycmF5KCRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLkxJTktTKSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaW5rRWxlbWVudHMubWFwKChsaW5rRWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgPSBsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHV0aWxpdHkubW9kdWxlUGF0aChocmVmKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHV0aWxpdHkubW9kdWxlTmFtZShocmVmKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gbGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kVGVtcGxhdGVzKGxpbmtFbGVtZW50LmltcG9ydCkuZm9yRWFjaCgodGVtcGxhdGVFbGVtZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluc3RhbnRpYXRlIG91ciBjb21wb25lbnQgd2l0aCB0aGUgbmFtZSwgcGF0aCwgYW5kIHRoZSBhc3NvY2lhdGVkIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoeyBuYW1lOiBuYW1lLCBwYXRoOiBwYXRoLCBlbGVtZW50OiB0ZW1wbGF0ZUVsZW1lbnQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0ZW1wbGF0ZXMpO1xuXG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgcmVzb2x2ZVNjcmlwdHNcbiAgICAgICAgICogQHBhcmFtIHtUZW1wbGF0ZX0gdGVtcGxhdGVcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZVtdfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVzb2x2ZVNjcmlwdHModGVtcGxhdGUpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnNjcmlwdHMoKS5tYXAoKHNjcmlwdEVsZW1lbnQpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0UGF0aCA9IHRlbXBsYXRlLnJlc29sdmVTY3JpcHRQYXRoKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG5cbiAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdFBhdGgpLnRoZW4oKG1vZHVsZUltcG9ydCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgZWFjaCBzY3JpcHQgY29udGFpbmVkIHdpdGhpbiB0aGUgdGVtcGxhdGUgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgQ29tcG9uZW50KHsgc2NyaXB0OiBtb2R1bGVJbXBvcnQuZGVmYXVsdCwgdGVtcGxhdGU6IHRlbXBsYXRlIH0pKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nICRkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQsIGFuZCB0aGVuIGFwcGVuZGluZ1xuICAgICAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgJGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChjb21wb25lbnQuZWxlbWVudE5hbWUoKSwge1xuICAgICAgICAgICAgICAgIHByb3RvdHlwZTogY29tcG9uZW50LmN1c3RvbUVsZW1lbnQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRUZW1wbGF0ZXNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRG9jdW1lbnR9IFtkb2N1bWVudFJvb3Q9JGRvY3VtZW50XVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRUZW1wbGF0ZXMoZG9jdW1lbnRSb290ID0gJGRvY3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50Um9vdC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SLlRFTVBMQVRFUykpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAkd2luZG93Lk1hcGxlID0gTWFwbGU7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20gPyBBcnJheS5mcm9tKGFycmF5TGlrZSkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJyYXlMaWtlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0b1NuYWtlQ2FzZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxDYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbam9pbmVyPSctJ11cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TbmFrZUNhc2UoY2FtZWxDYXNlLCBqb2luZXIgPSAnLScpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW1lbENhc2Uuc3BsaXQoLyhbQS1aXVthLXpdezAsfSkvZykuZmlsdGVyKHBhcnRzID0+IHBhcnRzKS5qb2luKGpvaW5lcikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBnZXRCYXNlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldEJhc2UobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWUuc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIG1vZHVsZVBhdGhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltcG9ydFBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlUGF0aChpbXBvcnRQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1wb3J0UGF0aC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgbW9kdWxlTmFtZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW1wb3J0UGF0aFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGVOYW1lKGltcG9ydFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbXBvcnRQYXRoLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLnBvcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHJlbW92ZUV4dGVuc2lvblxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGhcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRXh0ZW5zaW9uKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZVBhdGguc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCB1dGlsaXR5IGZyb20gJy4vLi4vaGVscGVycy9VdGlsaXR5LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdFxuICAgICAqIEBwYXJhbSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeyBzY3JpcHQsIHRlbXBsYXRlIH0pIHtcbiAgICAgICAgdGhpcy5zY3JpcHQgICA9IHNjcmlwdDtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZWxlbWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZWxlbWVudE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB1dGlsaXR5LnRvU25ha2VDYXNlKHRoaXMuc2NyaXB0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjdXN0b21FbGVtZW50XG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgY3VzdG9tRWxlbWVudCgpIHtcblxuICAgICAgICBsZXQgc2NyaXB0ICAgPSB0aGlzLnNjcmlwdCxcbiAgICAgICAgICAgIHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IHRlbXBsYXRlLnBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MICAgICAgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlczsgaW5kZXggPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuZGVmYXVsdFByb3BzW25hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChzY3JpcHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59IiwiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZSB7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHsgbmFtZSwgcGF0aCwgZWxlbWVudCB9KSB7XG4gICAgICAgIHRoaXMubmFtZSAgICA9IG5hbWU7XG4gICAgICAgIHRoaXMucGF0aCAgICA9IHBhdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRTY3JpcHRzXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxpdHkudG9BcnJheSh0aGlzLmVsZW1lbnQuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvbWFwbGVcIl0nKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjb250ZW50XG4gICAgICogQHJldHVybiB7RG9jdW1lbnRGcmFnbWVudH1cbiAgICAgKi9cbiAgICBjb250ZW50KCkge1xuXG4gICAgICAgIGxldCBjbG9uZWQgID0gdGhpcy5lbGVtZW50LmNsb25lTm9kZSh0cnVlKS5jb250ZW50LFxuICAgICAgICAgICAgc3R5bGVzICA9IHV0aWxpdHkudG9BcnJheShjbG9uZWQucXVlcnlTZWxlY3RvckFsbCgnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nKSksXG4gICAgICAgICAgICBzY3JpcHRzID0gdXRpbGl0eS50b0FycmF5KGNsb25lZC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvbWFwbGVcIl0nKSk7XG5cbiAgICAgICAgW10uY29uY2F0KHN0eWxlcywgc2NyaXB0cykuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNsb25lZDtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVzb2x2ZVNjcmlwdFBhdGhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NyaXB0TmFtZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICByZXNvbHZlU2NyaXB0UGF0aChzY3JpcHROYW1lKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnBhdGh9LyR7dXRpbGl0eS5yZW1vdmVFeHRlbnNpb24oc2NyaXB0TmFtZSl9YDtcbiAgICB9XG5cbn1cblxuLy9pbXBvcnQgZXZlbnRzICAgICBmcm9tICcuLy4uL2hlbHBlcnMvRXZlbnRzLmpzJztcbi8vaW1wb3J0IGNzcyAgICAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzJztcbi8vaW1wb3J0IHV0aWxpdHkgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1V0aWxpdHkuanMnO1xuLy9pbXBvcnQgbG9nZ2VyICAgICBmcm9tICcuLy4uL2hlbHBlcnMvTG9nZ2VyLmpzJztcbi8vXG4vLy8qKlxuLy8gKiBAY29uc3RhbnQgU0VMRUNUT1Jcbi8vICogQHR5cGUge09iamVjdH1cbi8vICovXG4vL2NvbnN0IFNFTEVDVE9SID0ge1xuLy8gICAgTElOS1M6ICAgICAnbGlua1tyZWw9XCJpbXBvcnRcIl0nLFxuLy8gICAgVEVNUExBVEVTOiAndGVtcGxhdGUnLFxuLy8gICAgU1RZTEVTOiAgICAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuLy8gICAgU0NSSVBUUzogICAnc2NyaXB0W3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0nXG4vL307XG4vL1xuLy8vKipcbi8vICogQG1vZHVsZSBNYXBsZVxuLy8gKiBAc3VibW9kdWxlIFJlZ2lzdGVyXG4vLyAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbi8vICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2Vcbi8vICovXG4vL2V4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdGVyIHtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIEBjb25zdHJ1Y3RvclxuLy8gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuLy8gICAgICogQHJldHVybiB7UmVnaXN0ZXJ9XG4vLyAgICAgKi9cbi8vICAgIGNvbnN0cnVjdG9yKC4uLm1vZHVsZXMpIHtcbi8vICAgICAgICB0aGlzLnJlZ2lzdGVyKC4uLm1vZHVsZXMpO1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQG1ldGhvZCByZWdpc3RlclxuLy8gICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuLy8gICAgICogQHJldHVybiB7dm9pZH1cbi8vICAgICAqL1xuLy8gICAgcmVnaXN0ZXIoLi4ubW9kdWxlcykge1xuLy9cbi8vICAgICAgICBbXS5jb25jYXQodGhpcy5sb2FkTGlua3MoKSkuZm9yRWFjaCgocHJvbWlzZSkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgcHJvbWlzZS50aGVuKChjb21wb25lbnQpID0+IHtcbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAobW9kdWxlcy5sZW5ndGggJiYgIX5tb2R1bGVzLmluZGV4T2YoY29tcG9uZW50Lm1vZHVsZU5hbWUpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zY3JpcHRzLmZvckVhY2goKHNjcmlwdCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBTeXN0ZW0uaW1wb3J0KHNjcmlwdCkudGhlbigobW9kdWxlSW1wb3J0KSA9PiB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50TmFtZSA9IG1vZHVsZUltcG9ydC5kZWZhdWx0LnRvU3RyaW5nKCkubWF0Y2goLyg/OmZ1bmN0aW9ufGNsYXNzKVxccyooW2Etel0rKS9pKVsxXTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoY29tcG9uZW50TmFtZSwgbW9kdWxlSW1wb3J0LmRlZmF1bHQsIGNvbXBvbmVudC5tb2R1bGVQYXRoLCBjb21wb25lbnQuc3R5bGVzKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgfSk7XG4vL1xuLy8gICAgfVxuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQG1ldGhvZCBsb2FkTGlua3Ncbi8vICAgICAqIEByZXR1cm4ge1Byb21pc2VbXX1cbi8vICAgICAqL1xuLy8gICAgbG9hZExpbmtzKCkge1xuLy9cbi8vICAgICAgICByZXR1cm4gdXRpbGl0eS50b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuTElOS1MpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4vL1xuLy8gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbi8vXG4vLyAgICAgICAgICAgICAgICBsaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZkF0dHJpYnV0ZSAgID0gbGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZVBhdGggICAgICA9IHV0aWxpdHkuZ2V0TW9kdWxlUGF0aChocmVmQXR0cmlidXRlKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZSAgICAgID0gdXRpbGl0eS5nZXRNb2R1bGVOYW1lKGhyZWZBdHRyaWJ1dGUpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQgPSBsaW5rRWxlbWVudC5pbXBvcnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUi5URU1QTEFURVMpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogbW9kdWxlUGF0aCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbW9kdWxlTmFtZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVzOiB1dGlsaXR5LnRvQXJyYXkodGVtcGxhdGVFbGVtZW50LmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUi5TVFlMRVMpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9kdWxlUGF0aH0vJHtsaW5rRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0czogdXRpbGl0eS50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IuU0NSSVBUUykpLm1hcCgoc2NyaXB0RWxlbWVudCkgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vZHVsZVBhdGh9LyR7dXRpbGl0eS5nZXRCYXNlKHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSl9YDtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBSZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGN1c3RvbSBlbGVtZW50IHVzaW5nIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCwgYW5kIHRoZW4gYXBwZW5kaW5nXG4vLyAgICAgKiB0aGUgYXNzb2NpYXRlZCBSZWFjdC5qcyBjb21wb25lbnQuXG4vLyAgICAgKlxuLy8gICAgICogQG1ldGhvZCByZWdpc3RlckVsZW1lbnRcbi8vICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbi8vICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbi8vICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2R1bGVQYXRoXG4vLyAgICAgKiBAcGFyYW0ge0FycmF5fSBzdHlsZXNcbi8vICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgKi9cbi8vICAgIHJlZ2lzdGVyRWxlbWVudChjbGFzc05hbWUsIGNvbXBvbmVudCwgbW9kdWxlUGF0aCwgc3R5bGVzKSB7XG4vL1xuLy8gICAgICAgIGxldCBlbGVtZW50TmFtZSA9IHV0aWxpdHkudG9TbmFrZUNhc2UoY2xhc3NOYW1lKSxcbi8vICAgICAgICAgICAgcHJvdG90eXBlICAgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4vLyAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG4vL1xuLy8gICAgICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4vLyAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7IHBhdGg6IG1vZHVsZVBhdGgsIGVsZW1lbnQ6IHRoaXMuY2xvbmVOb2RlKHRydWUpIH07XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgICAgICAgICA9ICcnO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAvLyBJbXBvcnQgYXR0cmlidXRlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCB0cmFuc2ZlciB0byB0aGUgUmVhY3QuanMgY2xhc3MuXG4vLyAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzOyBpbmRleCA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gYXR0cmlidXRlcy5pdGVtKGluZGV4KTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZSgvXmRhdGEtL2ksICcnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZWZhdWx0UHJvcHNbbmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyZWRFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChjb21wb25lbnQpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50JyksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgICA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNvbnRlbnRFbGVtZW50KTtcbi8vICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIFJlYWN0LnJlbmRlcihyZW5kZXJlZEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGNzcy5hc3NvY2lhdGUoc3R5bGVzLCBzaGFkb3dSb290KSkudGhlbigoKSA9PiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCd1bnJlc29sdmVkJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdyZXNvbHZlZCcsICcnKTtcbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgIH0pO1xuLy9cbi8vICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoZWxlbWVudE5hbWUsIHtcbi8vICAgICAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGVcbi8vICAgICAgICB9KTtcbi8vXG4vLyAgICB9XG4vL1xuLy99Il19
