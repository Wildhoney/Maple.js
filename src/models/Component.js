import utility from './../helpers/Utility.js';
import log     from './../helpers/Log.js';

export default class Component {

    /**
     * @constructor
     * @param {HTMLScriptElement} script
     * @param {Template} template
     */
    constructor({ script, template }) {
        this.script   = script;
        this.template = template;
    }

    /**
     * @method elementName
     * @return {String}
     */
    elementName() {
        return utility.toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
    }

    /**
     * @method importLinks
     * @param {ShadowRoot} shadowBoundary
     * @return {Promise[]}
     */
    importLinks(shadowBoundary) {

        let styleElements = utility.toArray(this.template.element.content.querySelectorAll(utility.selector.styles));

        return [].concat(styleElements).map((styleElement) => new Promise((resolve) => {

            let url = `${this.template.path}/${styleElement.getAttribute('href')}`;

            // Create the associated style element and resolve the promise with it.
            fetch(url).then((response) => response.text()).then((body) => {

                let styleElement = document.createElement('style');
                styleElement.setAttribute('type', 'text/css');
                styleElement.innerHTML = body;
                shadowBoundary.appendChild(styleElement);
                resolve();

            });

        }));

    }

    /**
     * @method customElement
     * @return {HTMLElement}
     */
    customElement() {

        let name        = this.elementName(),
            script      = this.script,
            template    = this.template,
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

                    log('Registering Element:', name, '#708090');
                    script.defaultProps = { path: template.path, element: this.cloneNode(true) };
                    this.innerHTML      = '';

                    // Import attributes from the element and transfer to the React.js class.
                    for (let index = 0, attributes = this.attributes; index < attributes.length; index++) {

                        let attribute = attributes.item(index);

                        if (attribute.value) {
                            let name = attribute.name.replace(/^data-/i, '');
                            script.defaultProps[name] = attribute.value;
                        }

                    }

                    let renderedElement = React.createElement(script),
                        contentElement  = document.createElement('content'),
                        shadowRoot      = this.createShadowRoot();

                    shadowRoot.appendChild(contentElement);
                    React.render(renderedElement, contentElement);

                    // Import external CSS documents.
                    Promise.all(importLinks(shadowRoot)).then(() => {
                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');
                    });

                }

            }

        });

    }

}