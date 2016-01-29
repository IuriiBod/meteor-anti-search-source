Meteor.methods({
  updateUiState: function (item) {
    if (Meteor.userId()) {
      let key = `profile.uiStates.${item.category}.${item.element}`;
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          [key]: item.state
        }
      });
    }
  }
});