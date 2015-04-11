(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _Component = require('./components/Component.js');

var _Component2 = _interopRequireWildcard(_Component);

var _modular = require('./helpers/Modular.js');

var _modular2 = _interopRequireWildcard(_modular);

(function main($window, $document) {
    var Maple =

    /**
     * @constructor
     * @param {Array} modules
     * @return {void}
     */
    function Maple() {
        for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
            modules[_key] = arguments[_key];
        }

        _classCallCheck(this, Maple);

        _modular2['default'].register.apply(_modular2['default'], _toConsumableArray(modules));
    };

    $window.Maple = Maple;
    $window.Maple.Component = _Component2['default'];
})(window, document);

//(function main($window, $document) {
//
//    "use strict";
//
//    /**
//     * @module Maple
//     * @author Adam Timberlake
//     * @link https://github.com/Wildhoney/Maple.js
//     */
//    class Maple {
//
//        /**
//         * @constructor
//         * @return {Maple}
//         */
//        constructor() {
//            //this.elements = [];
//            //this.Component = new Component();
//        }
//
//        /**
//         * @method throwException
//         * @throws Error
//         * @param {String} message
//         * @return {void}
//         */
//        throwException(message) {
//            throw new Error(`Maple.js: ${message}.`);
//        }
//
//        /**
//         * @method component
//         * @param {String} name
//         * @param {Object} blueprint
//         * @return {void}
//         */
//        component(name, blueprint) {
//
//            let element         = React.createClass(blueprint);
//            this.elements[name] = this.createElement(name, React.createElement(element));
//
//        }
//
//        /**
//         * @method createElement
//         * @param {String} name
//         * @param {Object} element
//         * @return {void}
//         */
//        createElement(name, element) {
//
//            let ownerDocument    = $document.currentScript.ownerDocument,
//                elementPrototype = Object.create(HTMLElement.prototype, {
//
//                /**
//                 * @property createdCallback
//                 * @type {Object}
//                 */
//                createdCallback: {
//
//                    /**
//                     * @method value
//                     * @return {void}
//                     */
//                    value: function value() {
//
//                        this.innerHTML = '';
//
//                        let contentElement = ownerDocument.createElement('content'),
//                            shadowRoot     = this.createShadowRoot();
//
//                        css.associate(ownerDocument, shadowRoot);
//                        shadowRoot.appendChild(contentElement);
//
//                        let component = React.render(element, contentElement);
//                        events.delegate(contentElement, component);
//
//                    }
//
//                }
//
//            });
//
//            /**
//             * @property MegaButton
//             * @type {Object}
//             */
//            $document.registerElement(name, {
//                prototype: elementPrototype
//            });
//
//        }
//
//    }
//
//    $window.Maple           = new Maple();
//    $window.Maple.Component = new Component();
//
//})(window, document);

},{"./components/Component.js":2,"./helpers/Modular.js":4}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module Maple
 * @submodule Component
 * @link https://github.com/Wildhoney/Maple.js
 * @author Adam Timberlake
 */

var Component = function Component() {
  _classCallCheck(this, Component);
};

