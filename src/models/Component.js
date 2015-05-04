const STATE = { UNRESOLVED: 0, RESOLVING: 1, RESOLVED: 2 };

export default class Component {

    /**
     * @constructor
     * @param {String} path
     * @param {HTMLScriptElement} scriptElement
     * @param {HTMLTemplateElement} templateElement
     * @return {Module}
     */
    constructor(path, scriptElement, templateElement) {
        this.path     = path;
        this.state    = STATE.UNRESOLVED;
        this.elements = { script: scriptElement, template: templateElement };
    }

    /**
     * @method setState
     * @param {Number} state
     * @return {void}
     */
    setState(state) {
        this.state = state;
    }

    /**
     * @method loadAll
     * @return {Promise[]}
     */
    loadAll() {
        return [].concat(this.loadStyles(), this.loadScripts());
    }

    /**
     * @method loadStyles
     * @return {Promise[]}
     */
    loadStyles() {

        return new Promise((resolve, reject) => {
            resolve();
        });

    }

    /**
     * @method loadScripts
     * @return {Promise[]}
     */
    loadScripts() {

        return new Promise((resolve, reject) => {
            resolve();
        });

    }

}