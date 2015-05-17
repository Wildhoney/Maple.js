import HTMLRenderer from '../../../vendor/maple/components/HTMLRenderer';

/**
 * @module DateTime
 * @extends React.Component
 */
export default class XTest extends HTMLRenderer {

    go() {
        console.log('Here');
    }

    /*
     * @method render
     * @return {Object}
     */
    //render() {
    //    let unixTimestamp = Number(this.props.unix) || Date.now();
    //    let dateFormat    = this.props.format || 'MM-DD-YYYY';
    //    return <time>{moment(unixTimestamp).format(dateFormat)}</time>
    //}

}