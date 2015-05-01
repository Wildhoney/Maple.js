/**
 * @constructor
 * @param {String} label
 * @param {String} message
 * @param {String} colour
 * @return {log}
 */
export default function log(label, message, colour) {

    "use strict";

    let commonStyles = 'text-transform: uppercase; line-height: 20px; font-size: 9px;';

    console.log(
        `%c Maple %c ${label} %c ${message}`,
        `${commonStyles} color: white; background-color: black; padding: 3px 5px`,
        `${commonStyles} color: ${colour}; text-transform: lowercase`,
        `${commonStyles} color: rgba(0, 0, 0, .55)`
    );

}