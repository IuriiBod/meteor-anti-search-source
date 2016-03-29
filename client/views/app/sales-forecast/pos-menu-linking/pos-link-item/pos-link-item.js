Template.revelLinkMenuItem.onCreated(function () {
  this.set('attachPosName', false);
});

Template.revelLinkMenuItem.helpers({});

Template.revelLinkMenuItem.events({
  'click .add-pos-name': function (event, tmpl) {
    var attachPosName = tmpl.get('attachPosName');
    tmpl.set('attachPosName', !attachPosName);
  }
});