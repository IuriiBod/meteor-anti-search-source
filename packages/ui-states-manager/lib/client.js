var UIStatesManager = function (namespace) {
  this._namespace = namespace;
  this._namespaceDependency = new Tracker.Dependency();
};


UIStatesManager.prototype._isAuthorized = function () {
  return !!Meteor.userId();
};


UIStatesManager.prototype.setState = function (stateName, stateValue) {
  if (this._isAuthorized()) {
    var item = {
      namespace: this._namespace,
      stateName: stateName,
      state: stateValue
    };

    var self = this;
    Meteor.call('updateUIState', item, function (err) {
      if (err) {
        console.log(err);
      } else {
        self._namespaceDependency.changed();
      }
    });
  }
};


UIStatesManager.prototype.getState = function (stateName, defaultValue) {
  this._namespaceDependency.depend();

  if (_.isUndefined(defaultValue)) {
    defaultValue = false; //default value for default value
  }

  if (!this._isAuthorized()) {
    return defaultValue;
  }

  var user = Meteor.user();
  var statePropertyExists = user &&
    user.profile.uiStates &&
    user.profile.uiStates[this._namespace] &&
    user.profile.uiStates[this._namespace].hasOwnProperty(stateName);

  var stateValue;

  if (statePropertyExists) {
    stateValue = user.profile.uiStates[this._namespace][stateName];
  } else {
    stateValue = defaultValue;
  }

  return stateValue;
};


UIStates = {
  getManagerFor: function (namespace) {
    return new UIStatesManager(namespace);
  }
};