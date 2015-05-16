(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/**
 * @module Maple
 * @submodule HTMLRenderer
 * @extends React.Component
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Maple.js
 */

var HTMLRenderer = (function (_React$Component) {
    function HTMLRenderer() {
        _classCallCheck(this, HTMLRenderer);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(HTMLRenderer, _React$Component);

    _createClass(HTMLRenderer, [{
        key: "render",

        /**
         * @method render
         * @return {Object}
         */
        value: function render() {

            var content = this.props.element.innerHTML;

            var parser = new DOMParser(),
                doc = parser.parseFromString(content, "text/xml");

            console.log(doc.firstChild);
            return React.createElement("div", null, doc.firstChild);

            //return React.createElement('time', null, 'xxx');
        }
    }]);

    return HTMLRenderer;
})(React.Component);

exports.HTMLRenderer = HTMLRenderer;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9IVE1MUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ09hLFlBQVk7YUFBWixZQUFZOzhCQUFaLFlBQVk7Ozs7Ozs7Y0FBWixZQUFZOztpQkFBWixZQUFZOzs7Ozs7O2VBTWYsa0JBQUc7O0FBRUwsZ0JBQUksT0FBTyxHQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzs7QUFFN0MsZ0JBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFO2dCQUN4QixHQUFHLEdBQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRXpELG1CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1QixtQkFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7U0FJM0Q7OztXQWxCUSxZQUFZO0dBQVMsS0FBSyxDQUFDLFNBQVM7O1FBQXBDLFlBQVksR0FBWixZQUFZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQG1vZHVsZSBNYXBsZVxuICogQHN1Ym1vZHVsZSBIVE1MUmVuZGVyZXJcbiAqIEBleHRlbmRzIFJlYWN0LkNvbXBvbmVudFxuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9XaWxkaG9uZXkvTWFwbGUuanNcbiAqL1xuZXhwb3J0IGNsYXNzIEhUTUxSZW5kZXJlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlbmRlclxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQgICA9IHRoaXMucHJvcHMuZWxlbWVudC5pbm5lckhUTUw7XG5cbiAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKSxcbiAgICAgICAgICAgIGRvYyAgICA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoY29udGVudCwgXCJ0ZXh0L3htbFwiKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhkb2MuZmlyc3RDaGlsZCk7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBudWxsLCBkb2MuZmlyc3RDaGlsZCk7XG5cblxuICAgICAgICAvL3JldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCd0aW1lJywgbnVsbCwgJ3h4eCcpO1xuICAgIH1cblxufSJdfQ==
