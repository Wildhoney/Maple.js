import events     from './../helpers/Events.js';
import css        from './../helpers/Stylesheets.js';
import utility    from './../helpers/Utility.js';
import logger     from './../helpers/Logger.js';

/**
 * @constant SELECTOR
 * @type {Object}
 */
const SELECTOR = {
    IMPORTS:   'link[rel="import"]',
    TEMPLATES: 'template',
    SCRIPTS:   'script[type="text/javascript"]'
};

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
        this.debug      = true;

        this.register(...modules);

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

        this.loadImports().forEach((promise) => {

            promise.then((options) => {

                let scriptElements = options.scripts,
                    modulePath     = options.path,
                    moduleName     = options.name;

                if (modules.length && !~modules.indexOf(moduleName)) {
                    return;
                }

                logger.send(moduleName, logger.type.module);

                scriptElements.forEach((scriptElement) => {

                    var scriptSrc  = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                        scriptPath = `${scriptSrc}`;

                    if (options.type === 'link') {
                        scriptSrc  = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/');
                        scriptPath = `${modulePath}/${scriptSrc}`;
                    }

                    System.import(scriptPath).then((Register) => {

                        let className = Register.default.toString().match(/(?:function|class)\s*([a-z]+)/i)[1],
                            component = this.components[className] = Register.default;

                        this.registerElement(className, component, modulePath);

                    });

                });

            });

        });

    }

    /**
     * Responsible for finding all of the HTML imports and returning a promise when each of the
     * HTML imports have been successfully imported. This allows us to access the `ownerDocument`
     * on each of the link elements knowing that it isn't null.
     *
     * @method loadImports
     * @return {Array}
     */
    loadImports() {

        let importDocuments  = utility.toArray(document.querySelectorAll(SELECTOR.IMPORTS)),
            templateElements = utility.toArray(document.querySelectorAll(SELECTOR.TEMPLATES));

        return [].concat(importDocuments, templateElements).map((model) => {

            let type = model.nodeName.toLowerCase();

            return new Promise((resolve) => {

                switch (type) {
                    case ('link'):     this.resolveLink(resolve, model); break;
                    case ('template'): this.resolveTemplate(resolve, model); break;
                }

            });

        });

    }

    /**
     * @method resolveTemplate
     * @param {Function} resolve
     * @param {HTMLTemplateElement} templateElement
     * @return {void}
     */
    resolveTemplate(resolve, templateElement) {

        let scriptElements = utility.toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS)),
            modulePath     = utility.getModulePath(scriptElements[0].getAttribute('src')),
            moduleName     = utility.getModuleName(scriptElements[0].getAttribute('src'));

        resolve({ scripts: scriptElements, path: modulePath, name: moduleName, type: 'template' });

    }

    /**
     * @method resolveLink
     * @param {Function} resolve
     * @param {HTMLLinkElement} linkElement
     * @return {void}
     */
    resolveLink(resolve, linkElement) {

        linkElement.addEventListener('load', () => {

            let scriptElements = this.findScripts(linkElement.import),
                modulePath     = utility.getModulePath(linkElement.getAttribute('href')),
                moduleName     = utility.getModuleName(linkElement.getAttribute('href'));

            resolve({ scripts: scriptElements, path: modulePath, name: moduleName, type: 'link' });

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

        return utility.toArray(document.querySelectorAll(SELECTOR.IMPORTS)).map((importDocument) => {

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

        let templateElements  = utility.toArray(importDocument.querySelectorAll(SELECTOR.TEMPLATES)),
            allScriptElements = [];

        templateElements.forEach((templateElement) => {

            let scriptElements = utility.toArray(templateElement.content.querySelectorAll(SELECTOR.SCRIPTS));
            allScriptElements = [].concat(allScriptElements, scriptElements);

        });

        return allScriptElements;

    }

    /**
     * Responsible for creating the custom element using document.registerElement, and then appending
     * the associated React.js component.
     *
     * @method registerElement
     * @param {String} className
     * @param {Object} component
     * @param {String} modulePath
     * @return {void}
     */
    registerElement(className, component, modulePath) {

        let elementName = utility.toSnakeCase(className);

        logger.send(`${elementName}`, logger.type.component);
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
                        element:    this.cloneNode(true)
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

}