exports["default"] = Component;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main() {

    'use strict';

    return {

        /**
         * @method delegate
         * @param {HTMLElement} contentElement
         * @param {ReactClass.createClass.Constructor} component
         * @return {void}
         */
        delegate: function delegate(contentElement, component) {

            var aElement = document.createElement('a'),
                events = [],
                eventEsque = /on[a-z]+/i;

            Object.keys(aElement).forEach(function (key) {

                if (key.match(eventEsque)) {
                    events.push(key.replace(/^on/, ''));
                }
            });

            /**
             * @method getEvent
             * @param {String} eventName
             * @param {Object} properties
             * @return {Boolean}
             */
            function getEvent(eventName, properties) {

                var matchName = new RegExp(eventName, 'i'),
                    eventFn = null;

                Object.keys(properties).forEach(function (property) {

                    var propertyName = property.match(matchName);

                    if (propertyName) {
                        eventFn = properties[propertyName];
                    }
                });

                return eventFn;
            }

            /**
             * @method findEvents
             * @param {Object} node
             * @param {String} reactId
             * @param {String} eventName
             * @return {Array}
             */
            function findEvents(_x, _x2, _x3) {
                var _again = true;

                _function: while (_again) {
                    events = rootEventFn = children = id = item = childEventFn = undefined;
                    _again = false;
                    var node = _x,
                        reactId = _x2,
                        eventName = _x3;

                    var events = [],
                        rootEventFn = getEvent(eventName, node._currentElement._store.props);

                    if (rootEventFn) {

                        // Found event in root!
                        events.push(rootEventFn);
                    }

                    if (node._rootNodeID === reactId) {
                        return events;
                    }

                    var children = node._renderedChildren;

                    for (var id in children) {

                        if (children.hasOwnProperty(id)) {

                            var item = children[id];

                            if (item._rootNodeID === reactId) {

                                var childEventFn = getEvent(eventName, item._instance.props);

                                if (childEventFn) {

                                    // Found event in children!
                                    events.push(childEventFn);
                                }

                                return events;
                            }

                            if (item._renderedChildren) {
                                _x = item;
                                _x2 = reactId;
                                _x3 = eventName;
                                _again = true;
                                continue _function;
                            }
                        }
                    }
                }
            }

            /**
             * @method createEvent
             * @return {void}
             */
            function createEvent(eventName) {

                contentElement.addEventListener(eventName, function onClick(event) {

                    if (!(event.target instanceof HTMLElement)) {
                        return;
                    }

                    var components = component._reactInternalInstance._renderedComponent._renderedComponent,
                        eventFn = 'on' + event.type,
                        events = findEvents(components, event.target.getAttribute('data-reactid'), eventFn);

                    events.forEach(function (eventFn) {
                        eventFn.apply(component);
                    });
                });
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var eventName = _step.value;

                    createEvent(eventName);
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

    };
})();

module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _events = require('./../helpers/Events.js');

var _events2 = _interopRequireWildcard(_events);

var _css = require('./../helpers/Stylesheets.js');

var _css2 = _interopRequireWildcard(_css);

exports['default'] = (function main($document) {

    'use strict';

    return {

        /**
         * @method delegate
         * @param {Array} modules
         * @return {void}
         */
        register: function register() {
            for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
                modules[_key] = arguments[_key];
            }

            modules.forEach(function (name) {

                var elementName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
                    prototype = Object.create(HTMLElement.prototype, {

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
                            var _this = this;

                            this.innerHTML = '';

                            // Todo: Make all of this dynamic!
                            var path = 'app/components/user-calendar';

                            System['import']('' + path + '/calendar').then(function (Component) {

                                var element = React.createElement(Component['default']),
                                    contentElement = $document.createElement('content'),
                                    shadowRoot = _this.createShadowRoot();

                                _css2['default'].associate(path, shadowRoot);
                                shadowRoot.appendChild(contentElement);

                                var component = React.render(element, contentElement);
                                _events2['default'].delegate(contentElement, component);
                            });
                        }

                    }

                });

                $document.registerElement(elementName, {
                    prototype: prototype
                });
            });
        }

    };
})(document);

module.exports = exports['default'];

},{"./../helpers/Events.js":3,"./../helpers/Stylesheets.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = (function main($document) {

    'use strict';

    return {

        /**
         * @property linkSelector
         * @type {String}
         */
        linkSelector: 'link[type="text/css"]',

        /**
         * @method toArray
         * @param {*} arrayLike
         * @return {Array}
         */
        toArray: function toArray(arrayLike) {
            return Array.prototype.slice.apply(arrayLike);
        },

        /**
         * @method associate
         * @param {String} componentPath
         * @param {ShadowRoot} shadowRoot
         * @return {void}
         */
        associate: function associate(componentPath, shadowRoot) {
            var _this = this;

            this.toArray(document.querySelectorAll('link')).forEach(function (link) {

                var href = link.getAttribute('href');

                if (href.match(componentPath)) {

                    var templateElement = link['import'].querySelector('template'),
                        templateContent = templateElement.content,
                        cssDocuments = _this.toArray(templateContent.querySelectorAll('link')).map(function (linkElement) {
                        return '' + componentPath + '/' + linkElement.getAttribute('href');
                    });

                    cssDocuments.forEach(function (cssDocument) {

                        var styleElement = $document.createElement('style');
                        styleElement.setAttribute('type', 'text/css');
                        styleElement.innerHTML = '@import url(' + cssDocument + ')';
                        shadowRoot.appendChild(styleElement);
                    });
                }
            });
        }

    };
})(document);

