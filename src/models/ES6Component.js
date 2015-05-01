import Component from './Component.js';
import utility   from './../helpers/Utility.js';
import log       from './../helpers/Log.js';

export default class ES6Component extends Component {

    /**
     * @method elementName
     * @return {String}
     */
    elementName() {
        return utility.toSnakeCase(this.script.toString().match(/(?:function|class)\s*([a-z]+)/i)[1]);
    }

    /**
     * @method customElement
     * @return {HTMLElement}
     */
    customElement() {

        let elementName = this.elementName(),
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

                    log('Element', elementName, '#009ACD');
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

                    }).catch((error) => log('Timeout', error.message, '#DC143C'));

                }

            }

        });

    }

}