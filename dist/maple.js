$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function main($window) {
    "use strict";
    var Maple = function Maple() {
      this.elements = [];
    };
    ($traceurRuntime.createClass)(Maple, {
      throwException: function(message) {
        throw new Error(("Maple.js: " + message + "."));
      },
      render: function(element, name) {
        if (this.elements[name] !== 'undefined') {
          throw new Error(("Custom element " + name + " already exists"));
        }
        this.elements[name] = this.registerElement(element, name);
      },
      registerElement: function(element, name) {
        var elementPrototype = Object.create(HTMLElement.prototype, {createdCallback: {value: function value() {
              this.innerHTML = '';
              var contentElement = document.createElement('content'),
                  shadowRoot = this.createShadowRoot();
              shadowRoot.appendChild(contentElement);
              React.render(element, contentElement);
            }}});
        document.registerElement(name, {prototype: elementPrototype});
      }
    }, {});
    $window.maple = new Maple();
  })(window);
  return {};
});
