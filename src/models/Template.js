import utility from './../helpers/Utility.js';

export default class Template {

    /**
     * @constructor
     * @param {String} name
     * @param {String} path
     * @param {HTMLTemplateElement} element
     * @return {Component}
     */
    constructor({ name, path, element }) {
        this.name    = name;
        this.path    = path;
        this.element = element;
    }

    /**
     * @method getScripts
     * @return {Array}
     */
    scripts() {
        return utility.toArray(this.element.content.querySelectorAll(utility.selector.scripts));
    }

    /**
     * @method content
     * @return {DocumentFragment}
     */
    content() {

        let cloned  = this.element.cloneNode(true).content,
            styles  = utility.toArray(cloned.querySelectorAll(utility.selector.styles)),
            scripts = utility.toArray(cloned.querySelectorAll(utility.selector.scripts));

        [].concat(styles, scripts).forEach((node) => {
            node.remove();
        });

        return cloned;

    }

    /**
     * @method resolveScriptPath
     * @param {String} scriptName
     * @return {String}
     */
    resolveScriptPath(scriptName) {
        return `${this.path}/${utility.removeExtension(scriptName)}`;
    }

}