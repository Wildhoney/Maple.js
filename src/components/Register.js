import events     from './../helpers/Events.js';
import css        from './../helpers/Stylesheets.js';
import utility    from './../helpers/Utility.js';
import logger     from './../helpers/Logger.js';
import Dispatcher from './Dispatcher.js';

/**
 * @module Maple
 * @submodule Register
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */
export default class Register {

    /**
     * @constructor
     * @param {Array} modules
     * @return {Register}
     */
    constructor(...modules) {

        this.components = [];
        this.dispatcher = new Dispatcher();
        this.debug      = true;

        this.register(...modules);

    }

    /**
     * Responsible for finding all of the HTML imports and returning a promise when each of the
     * HTML imports have been successfully imported. This allows us to access the `ownerDocument`
     * on each of the link elements knowing that it isn't null.
     *
     * @method getImports
     * @return {Array}
     */
    getImports() {

        let importDocuments = document.querySelectorAll('link[rel="import"][resource="component"]');

        return utility.toArray(importDocuments).map((importDocument) => {

            return new Promise((resolve) => {
                importDocument.addEventListener('load', event => resolve(event.path[0]));
            });

        });

    }

    /**
     * Responsible for finding all of the HTML imports in the current document. It will be invoked if
     * the developer doesn't explicitly pass in an array of modules to load via the Maple constructor when
     * instantiating a new application.
     *
     * @method findModules
     * @return {Array}
     */
    findModules() {

        return utility.toArray(document.querySelectorAll('link[rel="import"]')).map((importDocument) => {

            let importPath = utility.getImportPath(importDocument.getAttribute('href'));
            return void importPath;

        });

    }

    /**
     * @method findScripts
     * @param {Object} importDocument
     * @return {Array}
     */
    findScripts(importDocument) {

        let templateElements  = utility.toArray(importDocument.querySelectorAll('template')),
            allScriptElements = [];

        templateElements.forEach((templateElement) => {

            let scriptElements = utility.toArray(templateElement.content.querySelectorAll('script[type="text/javascript"]'));
            allScriptElements = [].concat(allScriptElements, scriptElements);

        });

        return allScriptElements;

    }

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
    registerCustomElement(className, component, modulePath) {

        let elementName = utility.toSnakeCase(className),
            dispatcher  = this.dispatcher;

        logger.send(`Registered Component: ${elementName}`, logger.type.component);
        let prototype   = Object.create(HTMLElement.prototype, {

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
                        path:       modulePath,
                        element:    this.cloneNode(true),
                        dispatcher: dispatcher
                    };

                    this.innerHTML = '';

                    // Import attributes from the element and transfer to the React.js class.
                    for (let index = 0, attributes = this.attributes; index < attributes.length; index++) {

                        let attribute = attributes.item(index);

                        if (attribute.value) {
                            let name = attribute.name.replace(/^data-/i, '');
                            component.defaultProps[name] = attribute.value;
                        }

                    }

                    let renderedElement = React.createElement(component),
                        contentElement  = document.createElement('content'),
                        shadowRoot      = this.createShadowRoot();

                    shadowRoot.appendChild(contentElement);
                    events.delegate(contentElement, React.render(renderedElement, contentElement));

                    Promise.all(css.associate(modulePath, shadowRoot)).then(() => {
                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');
                    });

                }

            }

        });

        document.registerElement(elementName, {
            prototype: prototype
        });

    }

    /**
     * Entry point for the component initialisation. It accepts an optional parameter to initialise
     * modules explicitly, otherwise this.findModules will be invoked, and modules will be found
     * automatically from the current HTML imports of the document.
     *
     * @method delegate
     * @param {Array} modules
     * @return {void}
     */
    register(...modules) {

        this.getImports().forEach((promise) => {

            promise.then((linkElement) => {

                let scriptElements = this.findScripts(linkElement.import),
                    modulePath     = utility.getModulePath(linkElement.getAttribute('href')),
                    moduleName     = utility.getModuleName(linkElement.getAttribute('href'));

                if (modules.length && !~modules.indexOf(moduleName)) {
                    return;
                }

                logger.send(moduleName, logger.type.module);

                scriptElements.forEach((scriptElement) => {

                    let scriptSrc  = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                        scriptPath = `${modulePath}/${scriptSrc}`;

                    System.import(scriptPath).then((Register) => {

                        let className = Register.default.toString().match(/(?:function|class)\s*([a-z]+)/i)[1],
                            component = this.components[className] = Register.default;

                        this.registerCustomElement(className, component, modulePath);

                    });

                });

            });

        });

    }

}