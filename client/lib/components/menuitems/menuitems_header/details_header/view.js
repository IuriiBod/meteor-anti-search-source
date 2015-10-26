Template.menuDetailsHeader.events({
  'click .subscribeButton': function (event) {
    event.preventDefault();
    FlowComponents.callAction('subscribe');
  },

  'click .copyMenuItemBtn': function (event, tpl) {
    event.preventDefault();
    tpl.$("#areaChooser").modal("show");
  },

  'click .deleteMenuItemBtn': function (e) {
    e.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if (result) {
      FlowComponents.callAction('deleteMenuItem');
    }
  },

  'click .printMenuItemBtn': function (event) {
    event.preventDefault();
    print();
  },

  'click .archiveMenuItemBtn': function (e) {
    e.preventDefault();
    FlowComponents.callAction('archive');
  }
});

Template.menuDetailsHeader.onRendered(function() {
  $('.editMenuItemName').editable({
    type: "text",
    title: 'Edit menu name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    toggle: 'mouseenter',
    success: function (response, newValue) {
      Meteor.call("editMenuItem", Router.current().params._id, {name: newValue}, HospoHero.handleMethodResult());
    }
  });
});