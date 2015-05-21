import Component from './Component.js';
import utility   from './../helpers/Utility.js';
import logger    from './../helpers/Logger.js';
import options   from './../helpers/Options.js';
import selectors from './../helpers/Selectors.js';
import {StateManager, State} from './StateManager.js';

export default class Module extends StateManager {

    /**
     * @constructor
     * @param {HTMLLinkElement} linkElement
     * @return {Component}
     */
    constructor(linkElement) {

        super();
        this.path       = utility.resolver(linkElement.getAttribute('href'), linkElement.import).development;
        this.state      = State.UNRESOLVED;
        this.elements   = { link: linkElement };
        this.components = [];

        this.loadModule(linkElement).then(() => {

            // Use only the first template, because otherwise Mapleify will have a difficult job attempting
            // to resolve the paths when there's a mismatch between template elements and link elements.
            // PREVIOUS: this.getTemplates().forEach((templateElement) => {

            let templateElements = this.getTemplates();

            if (templateElements.length > 1) {
                logger.error(`Component "${linkElement.getAttribute('href')}" is attempting to register two components`);
                return;
            }

            [this.getTemplates()[0]].forEach((templateElement) => {

                let scriptElements = selectors.getAllScripts(templateElement.content);

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

        }, (message) => logger.error(message));

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
     * @param {HTMLTemplateElement} linkElement
     * @return {Promise}
     */
    loadModule(linkElement) {

        this.setState(State.RESOLVING);

        return new Promise((resolve, reject) => {

            if (linkElement.hasAttribute('ref')) {
                return void resolve(linkElement);
            }

            if (linkElement.import) {
                return void resolve(linkElement);
            }

            linkElement.addEventListener('load', () => resolve(linkElement));

            let href         = linkElement.getAttribute('href'),
                errorMessage = `Timeout of ${options.RESOLVE_TIMEOUT / 1000} seconds exceeded whilst waiting for HTML import: "${href}"`;
            utility.resolveTimeout(errorMessage, reject);

        });
        
    }

    /**
     * @method getTemplates
     * @return {Array}
     */
    getTemplates() {

        let ownerDocument = this.elements.link.import;
        return utility.toArray(ownerDocument.querySelectorAll('template'));

    }

}