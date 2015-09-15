Template.textArea.helpers({
  settings: function() {
    var data = {
      position: "bottom",
      limit: 10,
      rules: [{
        token: '@',
        collection: Meteor.users,
        field: "username",
        filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
        sort: true,
        matchAll: true,
        template: Template.username
      }]
    };
    return data;
  }
});

Template.textArea.events({
  'keypress .message-input-post': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var text = $(event.target).val();
      if(text) {
        FlowComponents.callAction('submit', text);
      }
    }
  }
});

Template.textArea.rendered = function(){
  $(".message-input-post").val("");
};