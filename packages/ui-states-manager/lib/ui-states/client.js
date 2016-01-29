UIStatesManager = function (category) {
  this.userId = Meteor.userId();
  this.category = category;
};

UIStatesManager.prototype.get = function (element) {
  var user = Meteor.users.findOne({_id: this.userId});
  return user.profile.uiStates[this.category][element];
};

UIStatesManager.prototype.set = function (element, state) {
  if (this.userId) {
    var item = {
      category: this.category,
      element: element,
      state: state
    };

    Meteor.call('updateUiState', item);
  }
};