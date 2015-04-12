import events  from './../helpers/Events.js';
import css     from './../helpers/Stylesheets.js';

/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */
export default class Component {

    /**
     * @constructor
     * @param {Boolean} debug
     * @return {Component}
     */
    constructor(debug) {
        this.components = [];
        this.debug      = debug || false;
    }

    /**
     * @method getImports
     * @return {Array}
     */
    getImports() {

        let importDocuments = document.querySelectorAll('link[rel="import"]');

        return this.toArray(importDocuments).map((importDocument) => {

            return new Promise((resolve) => {
                importDocument.addEventListener('load', event => resolve(event.path[0]));
            });

        });

    }

    /**
     * @method findImport
     * @param {String} className
     * @return {Object}
     */
    findImport(className) {

        return this.linkElements.filter((linkElement) => {

            let regExp = new RegExp(`${className}\/(?:.+?)\.html`, 'i');

            if (linkElement.href.match(regExp)) {
                return true;
            }

        })[0];

    }

    /**
     * @method findScripts
     * @param {Object} importDocument
     * @return {Array}
     */
    findScripts(importDocument) {
        let templateElement = importDocument.querySelector('template');
        return this.toArray(templateElement.content.querySelectorAll('script[type="text/javascript"]'));
    }

    /**
     * @method toArray
     * @param {*} arrayLike
     * @return {Array}
     */
    toArray(arrayLike) {
        return Array.prototype.slice.apply(arrayLike);
    }

    /**
     * @method registerCustomElement
     * @param {String} className
     * @param {Object} component
     * @param {String} modulePath
     * @return {void}
     */
    registerCustomElement(className, component, modulePath) {

        let elementName = className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        this.log(`Adding custom element "${elementName}"`);
        let prototype   = Object.create(HTMLElement.prototype, {

            /**
             * @property createdCallback
             * @type {Object}
             */
            createdCallback: {

                /**
                 * @method value
                 * @return {void}
                 */
                value: function value() {

                    this.innerHTML = '';

                    this.removeAttribute('unresolved');
                    this.setAttribute('resolved', '');

                    // Import attributes from the element and transfer to the React.js class.
                    component.defaultProps = {};
                    for (let index = 0, attributes = this.attributes; index < attributes.length; index++) {
                        let attribute = attributes.item(index);
                        if (attribute.value) {
                            component.defaultProps[attribute.name] = attribute.value;
                        }
                    }

                    let rendered       = React.createElement(component),
                        contentElement = document.createElement('content'),
                        shadowRoot     = this.createShadowRoot();

                    css.associate(modulePath, shadowRoot);
                    shadowRoot.appendChild(contentElement);
                    events.delegate(contentElement, React.render(rendered, contentElement));

                }

            }

        });

        document.registerElement(elementName, {
            prototype: prototype
        });

    }

    /**
     * @method log
     * @param {String} message
     * @return {void}
     */
    log(message) {

        if (this.debug) {
            console.info(`Maple.js: ${message}.`);
        }

    }

    /**
     * @method delegate
     * @param {Array} modules
     * @return {void}
     */
    register(...modules) {

        Promise.all(this.getImports()).then((linkElements) => {

            this.linkElements = linkElements;

            modules.forEach((name) => {

                name = {
                    camelcase:  name,
                    underscore: name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
                };

                let importDocument = this.findImport(name.underscore),
                    scriptElements = this.findScripts(importDocument.import),
                    modulePath     = importDocument.getAttribute('href').split('/').slice(0, -1).join('/');

                this.log(`Registering module "${name.camelcase}" with path "${modulePath}"`);

                scriptElements.forEach((scriptElement) => {

                    let scriptSrc  = scriptElement.getAttribute('src').split('.').slice(0, -1).join('/'),
                        scriptPath = `${modulePath}/${scriptSrc}`;

                    System.import(scriptPath).then((Component) => {

                        let className = Component.default.toString().match(/(?:function|class)\s*([a-z]+)/i)[1];
                        let component = this.components[className] = Component.default;
                        this.registerCustomElement(className, component, modulePath);

                    });

                });

            });

        });

    }

}