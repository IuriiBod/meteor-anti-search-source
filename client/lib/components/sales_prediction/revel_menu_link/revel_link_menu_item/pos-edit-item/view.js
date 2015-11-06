Template.posEditItem.onRendered(function () {

  var self = this;
  var onSuccess = function (response, newPosName) {
    //unable to call flow-component's action here because of 'indy implementation'
    // so we will trigger custom action on template's view
    // more `indy code`!
    self.$('.edit-pos-name').trigger({
      type: 'update.pos.name',
      newPosName: newPosName
    });
  };

  this.$('.edit-pos-name').editable({
    type: "text",
    title: 'Edit pos menu item name',
    showbuttons: true,
    display: false,
    mode: 'popup',
    toggle: 'click',
    success: onSuccess
  });

});

Template.posEditItem.events({
  'update.pos.name .edit-pos-name': function (event, tmpl) {
    FlowComponents.callAction('updatePosName', event.newPosName);
  },
  'click .delete-pos-name': function(e, tmpl){
    FlowComponents.callAction('deletePosName');
  }
});