module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvTWFwbGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvY29tcG9uZW50cy9Db21wb25lbnQuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9FdmVudHMuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9NYXBsZS5qcy9zcmMvaGVscGVycy9Nb2R1bGFyLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvTWFwbGUuanMvc3JjL2hlbHBlcnMvU3R5bGVzaGVldHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt5QkNBc0IsMkJBQTJCOzs7O3VCQUMzQixzQkFBc0I7Ozs7QUFFNUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFO1FBRXpCLEtBQUs7Ozs7Ozs7QUFPSSxhQVBULEtBQUssR0FPaUI7MENBQVQsT0FBTztBQUFQLG1CQUFPOzs7OEJBUHBCLEtBQUs7O0FBU0gsNkJBQVEsUUFBUSxNQUFBLDBDQUFJLE9BQU8sRUFBQyxDQUFDO0tBRWhDOztBQUlMLFdBQU8sQ0FBQyxLQUFLLEdBQWEsS0FBSyxDQUFDO0FBQ2hDLFdBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyx5QkFBWSxDQUFDO0NBRXZDLENBQUEsQ0FBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2pCQSxTQUFTLFlBQVQsU0FBUzt3QkFBVCxTQUFTOzs7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OztBQVFELGlCQUFTLEVBQUEsbUJBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRTs7O0FBRWpDLGdCQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSzs7QUFFOUQsb0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXJDLG9CQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUU7O0FBRTNCLHdCQUFJLGVBQWUsR0FBRyxJQUFJLFVBQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO3dCQUN2RCxlQUFlLEdBQUcsZUFBZSxDQUFDLE9BQU87d0JBQ3pDLFlBQVksR0FBTSxNQUFLLE9BQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxXQUFXLEVBQUs7QUFDMUYsb0NBQVUsYUFBYSxTQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUc7cUJBQ2pFLENBQUMsQ0FBQzs7QUFFUCxnQ0FBWSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFdBQVcsRUFBSzs7QUFFbEMsNEJBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEQsb0NBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzlDLG9DQUFZLENBQUMsU0FBUyxvQkFBa0IsV0FBVyxNQUFHLENBQUM7QUFDdkQsa0NBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBRXhDLENBQUMsQ0FBQztpQkFFTjthQUVKLENBQUMsQ0FBQztTQUVOOztLQUVKLENBQUM7Q0FFTCxDQUFBLENBQUUsUUFBUSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgbW9kdWxhciAgIGZyb20gJy4vaGVscGVycy9Nb2R1bGFyLmpzJztcblxuKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG5cbiAgICBjbGFzcyBNYXBsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2R1bGVzXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciguLi5tb2R1bGVzKSB7XG5cbiAgICAgICAgICAgIG1vZHVsYXIucmVnaXN0ZXIoLi4ubW9kdWxlcyk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgJHdpbmRvdy5NYXBsZSAgICAgICAgICAgPSBNYXBsZTtcbiAgICAkd2luZG93Lk1hcGxlLkNvbXBvbmVudCA9IENvbXBvbmVudDtcblxufSkod2luZG93LCBkb2N1bWVudCk7XG5cbi8vKGZ1bmN0aW9uIG1haW4oJHdpbmRvdywgJGRvY3VtZW50KSB7XG4vL1xuLy8gICAgXCJ1c2Ugc3RyaWN0XCI7XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBAbW9kdWxlIE1hcGxlXG4vLyAgICAgKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuLy8gICAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuLy8gICAgICovXG4vLyAgICBjbGFzcyBNYXBsZSB7XG4vL1xuLy8gICAgICAgIC8qKlxuLy8gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuLy8gICAgICAgICAqIEByZXR1cm4ge01hcGxlfVxuLy8gICAgICAgICAqL1xuLy8gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuLy8gICAgICAgICAgICAvL3RoaXMuZWxlbWVudHMgPSBbXTtcbi8vICAgICAgICAgICAgLy90aGlzLkNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQoKTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIC8qKlxuLy8gICAgICAgICAqIEBtZXRob2QgdGhyb3dFeGNlcHRpb25cbi8vICAgICAgICAgKiBAdGhyb3dzIEVycm9yXG4vLyAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2Vcbi8vICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICAgICAqL1xuLy8gICAgICAgIHRocm93RXhjZXB0aW9uKG1lc3NhZ2UpIHtcbi8vICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXBsZS5qczogJHttZXNzYWdlfS5gKTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIC8qKlxuLy8gICAgICAgICAqIEBtZXRob2QgY29tcG9uZW50XG4vLyAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbi8vICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYmx1ZXByaW50XG4vLyAgICAgICAgICogQHJldHVybiB7dm9pZH1cbi8vICAgICAgICAgKi9cbi8vICAgICAgICBjb21wb25lbnQobmFtZSwgYmx1ZXByaW50KSB7XG4vL1xuLy8gICAgICAgICAgICBsZXQgZWxlbWVudCAgICAgICAgID0gUmVhY3QuY3JlYXRlQ2xhc3MoYmx1ZXByaW50KTtcbi8vICAgICAgICAgICAgdGhpcy5lbGVtZW50c1tuYW1lXSA9IHRoaXMuY3JlYXRlRWxlbWVudChuYW1lLCBSZWFjdC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpKTtcbi8vXG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICAvKipcbi8vICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUVsZW1lbnRcbi8vICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuLy8gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4vLyAgICAgICAgICogQHJldHVybiB7dm9pZH1cbi8vICAgICAgICAgKi9cbi8vICAgICAgICBjcmVhdGVFbGVtZW50KG5hbWUsIGVsZW1lbnQpIHtcbi8vXG4vLyAgICAgICAgICAgIGxldCBvd25lckRvY3VtZW50ICAgID0gJGRvY3VtZW50LmN1cnJlbnRTY3JpcHQub3duZXJEb2N1bWVudCxcbi8vICAgICAgICAgICAgICAgIGVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuLy9cbi8vICAgICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgICAgICogQHByb3BlcnR5IGNyZWF0ZWRDYWxsYmFja1xuLy8gICAgICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbi8vICAgICAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgICAgICAgICAqIEBtZXRob2QgdmFsdWVcbi8vICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICAgICAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29udGVudEVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBjc3MuYXNzb2NpYXRlKG93bmVyRG9jdW1lbnQsIHNoYWRvd1Jvb3QpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKGNvbnRlbnRFbGVtZW50KTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIoZWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMuZGVsZWdhdGUoY29udGVudEVsZW1lbnQsIGNvbXBvbmVudCk7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBAcHJvcGVydHkgTWVnYUJ1dHRvblxuLy8gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgJGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7XG4vLyAgICAgICAgICAgICAgICBwcm90b3R5cGU6IGVsZW1lbnRQcm90b3R5cGVcbi8vICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICB9XG4vL1xuLy8gICAgJHdpbmRvdy5NYXBsZSAgICAgICAgICAgPSBuZXcgTWFwbGUoKTtcbi8vICAgICR3aW5kb3cuTWFwbGUuQ29tcG9uZW50ID0gbmV3IENvbXBvbmVudCgpO1xuLy9cbi8vfSkod2luZG93LCBkb2N1bWVudCk7IiwiLyoqXG4gKiBAbW9kdWxlIE1hcGxlXG4gKiBAc3VibW9kdWxlIENvbXBvbmVudFxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9NYXBsZS5qc1xuICogQGF1dGhvciBBZGFtIFRpbWJlcmxha2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxufSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGRlbGVnYXRlXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRFbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7UmVhY3RDbGFzcy5jcmVhdGVDbGFzcy5Db25zdHJ1Y3Rvcn0gY29tcG9uZW50XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBkZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgY29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBhRWxlbWVudCAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxuICAgICAgICAgICAgICAgIGV2ZW50cyAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICBldmVudEVzcXVlID0gL29uW2Etel0rL2k7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFFbGVtZW50KS5mb3JFYWNoKChrZXkpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2goZXZlbnRFc3F1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goa2V5LnJlcGxhY2UoL15vbi8sICcnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEV2ZW50XG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xuICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RXZlbnQoZXZlbnROYW1lLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hOYW1lID0gbmV3IFJlZ0V4cChldmVudE5hbWUsICdpJyksXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gICA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wZXJ0eSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5tYXRjaChtYXRjaE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50Rm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGZpbmRFdmVudHNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVhY3RJZFxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRFdmVudHMobm9kZSwgcmVhY3RJZCwgZXZlbnROYW1lKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRzICAgICAgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdEV2ZW50Rm4gPSBnZXRFdmVudChldmVudE5hbWUsIG5vZGUuX2N1cnJlbnRFbGVtZW50Ll9zdG9yZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocm9vdEV2ZW50Rm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb3VuZCBldmVudCBpbiByb290IVxuICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaChyb290RXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fcm9vdE5vZGVJRCA9PT0gcmVhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX3JlbmRlcmVkQ2hpbGRyZW47XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpZCBpbiBjaGlsZHJlbikge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBjaGlsZHJlbltpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yb290Tm9kZUlEID09PSByZWFjdElkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRFdmVudEZuID0gZ2V0RXZlbnQoZXZlbnROYW1lLCBpdGVtLl9pbnN0YW5jZS5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRFdmVudEZuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgZXZlbnQgaW4gY2hpbGRyZW4hXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKGNoaWxkRXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9yZW5kZXJlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRFdmVudHMoaXRlbSwgcmVhY3RJZCwgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUV2ZW50XG4gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVFdmVudChldmVudE5hbWUpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50cyA9IGNvbXBvbmVudC5fcmVhY3RJbnRlcm5hbEluc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudC5fcmVuZGVyZWRDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEZuICAgID0gYG9uJHtldmVudC50eXBlfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMgICAgID0gZmluZEV2ZW50cyhjb21wb25lbnRzLCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKSwgZXZlbnRGbik7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50Rm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4uYXBwbHkoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudE5hbWUgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG59KSgpOyIsImltcG9ydCBldmVudHMgIGZyb20gJy4vLi4vaGVscGVycy9FdmVudHMuanMnO1xuaW1wb3J0IGNzcyAgICAgZnJvbSAnLi8uLi9oZWxwZXJzL1N0eWxlc2hlZXRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIG1haW4oJGRvY3VtZW50KSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgZGVsZWdhdGVcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gbW9kdWxlc1xuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVnaXN0ZXIoLi4ubW9kdWxlcykge1xuXG4gICAgICAgICAgICBtb2R1bGVzLmZvckVhY2goKG5hbWUpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50TmFtZSAgID0gbmFtZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICBwcm90b3R5cGUgICAgID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQHByb3BlcnR5IGNyZWF0ZWRDYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogQG1ldGhvZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvZG86IE1ha2UgYWxsIG9mIHRoaXMgZHluYW1pYyFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9ICdhcHAvY29tcG9uZW50cy91c2VyLWNhbGVuZGFyJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN5c3RlbS5pbXBvcnQoYCR7cGF0aH0vY2FsZW5kYXJgKS50aGVuKChDb21wb25lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCAgICAgICAgPSBSZWFjdC5jcmVhdGVFbGVtZW50KENvbXBvbmVudC5kZWZhdWx0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QgICAgID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzLmFzc29jaWF0ZShwYXRoLCBzaGFkb3dSb290KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChjb250ZW50RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IFJlYWN0LnJlbmRlcihlbGVtZW50LCBjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5kZWxlZ2F0ZShjb250ZW50RWxlbWVudCwgY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnROYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZTogcHJvdG90eXBlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gbWFpbigkZG9jdW1lbnQpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGxpbmtTZWxlY3RvclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGlua1NlbGVjdG9yOiAnbGlua1t0eXBlPVwidGV4dC9jc3NcIl0nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheUxpa2VcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5KGFycmF5TGlrZSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheUxpa2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIGFzc29jaWF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50UGF0aFxuICAgICAgICAgKiBAcGFyYW0ge1NoYWRvd1Jvb3R9IHNoYWRvd1Jvb3RcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGFzc29jaWF0ZShjb21wb25lbnRQYXRoLCBzaGFkb3dSb290KSB7XG5cbiAgICAgICAgICAgIHRoaXMudG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rJykpLmZvckVhY2goKGxpbmspID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBocmVmID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgIGlmIChocmVmLm1hdGNoKGNvbXBvbmVudFBhdGgpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlRWxlbWVudCA9IGxpbmsuaW1wb3J0LnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZUVsZW1lbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cyAgICA9IHRoaXMudG9BcnJheSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGluaycpKS5tYXAoKGxpbmtFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2NvbXBvbmVudFBhdGh9LyR7bGlua0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzc0RvY3VtZW50cy5mb3JFYWNoKChjc3NEb2N1bWVudCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVFbGVtZW50ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gYEBpbXBvcnQgdXJsKCR7Y3NzRG9jdW1lbnR9KWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pKGRvY3VtZW50KTsiXX0=
