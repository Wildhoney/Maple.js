import utility from './../helpers/Utility.js';

export default class Template {

    /**
     * @constructor
     * @param {String} name
     * @param {String} path
     * @param {HTMLTemplateElement} element
     * @return {Component}
     */
    constructor({ name, path, element }) {
        this.name    = name;
        this.path    = path;
        this.element = element;
    }

    /**
     * @method getScripts
     * @return {Array}
     */
    scripts() {
        return utility.toArray(this.element.content.querySelectorAll('script[type="text/maple"]'));
    }

    /**
     * @method resolveScriptPath
     * @param {String} scriptName
     * @return {String}
     */
    resolveScriptPath(scriptName) {
        return `${this.path}/${utility.removeExtension(scriptName)}`;
    }

}

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