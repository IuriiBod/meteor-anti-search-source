Template.menuDetailsHeader.onCreated(function () {
  this.getMenuItemId = function () {
    return Router.current().params._id;
  };

  this.isSubscribed = function () {
    return !!Subscriptions.findOne({
      type: 'menu',
      subscriber: Meteor.userId(),
      itemIds: this.getMenuItemId()
    });
  };
});

Template.menuDetailsHeader.helpers({
  isSubscribed: function () {
    return Template.instance().isSubscribed();
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
    var subscription = HospoHero.misc.getSubscriptionDocument('menu', tmpl.getMenuItemId());
    Meteor.call('subscribe', subscription, tmpl.isSubscribed(), HospoHero.handleMethodResult());
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
        Router.go("menuItemsMaster", {category: 'all', status: 'all'});
      }));
    }
  },

  'click .printMenuItemBtn': function (event) {
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