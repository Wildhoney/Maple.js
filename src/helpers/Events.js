export default (function main() {

    "use strict";

    /**
     * @constant REACTID_ATTRIBUTE
     * @type {String}
     */
    const REACTID_ATTRIBUTE = 'data-reactid';

    /**
     * @property components
     * @type {Array}
     */
    let components = [];

    return {

        /**
         * @method findById
         * @param id {Number}
         * @return {Object}
         */
        findById(id) {

            let properties;

            /**
             * @method findRecursively
             * @param {Object} renderedComponent
             * @return {void}
             */
            function findRecursively(renderedComponent) {

                if (renderedComponent._rootNodeID === id) {

                    properties = renderedComponent._currentElement.props;
                    return;

                }

                let children = renderedComponent._renderedComponent._renderedChildren;

                if (!children) {
                    return;
                }

                Object.keys(children).forEach((index) => {
                    findRecursively(children[index]);
                });

            }

            components.forEach((component) => {
                findRecursively(component._reactInternalInstance._renderedComponent);
            });

            return properties;

        },

        /**
         * @method delegate
         * @param {HTMLElement} contentElement
         * @param {ReactClass.createClass.Constructor} component
         * @return {void}
         */
        delegate(contentElement, component) {

            components.push(component);

            contentElement.addEventListener('click', (event) => {

                event.path.forEach((item) => {

                    if (!item.getAttribute || !item.hasAttribute(REACTID_ATTRIBUTE)) {
                        return;
                    }

                    let x = this.findById(item.getAttribute(REACTID_ATTRIBUTE));

                    if ('onClick' in x) {
                        x.onClick.apply(component);
                    }

                });

            });

        }

    };

})();

// Remove reactid from default prop
// Setup events
// Replace "export default" when eval'ing