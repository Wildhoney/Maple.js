/**
 * @constructor
 * @param {String} label
 * @param {String} message
 * @param {String} colour
 * @return {log}
 */
export default function lof(label, message, colour) {

    "use strict";

    console.log(
        `%c Maple.js: %c${label} %c${message}`,
        'font-size: 11px; color: rgba(0, 0, 0, .25)',
        `font-size: 11px; color: ${colour}`,
        'font-size: 11px; color: black'
    );

    //console.log('Maple', label, message);

}