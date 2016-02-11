Meteor.methods({
  updateUIState: function (item) {
    let userId = Meteor.userId();
    if (userId) {
      let key = `profile.uiStates.${item.namespace}.${item.uiStateId}`;
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

Meteor.publish(null, function() {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        'profile.uiStates': 1
      }
    });
  }
});