Template.revelLinkMenuItem.onRendered(function () {

});

Template.revelLinkMenuItem.events({
  'click .add-pos-name': function (e, tmpl){
    FlowComponents.callAction('addPosName');
  }
});
