Meteor.methods({
  updateUIState: function (item) {
    let userId = Meteor.userId();
    if (userId) {
      let key = `profile.uiStates.${item.namespace}.${item.category}`;
      Meteor.users.update({
        _id: userId
      }, {
        $set: {
          [key]: item.state
        }
      });
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