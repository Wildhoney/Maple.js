import utility   from './../helpers/Utility.js';
import Component from './Component.js';

const STATE = { UNRESOLVED: 0, RESOLVING: 1, RESOLVED: 2 };

export default class Module {

    /**
     * @constructor
     * @param {HTMLTemplateElement} templateElement
     * @return {Component}
     */
    constructor(templateElement) {

        this.path       = utility.getPath(templateElement.getAttribute('href'));
        this.state      = STATE.UNRESOLVED;
        this.elements   = { template: templateElement };
        this.components = [];

        this.loadModule(templateElement).then(() => {

            let promises = this.getTemplates().map((templateElement) => {

                let scriptElements = utility.toArray(templateElement.content.querySelectorAll('script[type="text/javascript"]'));

                return scriptElements.map((scriptElement) => {

                    let component = new Component(this.path, scriptElement, templateElement);
                    this.components.push(component);
                    return component.loadAll();

                });

            });

            Promise.all(utility.flattenArray(promises)).then(() => {
                this.setState(STATE.RESOLVED);
                console.log(this.state);
            });

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

        this.setState(STATE.RESOLVING);

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