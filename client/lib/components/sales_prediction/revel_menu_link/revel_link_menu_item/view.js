Template.revelLinkMenuItem.onRendered(function () {

  var self = this;
  var onSuccess = function (response, newRevelName) {
    //unable to call flow-component's action here because of 'indy implementation'
    // so we will trigger custom action on template's view
    // more `indy code`!
    self.$('.edit-revel-name').trigger({
      type: 'update.revel.name',
      newRevelName: newRevelName
    });
  };

  this.$('.edit-revel-name').editable({
    type: "text",
    title: 'Edit Revel menu item name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'click',
    success: onSuccess
  });
});

Template.revelLinkMenuItem.events({
  'update.revel.name .edit-revel-name': function (event, tmpl) {
    FlowComponents.callAction('updateRevelName', event.newRevelName);
  }
});
