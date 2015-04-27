import Component from './models/Component.js';
import Template  from './models/Template.js';
import utility   from './helpers/Utility.js';
import log       from './helpers/Log.js';

(function main($window, $document) {

    "use strict";

    if (typeof System !== 'undefined') {
        System.transpiler = 'babel';
    }

    /**
     * @module Maple
     * @link https://github.com/Wildhoney/Maple.js
     * @author Adam Timberlake
     */
    class Maple {

        /**
         * @constructor
         * @return {void}
         */
        constructor() {
            this.findComponents();
        }

        /**
         * @method findComponents
         * @return {void}
         */
        findComponents() {

            [].concat(this.loadLinks()).forEach((promise) => promise.then((templates) => {

                templates.forEach((template) => {

                    // Load all of the prerequisites for the component.
                    Promise.all(this.loadThirdPartyScripts(template)).then(() => {

                        this.resolveScripts(template).forEach((promise) => promise.then((component) => {

                            // Register the custom element using the resolved script.
                            this.registerElement(component);

                        }));

                    });

                });

            }));

        }

        /**
         * @method loadLinks
         * @return {Promise[]}
         */
        loadLinks() {

            let linkElements = this.findLinks();

            return linkElements.map((linkElement) => {

                let href = linkElement.getAttribute('href'),
                    name = utility.extractName(href),
                    path = utility.extractPath(href);

                log('Parsing Component:', name, '#8B7E66');

                return new Promise((resolve) => linkElement.addEventListener('load', () => {

                    let templates = [];

                    this.findTemplates(linkElement.import).forEach((templateElement) => {

                        // Instantiate our component with the name, path, and the associated element.
                        let template = new Template({ name: name, path: path, element: templateElement });
                        templates.push(template);

                    });

                    resolve(templates);

                }));

            });

        }

        /**
         * @method loadThirdPartyScripts
         * @param {Template} template
         * @return {Promise[]}
         */
        loadThirdPartyScripts(template) {

            return template.thirdPartyScripts().map((script) => new Promise((resolve, reject) => {

                var scriptElement = $document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.setAttribute('src', script.getAttribute('src'));

                scriptElement.addEventListener('load', () => {
                    resolve(scriptElement);
                });

                $document.head.appendChild(scriptElement);

            }));

        }

        /**
         * @method resolveScripts
         * @param {Template} template
         * @return {Promise[]}
         */
        resolveScripts(template) {

            return template.componentScripts().map((scriptElement) => new Promise((resolve) => {

                let scriptPath = template.resolveScriptPath(scriptElement.getAttribute('src'));

                System.import(scriptPath).then((moduleImport) => {

                    // Resolve each script contained within the template element.
                    resolve(new Component({ script: moduleImport.default, template: template }));

                });

            }));

        }

        /**
         * Responsible for creating the custom element using $document.registerElement, and then appending
         * the associated React.js component.
         *
         * @method registerElement
         * @param {Component} component
         * @return {void}
         */
        registerElement(component) {

            $document.registerElement(component.elementName(), {
                prototype: component.customElement()
            });

        }

        /**
         * @method findLinks
         * @return {Array}
         */
        findLinks() {
            return utility.toArray($document.querySelectorAll(utility.selector.links));
        }

        /**
         * @method findTemplates
         * @param {HTMLDocument} [documentRoot=$document]
         * @return {Array}
         */
        findTemplates(documentRoot = $document) {
            return utility.toArray(documentRoot.querySelectorAll(utility.selector.templates));
        }

    }

    // No documents, no person.
    $document.addEventListener('DOMContentLoaded', () => new Maple());

})(window, document);