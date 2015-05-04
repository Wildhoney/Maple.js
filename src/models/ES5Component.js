import Component from './Component.js';
import utility   from './../helpers/Utility.js';
import log       from './../helpers/Log.js';

export default class ES5Component extends Component {

    /**
     * @method elementName
     * @return {String}
     */
    elementName() {
        return utility.toSnakeCase(this.variableName());
    }

    /**
     * @method variableName
     * @return {String}
     */
    variableName() {
        return this.script.toString().match(/var\s*([a-z]+)/i)[1];
    }

    /**
     * @method customElement
     * @return {HTMLElement}
     */
    customElement() {

        let elementName  = this.elementName(),
            variableName = this.variableName(),
            script       = this.script,
            template     = this.template,
            importLinks  = this.importLinks.bind(this);

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
                    this.innerHTML = '';

                    let renderedElement = React.createElement(window[variableName]),
                        contentElement  = document.createElement('content'),
                        shadowRoot      = this.createShadowRoot();

                    shadowRoot.appendChild(contentElement);
                    let component = React.render(renderedElement, contentElement);

                    // Import external CSS documents.
                    Promise.all(importLinks(shadowRoot)).then(() => {

                        this.removeAttribute('unresolved');
                        this.setAttribute('resolved', '');

                    }).catch((error) => log('Timeout', error.message, '#DC143C'));

                    // Import attributes from the element and transfer to the React.js class.
                    for (let index = 0, attributes = this.attributes; index < attributes.length; index++) {

                        let attribute = attributes.item(index);

                        if (attribute.value) {
                            let name = attribute.name.replace(/^data-/i, '');
                            component.props[name] = attribute.value;
                        }

                    }

                    component.forceUpdate();

                }

            }

        });

    }

}