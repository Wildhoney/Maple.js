import events       from './../helpers/Events.js';
import utility      from './../helpers/Utility.js';
import cacheFactory from './../helpers/CacheFactory.js';
import selectors    from './../helpers/Selectors.js';
import {StateManager, State} from './StateManager.js';

/**
 * @module Maple
 * @submodule CustomElement
 * @extends StateManager
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */
export default class CustomElement extends StateManager {

    /**
     * @constructor
     * @param {String} path
     * @param {HTMLScriptElement} scriptElement
     * @param {HTMLTemplateElement} templateElement
     * @param {String} importScript
     * @return {Element}
     */
    constructor(path, templateElement, scriptElement, importScript) {

        super();
        this.path     = path;
        this.elements = { script: scriptElement, template: templateElement };
        this.script   = importScript;

        document.registerElement(this.getElementName(), {
            prototype: this.getElementPrototype()
        });

    }

    /**
     * Responsible for loading associated styles into either the shadow DOM, if the path is determined to be local
     * to the component, or globally if not.
     *
     * @method loadStyles
     * @param {ShadowRoot} shadowBoundary
     * @return {Promise[]}
     */
    loadStyles(shadowBoundary) {

        /**
         * @method createStyle
         * @param {String} body
         * @param {ShadowRoot|HTMLDocument} element
         * @return {void}
         */
        function createStyle(body, element = shadowBoundary) {
            let styleElement = document.createElement('style');
            styleElement.setAttribute('type', 'text/css');
            styleElement.innerHTML = body;
            element.appendChild(styleElement);
        }

        this.setState(State.RESOLVING);

        let content       = this.elements.template.content;
        let linkElements  = selectors.getCSSLinks(content);
        let styleElements = selectors.getCSSInlines(content);
        let promises      = [].concat(linkElements, styleElements).map((element) => new Promise((resolve) => {

            if (element.nodeName.toLowerCase() === 'style') {
                createStyle(element.innerHTML, shadowBoundary);
                resolve();
                return;
            }

            cacheFactory.fetch(this.path.getPath(element.getAttribute('href'))).then((body) => {
                createStyle(body, shadowBoundary);
                resolve();
            });

        }));

        Promise.all(promises).then(() => this.setState(State.RESOLVED));
        return promises;

    }

    /**
     * Extract the element name from converting the Function to a String via the `toString` method. It's worth
     * noting that this is probably the weakest part of the Maple system because it relies on a regular expression
     * to determine the name of the resulting custom HTML element.
     *
     * @method getElementName
     * @return {String}
     */
    getElementName() {
        return utility.toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
    }

    /**
     * Yields the prototype for the custom HTML element that will be registered for our custom React component.
     * It listens for when the custom element has been inserted into the DOM, and then sets up the styles, applies
     * default React properties, etc...
     *
     * @method getElementPrototype
     * @return {Object}
     */
    getElementPrototype() {

        let loadStyles = this.loadStyles.bind(this),
            script    = this.script,
            path      = this.path;

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

                    /**
                     * @method applyDefaultProps
                     * @param {Object} attributes
                     * @return {void}
                     */
                    function applyDefaultProps(attributes) {

                        for (let index = 0; index < attributes.length; index++) {

                            let attribute = attributes.item(index);
                            let replacer  = /^data-/i;

                            if (attribute.value) {

                                if (attribute.name === utility.ATTRIBUTE_REACTID) {
                                    continue;
                                }

                                let name = attribute.name.replace(replacer, '');
                                script.defaultProps[name] = attribute.value;

                            }

                        }

                    }

                    // Apply properties to the custom element.
                    script.defaultProps = { path: path, element: this.cloneNode(true) };
                    applyDefaultProps.call(this, this.attributes);
                    this.innerHTML      = '';

                    // Configure the React.js component, importing it under the shadow boundary.
                    let renderedElement = React.createElement(script),
                        contentElement  = document.createElement('content'),
                        shadowRoot      = this.createShadowRoot();

                    shadowRoot.appendChild(contentElement);
                    let component = React.render(renderedElement, contentElement);

                    // Configure the event delegation for the component.
                    events.registerComponent(component);

                    /**
                     * Import external CSS documents and resolve element.
                     *
                     * @method resolveElement
                     * @return {void}
                     */
                    function resolveElement() {

                        Promise.all(loadStyles(shadowRoot)).then(() => {
                            this.removeAttribute('unresolved');
                            this.setAttribute('resolved', '');
                        });

                    }

                    resolveElement.apply(this);

                }

            }

        });

    }

}