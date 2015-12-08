console.log('hello client');

Blaze.TemplateInstance.prototype.__stateKeyByName = function (stateName) {
  return '_' + stateName;
};

Blaze.TemplateInstance.prototype.set = function (stateName, stateValue) {
  var stateInstance = this[this.__stateKeyByName(stateName)];
  if (!stateInstance) {
    this[this.__stateKeyByName(stateName)] = new ReactiveVar(stateValue);
  } else {
    stateInstance.set(stateValue);
  }
};


Blaze.TemplateInstance.prototype.get = function (stateName) {
  var stateInstance = this[this.__stateKeyByName(stateName)];
  return stateInstance && stateInstance.get();
};


//ugly hack from flow-components
var originalLookup = Blaze.View.prototype.lookup;

Blaze.View.prototype.lookup = function (name, options) {
  if (/^state\$/.test(name)) {
    var stateName = name.replace(/^state\$/, "");
    var templateInstance = this.templateInstance();
    var value = templateInstance.get(stateName);
    if (value) {
      return value;
    } else {
      return originalLookup.call(this, name, options);
    }
  }
  return originalLookup.call(this, name, options);
};
