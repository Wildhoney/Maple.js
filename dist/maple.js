(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

(function main($window, $document) {

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
            key: 'toArray',

            /**
             * @method toArray
             * @param {*} arrayLike
             * @return {Array}
             */
            value: function toArray(arrayLike) {
                return Array.prototype.slice.apply(arrayLike);
            }
        }, {
            key: 'component',

            /**
             * @method component
             * @param {String} name
             * @param {Object} blueprint
             * @return {void}
             */
            value: function component(name, blueprint) {

                var element = React.createClass(blueprint);
                this.elements[name] = this.createElement(name, React.createElement(element));
            }
        }, {
            key: 'associateCSS',

            /**
             * @method associateCSS
             * @param {Document} ownerDocument
             * @param {ShadowRoot} shadowRoot
             * @return {void}
             */
            value: function associateCSS(ownerDocument, shadowRoot) {
                var _this2 = this;

                this.toArray($document.querySelectorAll('link')).forEach(function (link) {

                    if (link['import'] === ownerDocument) {
                        (function () {

                            var path = link.getAttribute('href').split('/').slice(0, -1).join('/'),
                                templateElement = ownerDocument.querySelector('template').content,
                                cssDocuments = _this2.toArray(templateElement.querySelectorAll(options.linkSelector)).map(function (model) {
                                return '' + path + '/' + model.getAttribute('href');
                            });

                            cssDocuments.forEach(function (cssDocument) {

                                var styleElement = $document.createElement('style');
                                styleElement.setAttribute('type', 'text/css');
                                styleElement.innerHTML = '@import url(' + cssDocument + ')';
                                shadowRoot.appendChild(styleElement);
                            });
                        })();
                    }
                });
            }
        }, {
            key: 'delegateEvents',

            /**
             * @method delegateEvents
             * @param {HTMLElement} contentElement
             * @param {ReactClass.createClass.Constructor} component
             * @return {void}
             */
            value: function delegateEvents(contentElement, component) {

                var aElement = document.createElement('a'),
                    events = [],
                    eventEsque = /on[a-z]+/i;

                Object.keys(aElement).forEach(function (key) {

                    if (key.match(eventEsque)) {
                        events.push(key.replace(/^on/, ''));
                    }
                });

                /**
                 * @method findEvents
                 * @param {Object} node
                 * @param {String} reactId
                 * @param {String} eventName
                 * @return {Object|undefined}
                 */
                function findEvents(_x, _x2, _x3) {
                    var _again = true;

                    _function: while (_again) {
                        events = children = id = item = undefined;
                        _again = false;
                        var node = _x,
                            reactId = _x2,
                            eventName = _x3;

                        var events = [];

                        if (node._currentElement._store.props.hasOwnProperty(eventName)) {
                            events.push(node._currentElement._store.props[eventName]);
                        }

                        if (node._rootNodeID === reactId) {
                            return events;
                        }

                        var children = node._renderedChildren;

                        for (var id in children) {

                            if (children.hasOwnProperty(id)) {

                                var item = children[id];

                                if (item._rootNodeID === reactId) {

                                    if (item._instance.props.hasOwnProperty(eventName)) {
                                        events.push(item._instance.props[eventName]);
                                    }

                                    return events;
                                }

                                if (item._renderedChildren) {
                                    _x = item;
                                    _x2 = reactId;
                                    _again = true;
                                    continue _function;
                                }
                            }
                        }
                    }
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var eventName = _step.value;

                        contentElement.addEventListener(eventName, function onClick(event) {

                            if (!(event.target instanceof HTMLElement)) {
                                return;
                            }

                            var components = component._reactInternalInstance._renderedComponent._renderedComponent,
                                eventFn = 'on' + (event.type.charAt(0).toUpperCase() + event.type.slice(1));
                            events = findEvents(components, event.target.getAttribute('data-reactid'), eventFn);

                            events.forEach(function (eventFn) {
                                eventFn();
                            });
                        });
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
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

                var ownerDocument = $document.currentScript.ownerDocument,
                    delegateEvents = this.delegateEvents.bind(this),
                    associateCSS = this.associateCSS.bind(this, ownerDocument),
                    elementPrototype = Object.create(HTMLElement.prototype, {

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

                            var contentElement = ownerDocument.createElement('content'),
                                shadowRoot = this.createShadowRoot();

                            associateCSS(shadowRoot);
                            shadowRoot.appendChild(contentElement);

                            var component = React.render(element, contentElement);

                            delegateEvents(contentElement, component);
                        }

                    }

                });

                /**
                 * @property MegaButton
                 * @type {Object}
                 */
                $document.registerElement(name, {
                    prototype: elementPrototype
                });
            }
        }]);

        return Maple;
    })();

    $window.maple = new Maple();
})(window, document);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUU7O0FBRS9CLGdCQUFZLENBQUM7Ozs7OztBQU1iLFFBQU0sT0FBTyxHQUFHO0FBQ1osb0JBQVksRUFBRSx1QkFBdUI7QUFDckMsc0JBQWMsRUFBRSxvQkFBb0I7QUFDcEMscUJBQWEsRUFBRSxnQkFBZ0I7QUFDL0IsbUJBQVcsRUFBRSxNQUFNO0tBQ3RCLENBQUM7Ozs7Ozs7O1FBT0ksS0FBSzs7Ozs7OztBQU1JLGlCQU5ULEtBQUssR0FNTztrQ0FOWixLQUFLOztBQU9ILGdCQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUN0Qjs7cUJBUkMsS0FBSzs7Ozs7Ozs7O21CQWdCTyx3QkFBQyxPQUFPLEVBQUU7QUFDcEIsc0JBQU0sSUFBSSxLQUFLLGdCQUFjLE9BQU8sT0FBSSxDQUFDO2FBQzVDOzs7Ozs7Ozs7bUJBT00saUJBQUMsU0FBUyxFQUFFO0FBQ2YsdUJBQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2pEOzs7Ozs7Ozs7O21CQVFRLG1CQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7O0FBRXZCLG9CQUFJLE9BQU8sR0FBVyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25ELG9CQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUVoRjs7Ozs7Ozs7OzttQkFRVyxzQkFBQyxhQUFhLEVBQUUsVUFBVSxFQUFFOzs7QUFFcEMsb0JBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUUvRCx3QkFBSSxJQUFJLFVBQU8sS0FBSyxhQUFhLEVBQUU7OztBQUUvQixnQ0FBSSxJQUFJLEdBQWMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0NBQzdFLGVBQWUsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU87Z0NBQ2pFLFlBQVksR0FBTSxPQUFLLE9BQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ2xHLDRDQUFVLElBQUksU0FBSSxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFHOzZCQUNsRCxDQUFDLENBQUM7O0FBRVAsd0NBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxXQUFXLEVBQUs7O0FBRWxDLG9DQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELDRDQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM5Qyw0Q0FBWSxDQUFDLFNBQVMsb0JBQWtCLFdBQVcsTUFBRyxDQUFDO0FBQ3ZELDBDQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDOzZCQUV4QyxDQUFDLENBQUM7O3FCQUVOO2lCQUVKLENBQUMsQ0FBQzthQUVOOzs7Ozs7Ozs7O21CQVFhLHdCQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUU7O0FBRXRDLG9CQUFJLFFBQVEsR0FBSyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztvQkFDeEMsTUFBTSxHQUFPLEVBQUU7b0JBQ2YsVUFBVSxHQUFHLFdBQVcsQ0FBQzs7QUFFN0Isc0JBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLOztBQUVuQyx3QkFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3ZCLDhCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO2lCQUVKLENBQUMsQ0FBQzs7Ozs7Ozs7O0FBU0gseUJBQVMsVUFBVTs7OzhDQUEyQjtBQUV0Qyw4QkFBTSxHQVVOLFFBQVEsR0FFSCxFQUFFLEdBSUMsSUFBSTs7NEJBbEJBLElBQUk7NEJBQUUsT0FBTzs0QkFBRSxTQUFTOztBQUV4Qyw0QkFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQiw0QkFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzdELGtDQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3lCQUM3RDs7QUFFRCw0QkFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFBRTtBQUM5QixtQ0FBTyxNQUFNLENBQUM7eUJBQ2pCOztBQUVELDRCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7O0FBRXRDLDZCQUFLLElBQUksRUFBRSxJQUFJLFFBQVEsRUFBRTs7QUFFckIsZ0NBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRTs7QUFFN0Isb0NBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFeEIsb0NBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUU7O0FBRTlCLHdDQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNoRCw4Q0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3FDQUNoRDs7QUFFRCwyQ0FBTyxNQUFNLENBQUM7aUNBRWpCOztBQUVELG9DQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTt5Q0FDTixJQUFJOzBDQUFFLE9BQU87OztpQ0FDbEM7NkJBRUo7eUJBRUo7cUJBRUo7aUJBQUE7Ozs7Ozs7QUFFRCx5Q0FBc0IsTUFBTTs0QkFBbkIsU0FBUzs7QUFFZCxzQ0FBYyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7O0FBRS9ELGdDQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQ3hDLHVDQUFPOzZCQUNWOztBQUVELGdDQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCO2dDQUNuRixPQUFPLFdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBRSxDQUFDO0FBQzdFLGtDQUFNLEdBQU8sVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFNUYsa0NBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDeEIsdUNBQU8sRUFBRSxDQUFDOzZCQUNiLENBQUMsQ0FBQzt5QkFFTixDQUFDLENBQUM7cUJBRU47Ozs7Ozs7Ozs7Ozs7OzthQUVKOzs7Ozs7Ozs7O21CQVFZLHVCQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRXpCLG9CQUFJLGFBQWEsR0FBTSxTQUFTLENBQUMsYUFBYSxDQUFDLGFBQWE7b0JBQ3hELGNBQWMsR0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ2pELFlBQVksR0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDO29CQUM5RCxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7Ozs7OztBQU14RCxtQ0FBZSxFQUFFOzs7Ozs7QUFNYiw2QkFBSyxFQUFFLFNBQVMsS0FBSyxHQUFHOztBQUVwQixnQ0FBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLGdDQUFJLGNBQWMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztnQ0FDdkQsVUFBVSxHQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztBQUU3Qyx3Q0FBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pCLHNDQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV2QyxnQ0FBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRXRELDBDQUFjLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3lCQUU3Qzs7cUJBRUo7O2lCQUVKLENBQUMsQ0FBQzs7Ozs7O0FBTUgseUJBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQzVCLDZCQUFTLEVBQUUsZ0JBQWdCO2lCQUM5QixDQUFDLENBQUM7YUFFTjs7O2VBdk5DLEtBQUs7OztBQTJOWCxXQUFPLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7Q0FFL0IsQ0FBQSxDQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gbWFpbigkd2luZG93LCAkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IG9wdGlvbnNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGxpbmtTZWxlY3RvcjogJ2xpbmtbdHlwZT1cInRleHQvY3NzXCJdJyxcbiAgICAgICAgaW1wb3J0U2VsZWN0b3I6ICdsaW5rW3JlbD1cImltcG9ydFwiXScsXG4gICAgICAgIGRhdGFBdHRyaWJ1dGU6ICdkYXRhLWNvbXBvbmVudCcsXG4gICAgICAgIGRhdGFFbGVtZW50OiAnaHRtbCdcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1vZHVsZSBNYXBsZVxuICAgICAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICAgICAqL1xuICAgIGNsYXNzIE1hcGxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqIEByZXR1cm4ge01hcGxlfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCB0aHJvd0V4Y2VwdGlvblxuICAgICAgICAgKiBAdGhyb3dzIEVycm9yXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB0aHJvd0V4Y2VwdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcGxlLmpzOiAke21lc3NhZ2V9LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5TGlrZVxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFycmF5TGlrZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBjb21wb25lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGJsdWVwcmludFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY29tcG9uZW50KG5hbWUsIGJsdWVwcmludCkge1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudCAgICAgICAgID0gUmVhY3QuY3JlYXRlQ2xhc3MoYmx1ZXByaW50KTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbbmFtZV0gPSB0aGlzLmNyZWF0ZUVsZW1lbnQobmFtZSwgUmVhY3QuY3JlYXRlRWxlbWVudChlbGVtZW50KSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZUNTU1xuICAgICAgICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50XG4gICAgICAgICAqIEBwYXJhbSB7U2hhZG93Um9vdH0gc2hhZG93Um9vdFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgYXNzb2NpYXRlQ1NTKG93bmVyRG9jdW1lbnQsIHNoYWRvd1Jvb3QpIHtcblxuICAgICAgICAgICAgdGhpcy50b0FycmF5KCRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLmZvckVhY2goKGxpbmspID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChsaW5rLmltcG9ydCA9PT0gb3duZXJEb2N1bWVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoICAgICAgICAgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudCA9IG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGVtcGxhdGUnKS5jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzRG9jdW1lbnRzICAgID0gdGhpcy50b0FycmF5KHRlbXBsYXRlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMubGlua1NlbGVjdG9yKSkubWFwKChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtwYXRofS8ke21vZGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjc3NEb2N1bWVudHMuZm9yRWFjaCgoY3NzRG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlRWxlbWVudCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGBAaW1wb3J0IHVybCgke2Nzc0RvY3VtZW50fSlgO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZGVsZWdhdGVFdmVudHNcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtSZWFjdENsYXNzLmNyZWF0ZUNsYXNzLkNvbnN0cnVjdG9yfSBjb21wb25lbnRcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlbGVnYXRlRXZlbnRzKGNvbnRlbnRFbGVtZW50LCBjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgbGV0IGFFbGVtZW50ICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXG4gICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IFtdLFxuICAgICAgICAgICAgICAgIGV2ZW50RXNxdWUgPSAvb25bYS16XSsvaTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYUVsZW1lbnQpLmZvckVhY2goKGtleSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGtleS5tYXRjaChldmVudEVzcXVlKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChrZXkucmVwbGFjZSgvXm9uLywgJycpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgZmluZEV2ZW50c1xuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByZWFjdElkXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kRXZlbnRzKG5vZGUsIHJlYWN0SWQsIGV2ZW50TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuX2N1cnJlbnRFbGVtZW50Ll9zdG9yZS5wcm9wcy5oYXNPd25Qcm9wZXJ0eShldmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKG5vZGUuX2N1cnJlbnRFbGVtZW50Ll9zdG9yZS5wcm9wc1tldmVudE5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZCBpbiBjaGlsZHJlbikge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBjaGlsZHJlbltpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5faW5zdGFuY2UucHJvcHMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChpdGVtLl9pbnN0YW5jZS5wcm9wc1tldmVudE5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yZW5kZXJlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRFdmVudHMoaXRlbSwgcmVhY3RJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGV2ZW50TmFtZSBvZiBldmVudHMpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50cyA9IGNvbXBvbmVudC5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgID0gYG9uJHtldmVudC50eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZXZlbnQudHlwZS5zbGljZSgxKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzICAgICA9IGZpbmRFdmVudHMoY29tcG9uZW50cywgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1yZWFjdGlkJyksIGV2ZW50Rm4pO1xuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudEZuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgY3JlYXRlRWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlRWxlbWVudChuYW1lLCBlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBvd25lckRvY3VtZW50ICAgID0gJGRvY3VtZW50LmN1cnJlbnRTY3JpcHQub3duZXJEb2N1bWVudCxcbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZUV2ZW50cyAgID0gdGhpcy5kZWxlZ2F0ZUV2ZW50cy5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGFzc29jaWF0ZUNTUyAgICAgPSB0aGlzLmFzc29jaWF0ZUNTUy5iaW5kKHRoaXMsIG93bmVyRG9jdW1lbnQpLFxuICAgICAgICAgICAgICAgIGVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQHByb3BlcnR5IGNyZWF0ZWRDYWxsYmFja1xuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb250ZW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdCAgICAgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRlQ1NTKHNoYWRvd1Jvb3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIoZWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxlZ2F0ZUV2ZW50cyhjb250ZW50RWxlbWVudCwgY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBNZWdhQnV0dG9uXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgICAgICAgICBwcm90b3R5cGU6IGVsZW1lbnRQcm90b3R5cGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgICR3aW5kb3cubWFwbGUgPSBuZXcgTWFwbGUoKTtcblxufSkod2luZG93LCBkb2N1bWVudCk7Il19
