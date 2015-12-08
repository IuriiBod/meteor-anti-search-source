console.log('hello client');

Blaze.TemplateInstance.prototype.__stateKeyByName = function (stateName) {
  return '_' + stateName;
};

Blaze.TemplateInstance.prototype.__addHelperForState = function (stateName) {
  var helperFn = (function () {
    return this.get(stateName);
  }).bind(this);

  this.view.template.__helpers.set('state$' + stateName, helperFn);
};


Blaze.TemplateInstance.prototype.set = function (stateName, stateValue) {
  var stateInstance = this[this.__stateKeyByName(stateName)];
  if (!stateInstance) {
    this[this.__stateKeyByName(stateName)] = new ReactiveVar(stateValue);

    //add register helper for new state
    this.__addHelperForState(stateName);
  } else {
    stateInstance.set(stateValue);
  }
};

Blaze.TemplateInstance.prototype.get = function (stateName) {
  var stateInstance = this[this.__stateKeyByName(stateName)];
  return stateInstance && stateInstance.get();
};
