import Module    from './models/Module.js';
import Component from './models/Component.js';
import selectors from './helpers/Selectors.js';
import utility   from './helpers/Utility.js';
import events    from './helpers/Events.js';

(function main($window, $document) {

    "use strict";

    if (typeof System !== 'undefined') {
        System.transpiler   = 'babel';
        System.babelOptions = { blacklist: [] };
    }

    /**
     * @constant HAS_INITIATED
     * @type {Boolean}
     */
    let HAS_INITIATED = false;

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
            
        }

        /**
         * Responsible for finding all of the external link elements, as well as the inline template elements
         * that can be handcrafted, or baked into the HTML document when compiling a project.
         *
         * @method findLinks
         * @return {void}
         */
        findLinks() {

            selectors.getLinks($document).forEach((linkElement) => {

                if (linkElement.import) {
                    return void new Module(linkElement);
                }

                linkElement.addEventListener('load', () => new Module(linkElement));

            });

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
                let ref            = templateElement.getAttribute('ref');
                let path           = utility.resolver(ref, null).production;

                scriptElements.forEach((scriptElement) => {

                    if (path.isLocalPath(scriptElement.getAttribute('src'))) {
                        new Component(path, templateElement, scriptElement);
                    }

                });

            });

        }

    }

    /**
     * @method initialise
     * @return {Boolean}
     */
    function initialise() {

        let state       = $document.readyState,
            readyStates = ['interactive', 'complete'];

        if (!HAS_INITIATED && ~readyStates.indexOf(state)) {

            HAS_INITIATED = true;

            // No documents, no person.
            new Maple();

        }

    }

    // Support for async, defer, and normal inclusion.
    initialise();
    $document.addEventListener('DOMContentLoaded', initialise);

})(window, document);