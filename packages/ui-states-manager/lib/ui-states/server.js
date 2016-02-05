Meteor.methods({
  updateUiState: function (item) {
    let userId = Meteor.userId();
    if (userId) {
      let key = `profile.uiStates.${item.category}.${item.element}`;
      Meteor.users.update({
        _id: userId
      }, {
        $set: {
          [key]: item.state
        }
      });
      return Meteor.users.findOne({_id: userId});
    }
  }
});

Meteor.publish('userUIStates', function(userId) {
  if (userId) {
    return Meteor.users.find({
      _id: userId
    }, {
      fields: {
        'profile.uiStates': 1
      }
    });
  }
});