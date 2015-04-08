(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

(function main($window) {

    'use strict';

    /**
     * @constant options
     * @type {Object}
     */
    var options = {
        linkSelector: 'link[type="text/css"]',
        importSelector: 'link[rel="import"]',
        dataAttribute: 'data-component',
        dataElement: 'html'
    };

    /**
     * @module Maple
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/Maple.js
     */

    var Maple = (function () {

        /**
         * @constructor
         * @return {Maple}
         */

        function Maple() {
            _classCallCheck(this, Maple);

            this.elements = [];
        }

        _createClass(Maple, [{
            key: 'throwException',

            /**
             * @method throwException
             * @throws Error
             * @param {String} message
             * @return {void}
             */
            value: function throwException(message) {
                throw new Error('Maple.js: ' + message + '.');
            }
        }, {
            key: 'register',

            /**
             * @method register
             * @param {String} name
             * @param {Object} blueprint
             * @return {void}
             */
            value: function register(name, blueprint) {

                var element = React.createClass(blueprint);
                this.elements[name] = this.createElement(name, React.createElement(element));
            }
        }, {
            key: 'associateCSS',

            /**
             * @method associateCSS
             * @param {String} name
             * @param {Document} ownerDocument
             * @param {ShadowRoot} shadowRoot
             * @return {void}
             */
            value: function associateCSS(name, ownerDocument, shadowRoot) {

                console.log(ownerDocument);
            }
        }, {
            key: 'createElement',

            /**
             * @method createElement
             * @param {String} name
             * @param {Object} element
             * @return {void}
             */
            value: function createElement(name, element) {

                var ownerDocument = document.currentScript.ownerDocument,
                    associateCSS = this.associateCSS.bind(this, name, ownerDocument);

                var elementPrototype = Object.create(HTMLElement.prototype, {

                    /**
                     * @property createdCallback
                     * @type {Object}
                     */
                    createdCallback: {

                        /**
                         * @method value
                         * @return {void}
                         */
                        value: function value() {

                            this.innerHTML = '';

                            ownerDocument.querySelector(options.dataElement).setAttribute(options.dataAttribute, name);

                            var contentElement = document.createElement('content'),
                                shadowRoot = this.createShadowRoot();

                            shadowRoot.appendChild(contentElement);
                            React.render(element, contentElement);
                            associateCSS(shadowRoot);
                        }

                    }

                });

                /**
                 * @property MegaButton
                 * @type {Object}
                 */
                document.registerElement(name, {
                    prototype: elementPrototype
                });
            }
        }]);

        return Maple;
    })();

    $window.maple = new Maple();
})(window);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRTs7QUFFcEIsZ0JBQVksQ0FBQzs7Ozs7O0FBTWIsUUFBTSxPQUFPLEdBQUc7QUFDWixvQkFBWSxFQUFFLHVCQUF1QjtBQUNyQyxzQkFBYyxFQUFFLG9CQUFvQjtBQUNwQyxxQkFBYSxFQUFFLGdCQUFnQjtBQUMvQixtQkFBVyxFQUFFLE1BQU07S0FDdEIsQ0FBQzs7Ozs7Ozs7UUFPSSxLQUFLOzs7Ozs7O0FBTUksaUJBTlQsS0FBSyxHQU1PO2tDQU5aLEtBQUs7O0FBT0gsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1NBQ3RCOztxQkFSQyxLQUFLOzs7Ozs7Ozs7bUJBZ0JPLHdCQUFDLE9BQU8sRUFBRTtBQUNwQixzQkFBTSxJQUFJLEtBQUssZ0JBQWMsT0FBTyxPQUFJLENBQUM7YUFDNUM7Ozs7Ozs7Ozs7bUJBUU8sa0JBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTs7QUFFdEIsb0JBQUksT0FBTyxHQUFXLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsb0JBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBRWhGOzs7Ozs7Ozs7OzttQkFTVyxzQkFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRTs7QUFFMUMsdUJBQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7YUFFOUI7Ozs7Ozs7Ozs7bUJBUVksdUJBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFekIsb0JBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYTtvQkFDcEQsWUFBWSxHQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FBRXRFLG9CQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTs7Ozs7O0FBTXhELG1DQUFlLEVBQUU7Ozs7OztBQU1iLDZCQUFLLEVBQUUsU0FBUyxLQUFLLEdBQUc7O0FBRXBCLGdDQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIseUNBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUUzRixnQ0FBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7Z0NBQ2xELFVBQVUsR0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7QUFFN0Msc0NBQVUsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdkMsaUNBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3RDLHdDQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7eUJBRTVCOztxQkFFSjs7aUJBRUosQ0FBQyxDQUFDOzs7Ozs7QUFNSCx3QkFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsNkJBQVMsRUFBRSxnQkFBZ0I7aUJBQzlCLENBQUMsQ0FBQzthQUVOOzs7ZUFoR0MsS0FBSzs7O0FBb0dYLFdBQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztDQUUvQixDQUFBLENBQUUsTUFBTSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIG1haW4oJHdpbmRvdykge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RhbnQgb3B0aW9uc1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuICAgICAgICBpbXBvcnRTZWxlY3RvcjogJ2xpbmtbcmVsPVwiaW1wb3J0XCJdJyxcbiAgICAgICAgZGF0YUF0dHJpYnV0ZTogJ2RhdGEtY29tcG9uZW50JyxcbiAgICAgICAgZGF0YUVsZW1lbnQ6ICdodG1sJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbW9kdWxlIE1hcGxlXG4gICAgICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L01hcGxlLmpzXG4gICAgICovXG4gICAgY2xhc3MgTWFwbGUge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICogQHJldHVybiB7TWFwbGV9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRocm93RXhjZXB0aW9uXG4gICAgICAgICAqIEB0aHJvd3MgRXJyb3JcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHRocm93RXhjZXB0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwbGUuanM6ICR7bWVzc2FnZX0uYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCByZWdpc3RlclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYmx1ZXByaW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlcihuYW1lLCBibHVlcHJpbnQpIHtcblxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgICAgICAgICA9IFJlYWN0LmNyZWF0ZUNsYXNzKGJsdWVwcmludCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzW25hbWVdID0gdGhpcy5jcmVhdGVFbGVtZW50KG5hbWUsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBhc3NvY2lhdGVDU1NcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgICAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZUNTUyhuYW1lLCBvd25lckRvY3VtZW50LCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG93bmVyRG9jdW1lbnQpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVFbGVtZW50KG5hbWUsIGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQsXG4gICAgICAgICAgICAgICAgYXNzb2NpYXRlQ1NTICA9IHRoaXMuYXNzb2NpYXRlQ1NTLmJpbmQodGhpcywgbmFtZSwgb3duZXJEb2N1bWVudCk7XG5cbiAgICAgICAgICAgIGxldCBlbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBjcmVhdGVkQ2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZWRDYWxsYmFjazoge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAbWV0aG9kIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmRhdGFFbGVtZW50KS5zZXRBdHRyaWJ1dGUob3B0aW9ucy5kYXRhQXR0cmlidXRlLCBuYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QucmVuZGVyKGVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc29jaWF0ZUNTUyhzaGFkb3dSb290KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBNZWdhQnV0dG9uXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwge1xuICAgICAgICAgICAgICAgIHByb3RvdHlwZTogZWxlbWVudFByb3RvdHlwZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgJHdpbmRvdy5tYXBsZSA9IG5ldyBNYXBsZSgpO1xuXG59KSh3aW5kb3cpOyJdfQ==
