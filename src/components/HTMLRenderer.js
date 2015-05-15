/**
 * @module Maple
 * @submodule HTMLRenderer
 * @extends React.Component
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */
export default class HTMLRenderer extends React.Component {

    /**
     * @method render
     * @return {Object}
     */
    render() {

        let content   = this.props.element.innerHTML;

        var parser = new DOMParser(),
            doc    = parser.parseFromString(content, "text/xml");

        console.log(doc.firstChild);
        return React.createElement('div', null, doc.firstChild);


        //return React.createElement('time', null, 'xxx');
    }

}