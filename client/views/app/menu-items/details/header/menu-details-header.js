Template.menuDetailsHeader.onCreated(function () {
  this.getMenuItemId = function () {
    return Router.current().params._id;
  };
});


Template.menuDetailsHeader.onRendered(function () {
  var self = this;
  $('.editMenuItemName').editable({
    type: "text",
    title: 'Edit menu name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function (response, newValue) {
      Meteor.call("editMenuItem", self.getMenuItemId(), {name: newValue}, HospoHero.handleMethodResult());
    }
  });
});


Template.menuDetailsHeader.helpers({
  isSubscribed: function () {
    return !!Subscriptions.findOne({
      type: 'menu',
      subscriber: Meteor.userId(),
      itemIds: Template.instance().getMenuItemId()
    });
  },

  isArchived: function () {
    var menu = MenuItems.findOne({_id: Template.instance().getMenuItemId()});
    return menu && menu.status == "archived";
  },

  onAreaSelected: function () {
    var menuItemId = Template.instance().getMenuItemId();
    return function (areaId) {
      Meteor.call("duplicateMenuItem", menuItemId, areaId, HospoHero.handleMethodResult(function () {
        HospoHero.success("Menu item has successfully copied!");
        $('#areaChooser').modal('hide');
      }));
    };
  }
});


Template.menuDetailsHeader.events({
  'click .subscribeButton': function (event, tmpl) {
    event.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('menu', this.get('id'));
    Meteor.call('subscribe', subscription, this.get('isSubscribed'), HospoHero.handleMethodResult());
  },

  'click .copyMenuItemBtn': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#areaChooser").modal("show");
  },

  'click .deleteMenuItemBtn': function (event, tmpl) {
    event.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if (result) {
      Meteor.call("deleteMenuItem", tmpl.getMenuItemId(), HospoHero.handleMethodResult(function () {
        Router.go("menuItemsMaster", {"category": "all", "status": "all"});
      }));
    }
  },

  'click .printMenuItemBtn': function (event, tmpl) {
    event.preventDefault();
    print();
  },

  'click .archiveMenuItemBtn': function (event, tmpl) {
    event.preventDefault();
    Meteor.call("archiveMenuItem", tmpl.getMenuItemId(), HospoHero.handleMethodResult(function (status) {
      HospoHero.info("Menu item " + status);
    }));
  }
});