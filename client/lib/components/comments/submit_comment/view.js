Template.submitComment.events({
  'keypress .message-input': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var text = $(".message-input").val().trim();
      if(text) {
        FlowComponents.callAction('submit', text);
      }
    }
  }
});

Template.submitComment.helpers({
  settings: function() {
    var data = {
      position: "top",
      limit: 10,
      rules: [
        {
          token: '@',
          collection: Meteor.users,
          field: "username",
          filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
          template: Template.username
        },
        {
          token: '@',
          collection: Meteor.users,
          field: "profile.lastname",
          filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
          template: Template.lastname
        }
      ]
    };
    return data;
  }
});

Template.submitComment.rendered = function() {
  $(".message-input").val("");
}