import events  from './../helpers/Events.js';
import css     from './../helpers/Stylesheets.js';

/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */
export default class Component {

    /**
     * @constructor
     * @return {Component}
     */
    constructor() {
        this.components = [];
    }

    /**
     * @method getImports
     * @return {Array}
     */
    getImports() {

        let importDocuments = document.querySelectorAll('link[rel="import"]');

        return this.toArray(importDocuments).map((importDocument) => {

            return new Promise((resolve, reject) => {
                importDocument.addEventListener('load', resolve(event.path[0]));
            });

        });

        //return this.toArray(document.querySelectorAll('link[rel="import"]')).map((linkElement) => {
        //
        //    linkElement.addEventListener('load', (link) => {
        //
        //        console.log(link.path[0].import);
        //
        //    });
        //
        //    return {
        //        href: linkElement.getAttribute('href'),
        //        document: linkElement.ownerDocument
        //    };
        //
        //});

    }

    /**
     * @method findImport
     * @param {String} elementName
     * @return {Object}
     */
    findImport(elementName) {

        return this.imports.filter((link) => {

            let regExp = new RegExp(`${elementName}\/(?:.+?)\.html`, 'i');

            if (link.href.match(regExp)) {
                return link;
            }

        })[0];

    }

    /**
     * @method toArray
     * @param {*} arrayLike
     * @return {Array}
     */
    toArray(arrayLike) {
        return Array.prototype.slice.apply(arrayLike);
    }

    /**
     * @method moduleDocument
     * @param {String} elementName
     * @return {void}
     */
    moduleDocument(elementName) {

        //let importDocument = this.findImport(elementName),
        //    scriptElements = importDocument.document.querySelectorAll('script[type="text/javascript"]');
        //
        //console.log(importDocument);

    }

    /**
     * @method delegate
     * @param {Array} modules
     * @return {void}
     */
    register(...modules) {

        Promise.all(this.getImports()).then((linkElements) => {

            

        });

        //modules.forEach((name) => {
        //
        //    let elementName     = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
        //        documentElement = this.moduleDocument(elementName);
        //
        //    let prototype     = Object.create(HTMLElement.prototype, {
        //
        //        /**
        //         * @property createdCallback
        //         * @type {Object}
        //         */
        //        createdCallback: {
        //
        //            /**
        //             * @method value
        //             * @return {void}
        //             */
        //            value: function value() {
        //
        //                //this.innerHTML = '';
        //                //
        //                //// Todo: Make all of this dynamic!
        //                //let path = 'app/components/user-calendar';
        //                //
        //                //System.import(`${path}/calendar`).then((Component) => {
        //                //
        //                //    let element        = React.createElement(Component.default),
        //                //        contentElement = document.createElement('content'),
        //                //        shadowRoot     = this.createShadowRoot();
        //                //
        //                //    //console.log(Component.default.toString());
        //                //
        //                //    css.associate(path, shadowRoot);
        //                //    shadowRoot.appendChild(contentElement);
        //                //
        //                //    let component = React.render(element, contentElement);
        //                //    events.delegate(contentElement, component);
        //                //
        //                //});
        //
        //            }
        //
        //        }
        //
        //    });
        //
        //    document.registerElement(elementName, {
        //        prototype: prototype
        //    });
        //
        //});

    }

}