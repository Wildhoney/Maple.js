import utility   from './../helpers/Utility.js';
import log       from './../helpers/Log.js';

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

        /**
         * @method addCSS
         * @param {String} body
         * @return {void}
         */
        function addCSS(body) {
            let styleElement = document.createElement('style');
            styleElement.setAttribute('type', 'text/css');
            styleElement.innerHTML = body;
            shadowBoundary.appendChild(styleElement);
        }

        let content       = this.template.element.content,
            linkElements  = utility.toArray(content.querySelectorAll(utility.selector.styles)),
            styleElements = utility.toArray(content.querySelectorAll(utility.selector.inlines));

        return [].concat(linkElements, styleElements).map((element) => new Promise((resolve) => {

            if (element.nodeName.toLowerCase() === 'style') {
                addCSS(element.innerHTML);
                resolve();
                return;
            }

            let href     = element.getAttribute('href'),
                document = this.template.element.ownerDocument,
                resolver = utility.pathResolver(document, href, this.template.path);

            // Create the associated style element and resolve the promise with it.
            fetch(resolver.getPath()).then((response) => response.text()).then((body) => {

                addCSS(body);
                resolve();

            }).catch((error) => log('Error', error.message, '#DC143C'));

        }));

    }

}