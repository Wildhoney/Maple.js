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
         * @param {Array} blacklist
         * @return {void}
         */
        constructor(...blacklist) {

            /**
             * @property components
             * @type {Array}
             */
            this.components = [];

            $document.addEventListener('DOMContentLoaded', () => {
                this.findComponents(...blacklist);
            });

        }

        /**
         * @method findComponents
         * @param {Array} blacklist
         * @return {void}
         */
        findComponents(...blacklist) {

            void blacklist;

            [].concat(this.loadLinks(...blacklist)).forEach((promise) => promise.then((templates) => {

                templates.forEach((template) => {

                    this.resolveScripts(template).forEach((promise) => promise.then((component) => {

                        // Register the custom element using the resolved script.
                        this.registerElement(component);

                    }));

                    // Import the template element minus the Maple scripts and styles.
                    let imported = $document.importNode(template.content(), true);
                    $document.body.appendChild(imported);

                });

            }));

        }

        /**
         * @method loadLinks
         * @param {Array} blacklist
         * @return {Promise[]}
         */
        loadLinks(...blacklist) {

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
         * @method resolveScripts
         * @param {Template} template
         * @return {Promise[]}
         */
        resolveScripts(template) {

            return template.scripts().map((scriptElement) => new Promise((resolve) => {

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
         * @param {Array} blacklist
         * @return {Array}
         */
        findLinks(...blacklist) {
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

    $window.Maple = Maple;

})(window, document);