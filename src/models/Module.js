import Component         from './Component.js';
import {Abstract, State} from './Abstract.js';
import utility           from './../helpers/Utility.js';
import selectors         from './../helpers/Selectors.js';

export default class Module extends Abstract {

    /**
     * @constructor
     * @param {HTMLTemplateElement} templateElement
     * @return {Component}
     */
    constructor(templateElement) {

        super();
        this.path       = utility.pathResolver(templateElement.import, templateElement.getAttribute('href'));
        this.state      = State.UNRESOLVED;
        this.elements   = { template: templateElement };
        this.components = [];

        this.loadModule(templateElement).then(() => {

            this.getTemplates().forEach((templateElement) => {

                let scriptElements = selectors.getScripts(templateElement.content);

                scriptElements.map((scriptElement) => {

                    let src = scriptElement.getAttribute('src');

                    if (!this.path.isLocalPath(src)) {
                        return;
                    }

                    let component = new Component(this.path, templateElement, scriptElement);
                    this.components.push(component);

                });

            });

            this.setState(State.RESOLVED);

        });

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
     * @method loadModule
     * @param {HTMLTemplateElement} templateElement
     * @return {Promise}
     */
    loadModule(templateElement) {

        this.setState(State.RESOLVING);

        return new Promise((resolve, reject) => {

            if (templateElement.import) {
                return void resolve(templateElement);
            }

            templateElement.addEventListener('load', () => {
                resolve(templateElement);
            });

        });
        
    }

    /**
     * @method getTemplates
     * @return {Array}
     */
    getTemplates() {

        let ownerDocument = this.elements.template.import;
        return utility.toArray(ownerDocument.querySelectorAll('template'));

    }

}