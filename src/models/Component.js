import CustomElement from './Element.js';
import utility       from './../helpers/Utility.js';
import logger        from './../helpers/Logger.js';
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

        if (scriptElement.getAttribute('type') === 'text/jsx') {

            // Experimental method for transpiling JSX to JS documents.
            return void this.loadJSX(src);

        }

        // Configure the URL of the component for ES6 `System.import`, which is also polyfilled in case the
        // current browser does not provide support for dynamic module loading.
        let url = `${this.path.getRelativePath()}/${utility.removeExtension(src)}`;

        System.import(url).then((imports) => {

            if (!imports.default) {

                // Components that do not have a default export (i.e: export default class...) will be ignored.
                return;

            }

            // Load all third-party scripts that are a prerequisite of resolving the custom element.
            Promise.all(this.loadThirdPartyScripts()).then(() => {
                new CustomElement(path, templateElement, scriptElement, imports.default);
                this.setState(State.RESOLVED);
            });

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

        let scriptElements    = utility.toArray(this.elements.template.content.querySelectorAll('script[type="text/javascript"]')),
            thirdPartyScripts = scriptElements.filter((scriptElement) => {
                return !this.path.isLocalPath(scriptElement.getAttribute('src'));
            });

        return thirdPartyScripts.map((scriptElement) => {

            return new Promise((resolve) => {
                scriptElement.addEventListener('load', () => resolve());
                document.head.appendChild(scriptElement);
            });

        });

    }

    /**
     * Experimental implementation to transpile JSX into JS documents for development purposes. In production this
     * method should never be invoked.
     *
     * @method loadJSX
     * @param {String} src
     * @return {void}
     */
    loadJSX(src) {

        logger.warn('Using JSXTransformer which is highly experimental and should not be used for production');

        fetch(`${this.path.getRelativePath()}/${this.path.getSrc(src)}`).then((response) => {
            return response.text();
        }).then((body) => {

            body = body.replace('export default', '').trim();

            /* jslint evil: true */
            var transformed = eval(`"use strict"; ${JSXTransformer.transform(body).code}`);

            Promise.all(this.loadThirdPartyScripts()).then(() => {
                new CustomElement(this.path, this.elements.template, this.elements.script, transformed);
                this.setState(State.RESOLVED);
            });

        });

    }

}