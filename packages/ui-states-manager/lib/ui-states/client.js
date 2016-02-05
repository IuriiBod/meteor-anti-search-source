UIStatesManager = function (category) {
  this.user = Meteor.user();
  this.category = category;
  var subscription = () => Meteor.subscribe('usersUIStates', this.user._id);

  subscription();
};

UIStatesManager.prototype.get = function (element) {
  if (this.user && this.user.profile.uiStates) {
    return this.user.profile.uiStates[this.category][element];
  } else {
    return false;
  }
};

UIStatesManager.prototype.set = function (element, state) {
  if (this.user) {
    var item = {
      category: this.category,
      element: element,
      state: state
    };

    Meteor.call('updateUiState', item, (err, res) => {
      console.log('res -> ', res);
      this.user = res;
    });
  }
};