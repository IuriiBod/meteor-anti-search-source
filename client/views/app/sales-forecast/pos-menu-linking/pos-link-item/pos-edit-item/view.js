Template.posEditItem.onRendered(function () {
});

Template.posEditItem.events({
  'click .delete-pos-name': function (e, tmpl) {
    FlowComponents.callAction('deletePosName');
  }
});