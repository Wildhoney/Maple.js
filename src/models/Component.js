import Element           from './Element.js';
import {Abstract, State} from './Abstract.js';
import utility           from './../helpers/Utility.js';
import logger            from './../helpers/Logger.js';

export default class Component extends Abstract {

    /**
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
            logger.warn('Using JSXTransformer which is highly experimental and should not be used for production');
            return void this.loadJSX(src);
        }

        let url = `${this.path.getRelativePath()}/${utility.removeExtension(src)}`;

        System.import(url).then((imports) => {

            if (!imports.default) {
                return;
            }

            // Load all third-party scripts that are a prerequisite of resolving the custom element.
            this.loadThirdPartyScripts().then(() => {
                new Element(path, templateElement, scriptElement, imports.default);
                this.setState(State.RESOLVED);
            });

        });

    }

    /**
     * @method loadThirdPartyScripts
     * @return {Promise[]}
     */
    loadThirdPartyScripts() {

        let scriptElements    = utility.toArray(this.elements.template.content.querySelectorAll('script[type="text/javascript"]')),
            thirdPartyScripts = scriptElements.filter((scriptElement) => {
                return !this.path.isLocalPath(scriptElement.getAttribute('src'));
            });

        return new Promise((resolve, reject) => {

            if (!thirdPartyScripts.length) {
                return void resolve();
            }

            console.log('Load Third Party Scripts...');

        });

    }

    /**
     * @method loadJSX
     * @param {String} src
     * @return {void}
     */
    loadJSX(src) {

        fetch(`${this.path.getRelativePath()}/${src}`).then((response) => {
            return response.text();
        }).then((body) => {

            var transformed = eval(`"use strict"; ${JSXTransformer.transform(body).code}`);

            this.loadThirdPartyScripts().then(() => {
                new Element(this.path, this.elements.template, this.elements.script, transformed);
                this.setState(State.RESOLVED);
            });

        });

    }

}