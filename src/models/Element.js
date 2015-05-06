import {Abstract, State} from './Abstract.js';
import events            from './../helpers/Events.js';
import utility           from './../helpers/Utility.js';
import selectors         from './../helpers/Selectors.js';

export default class Element extends Abstract {

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
        let linkElements  = selectors.getExternalStyles(content);
        let styleElements = selectors.getInlineStyles(content);
        let promises      = [].concat(linkElements, styleElements).map((element) => new Promise((resolve) => {

            if (element.nodeName.toLowerCase() === 'style') {
                createStyle(element.innerHTML, shadowBoundary);
                resolve();
                return;
            }

            fetch(this.path.getPath(element.getAttribute('href'))).then((response) => response.text()).then((body) => {
                createStyle(body, shadowBoundary);
                resolve();
            });

        }));

        Promise.all(promises).then(() => this.setState(State.RESOLVED));
        return promises;

    }

    /**
     * @method getElementName
     * @return {String}
     */
    getElementName() {
        return utility.toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
    }

    /**
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

                            if (attribute.value) {
                                let name = attribute.name.replace(/^data-/i, '');
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
                    events.delegate(contentElement, component);

                    // Import external CSS documents.
                    Promise.all(loadStyles(shadowRoot)).then(() => {
                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');
                    });

                }

            }

        });

    }

}