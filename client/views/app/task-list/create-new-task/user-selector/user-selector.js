Template.userSelector.helpers({
  settings: function () {
    return {
      position: 'bottom',
      limit: 10,
      rules: [{
        token: '@',
        collection: Meteor.users,
        field: 'username',
        filter: {
          _id: {$nin: [Meteor.userId()]},
          isActive: true
        },
        sort: true,
        template: Template.username,
        noMatchTemplate: Template.noMatchTemplate
      }]
    };
  }
});


Template.userSelector.events({
  'click .user-selector-toggler': function (event, tmpl) {
    event.preventDefault();
  }
});