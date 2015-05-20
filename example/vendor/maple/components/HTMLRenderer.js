const NODE_TYPES = { ELEMENT: 1, TEXT: 3 };

/**
 * @module Maple
 * @submodule HTMLRenderer
 * @extends React.Component
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */
export default class HTMLRenderer extends React.Component {

    /**
     * @method renderedByReact
     * @param {HTMLElement} element
     * @return {Boolean}
     */
    renderedByReact(element) {
        return element.hasAttribute('data-reactid');
    }

    /**
     * @method attributeMap
     * @return {Object}
     */
    attributeMap() {

        return {
            'class': 'className',
            'contentEditable': 'contenteditable',
            'onclick': 'onClick'
        };

    }

    /**
     * @method transformAttributes
     * @param {String} html
     * @return {String}
     */
    transformAttributes(html) {

        let domParser  = new DOMParser(),
            doc        = domParser.parseFromString(html, 'text/xml'),
            attributes = this.attributeMap(),
            component  = this;

        /**
         * @method transform
         * @param {Node|HTMLElement} doc
         * @return {void}
         */
        function transform(doc) {

            if (!doc.childNodes.length) {
                return;
            }

            let elements = Array.prototype.slice.apply(doc.childNodes);

            elements.forEach((element) => {

                if (element.nodeType !== NODE_TYPES.ELEMENT) {
                    return;
                }

                Object.keys(attributes).forEach((nativeAttribute) => {

                    let reactAttribute = attributes[nativeAttribute];

                    if (element.hasAttribute(nativeAttribute)) {

                        element.setAttribute(reactAttribute, element.getAttribute(nativeAttribute));
                        element.removeAttribute(nativeAttribute);

                        if (reactAttribute === 'onClick') {
                            element.onClick = component.go;
                            console.log(typeof element.onClick);
                        }

                    }

                });

            });

        }

        transform(doc.firstChild);
        return doc.firstChild.innerHTML;

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        let element   = this.props.element,
            wrapped   = '';

        if (this.renderedByReact(element)) {

            // Ensure the HTML has been embedded in a React component.
            throw "Maple: HTML renderer should only be used in HTML documents – your element has already been rendered by React.";

        }

        if (element.firstChild.nodeType === NODE_TYPES.TEXT) {
            wrapped = `<p>${element.innerHTML}</p>`;
        }

        return JSXTransformer.exec(this.transformAttributes(wrapped || element.innerHTML));

    }

}