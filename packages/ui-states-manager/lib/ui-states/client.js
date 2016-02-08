UIStatesManager = function (category) {
  this.user = Meteor.user();
  this.category = category;
  this.statesDep = new Tracker.Dependency;
  Meteor.subscribe('usersUIStates', this.user._id);
};

UIStatesManager.prototype.getUIState = function (element) {
  this.statesDep.depend();
  if (this.user && this.user.profile.uiStates) {
    return this.user.profile.uiStates[this.category][element];
  } else {
    return false;
  }
};

UIStatesManager.prototype.setUIState = function (component, state) {
  if (this.user) {
    var item = {
      category: this.category,
      component: component,
      state: state
    };

    Meteor.call('updateUiState', item, (err, res) => {
      this.user = res;
      this.statesDep.changed();
    });
  }
};