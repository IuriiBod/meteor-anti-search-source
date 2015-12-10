Template.revelLinkMenuItem.onCreated(function () {
  this.set('attachPosName', false);
});

Template.revelLinkMenuItem.helpers({
});

Template.revelLinkMenuItem.events({
  'click .add-pos-name': function (e, tmpl) {
    var attachPosName = this.get('attachPosName');
    this.set('attachPosName', !attachPosName);
  }
});
