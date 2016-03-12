Meteor.methods({
  updateUIState: function (item) {
    var userId = Meteor.userId();
    if (userId) {
      var key = "profile.uiStates." + item.namespace + "." + item.stateName;
      var query = {$set: {}};
      query.$set[key] = item.state;
      Meteor.users.update({_id: userId}, query);
    }
  }
});

Meteor.publish(null, function () {
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