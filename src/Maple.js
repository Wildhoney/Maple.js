import Module    from './models/Module.js';
import Component from './models/Component.js';
import selectors from './helpers/Selectors.js';
import utility   from './helpers/Utility.js';
import logger    from './helpers/Logger.js';
import events    from './helpers/Events.js';
import options   from './helpers/Options.js';

(function main($window, $document) {

    "use strict";

    if (typeof System !== 'undefined') {
        System.transpiler   = 'babel';
        System.babelOptions = { blacklist: [] };
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

            this.findLinks();
            this.findTemplates();

            // Configure the event delegation mappings.
            events.setupDelegation();

            // Listen for any changes to the DOM where HTML imports can be dynamically imported
            // into the document.
            this.observeMutations();

        }

        /**
         * Responsible for finding all of the external link elements, as well as the inline template elements
         * that can be handcrafted, or baked into the HTML document when compiling a project.
         *
         * @method findLinks
         * @return {void}
         */
        findLinks() {
            selectors.getImports($document).forEach((linkElement) => this.waitForLinkElement(linkElement));
        }

        /**
         * Responsible for finding all of the template HTML elements that contain the `ref` attribute which
         * is the component's original path before Mapleify.
         *
         * @method findTemplates
         * @return {void}
         */
        findTemplates() {

            selectors.getTemplates($document).forEach((templateElement) => {

                let scriptElements = selectors.getAllScripts(templateElement.content);
                let path           = utility.resolver(templateElement, null).production;

                scriptElements.forEach((scriptElement) => {

                    if (path.isLocalPath(scriptElement.getAttribute('src'))) {
                        new Component(path, templateElement, scriptElement);
                    }

                });

            });

        }

        /**
         * @method waitForLinkElement
         * @param {HTMLLinkElement} linkElement
         * @return {void}
         */
        waitForLinkElement(linkElement) {

            if (linkElement.import) {
                return void new Module(linkElement);
            }

            new Promise((resolve, reject) => {

                linkElement.addEventListener('load', () => resolve(linkElement));

                let href         = linkElement.getAttribute('href'),
                    errorMessage = `Timeout of ${options.RESOLVE_TIMEOUT / 1000} seconds exceeded whilst waiting for HTML import: "${href}"`;
                utility.resolveTimeout(errorMessage, reject);

            }).then((linkElement) => new Module(linkElement), (message) => logger.error(message));

        }

        /**
         * Listens for changes to the `HTMLHeadElement` node and registers any new imports that are
         * dynamically imported into the document.
         *
         * @method observeMutations
         * @return {void}
         */
        observeMutations() {

            let observer = new MutationObserver((mutations) => {

                mutations.forEach((mutation) => {

                    let addedNodes = utility.toArray(mutation.addedNodes);

                    addedNodes.forEach((node) => {

                        if (utility.isHTMLImport(node)) {
                            this.waitForLinkElement(node);
                        }

                    });

                });


            });

            observer.observe($document.head, { childList: true });

        }

    }

    /**
     * @method initialise
     * @return {Function}
     */
    let initialise = (function initialise() {
        
        let hasInitiated = false;
        
        return function() {

            let state       = $document.readyState,
                readyStates = ['interactive', 'complete'];

            if (!hasInitiated && ~readyStates.indexOf(state)) {

                hasInitiated = true;

                // No documents, no person.
                new Maple();

            }
            
        }

    })();

    // Support for async, defer, and normal inclusion.
    initialise();
    $document.addEventListener('DOMContentLoaded', initialise);

})(window, document);