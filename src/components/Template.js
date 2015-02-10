export default class MapleView {

    /**
     * @constructor
     * @param name {String}
     * @param element {HTMLElement}
     * @return {MapleView}
     */
    constructor(name, element) {

        element.createShadowRoot();

        this.name    = name;
        this.element = element;
    }

    /**
     * @method toString
     * @return {String}
     */
    toString() {
        return '[object MapleTemplate]';
    }

}