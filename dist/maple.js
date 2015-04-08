$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function main($window) {
    "use strict";
    var Maple = function Maple() {};
    ($traceurRuntime.createClass)(Maple, {
      render: function(element, name) {
        this.registerElement(element, name);
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
