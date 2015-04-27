/**
 * @constructor
 * @param {String} label
 * @param {String} message
 * @param {String} colour
 * @return {log}
 */
export default function log(label, message, colour) {

    "use strict";

    let commonStyles = 'text-transform: uppercase; line-height: 20px; padding: 3px 5px; font-size: 9px;';

    console.log(
        `%c Maple %c ${label} %c ${message}`,
        `${commonStyles} color: rgba(0, 0, 0, .25); background-color: rgba(0, 0, 0, .1)`,
        `${commonStyles} color: white; background-color: ${colour}`,
        `${commonStyles} color: rgba(0, 0, 0, .55)`
    );

}