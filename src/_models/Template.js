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
     * @method thirdPartyScripts
     * @return {Array}
     */
    thirdPartyScripts() {
        return utility.toArray(this.element.content.querySelectorAll(utility.selector.scripts));
    }

    /**
     * @method componentScripts
     * @return {Array}
     */
    componentScripts() {
        return utility.toArray(this.element.content.querySelectorAll(utility.selector.components));
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