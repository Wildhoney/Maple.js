import CustomElement from './Element.js';
import utility       from './../helpers/Utility.js';
import logger        from './../helpers/Logger.js';
import options       from './../helpers/Options.js';
import selectors     from './../helpers/Selectors.js';
import {StateManager, State} from './StateManager.js';

/**
 * @module Maple
 * @submodule Component
 * @extends StateManager
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */
export default class Component extends StateManager {

    /**
     * Responsible for loading any prerequisites before the component is delegated to each `CustomElement`
     * object for creating a custom element, and lastly rendering the React component to the designated HTML element.
     *
     * @constructor
     * @param {String} path
     * @param {HTMLTemplateElement} templateElement
     * @param {HTMLScriptElement} scriptElement
     * @return {Module}
     */
    constructor(path, templateElement, scriptElement) {

        super();
        this.path     = path;
        this.elements = { script: scriptElement, template: templateElement };

        let src = scriptElement.getAttribute('src');
        this.setState(State.RESOLVING);

        if (src.split('.').pop().toLowerCase() === 'jsx') {
            return void logger.error(`Use JS extension instead of JSX – JSX compilation will work as expected`);
        }

        System.import(this.path.resolveComponent(src)).then((imports) => {

            if (!imports.default) {

                // Components that do not have a default export (i.e: export default class...) will be ignored.
                return;

            }

            // Load all third-party scripts that are a prerequisite of resolving the custom element.
            Promise.all(this.loadThirdPartyScripts()).then(() => {
                new CustomElement(path, templateElement, scriptElement, imports.default);
                this.setState(State.RESOLVED);
            }, (message) => logger.error(message));

        });

    }

    /**
     * Discover all of the third party JavaScript dependencies that are required to have been loaded before
     * attempting to render the custom element.
     *
     * @method loadThirdPartyScripts
     * @return {Promise[]}
     */
    loadThirdPartyScripts() {

        let scriptElements    = selectors.getScripts(this.elements.template.content),
            thirdPartyScripts = scriptElements.filter((scriptElement) => {
                return !this.path.isLocalPath(scriptElement.getAttribute('src'));
            });

        return thirdPartyScripts.map((scriptElement) => {

            let src       = scriptElement.getAttribute('src');
            scriptElement = document.createElement('script');
            scriptElement.setAttribute('type', 'text/javascript');
            scriptElement.setAttribute('src', src);

            return new Promise((resolve, reject) => {

                scriptElement.addEventListener('load', () => resolve());
                document.head.appendChild(scriptElement);

                let href         = scriptElement.getAttribute('src'),
                    errorMessage = `Timeout of ${options.RESOLVE_TIMEOUT / 1000} seconds exceeded whilst waiting for third-party script: "${href}"`;
                utility.resolveTimeout(errorMessage, reject);

            });

        });

    }

}