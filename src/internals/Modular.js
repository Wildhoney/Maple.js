import MapleTemplate from './../components/Template.js';
import MapleException from './Exception.js';

export default class MapleModule {

    /**
     * @method constructor
     * @param name {String}
     * @param dependencies {Array}
     * @return {Object}
     */
    constructor(name, dependencies) {
        this.name         = name;
        this.templates    = {};
        this.dependencies = dependencies;
    }

    /**
     * @method renderTemplate
     * @param {String} name
     * @param {HTMLTemplateElement} element
     * @return {Object}
     */
    renderTemplate(name, element) {

        if (!(element instanceof HTMLTemplateElement)) {
            MapleException.throwException(`Templates must be rendered in \`template\` elements`);
        }

        return this.templates[name] = new MapleTemplate(name, element);

    }

}