$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var modular = System.get("internals/Modular.js").default;
  (function main($window) {
    "use strict";
    function Maple() {}
    Maple.prototype = {
      _modules: {},
      throwException: function throwException(message) {
        throw ("Maple: " + message + ".");
      },
      module: function module(name, dependencies) {
        if (Array.isArray(dependencies)) {
          this._modules[name] = modular.setup(name, dependencies);
        }
        if (!this._modules.hasOwnProperty(name)) {
          this.throwException(("Module \"" + name + "\" does not exist"));
        }
        return this._modules[name];
      }
    };
    $window.maple = new Maple();
  })(window);
  return {};
});

$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var $__default = {setup: function setup(name, dependencies) {
      return {
        name: name,
        dependencies: dependencies
      };
    }};
  return {get default() {
      return $__default;
    }};
});
