Template.menuDetailsHeader.onCreated(function () {
  this.getMenuItemId = function () {
    return HospoHero.getParamsFromRoute('_id');
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
    return menu && menu.status === "archived";
  }
});


Template.menuDetailsHeader.events({
  'click .subscribe-button': function (event, tmpl) {
    event.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('menu', tmpl.getMenuItemId());
    Meteor.call('subscribe', subscription, tmpl.isSubscribed(), HospoHero.handleMethodResult());
  },

  'click .unsubscribe-button': function (event, tmpl) {
    event.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('menu', tmpl.getMenuItemId());
    Meteor.call("unsubscribe", subscription, HospoHero.handleMethodResult());
  },

  'click .copy-item-modal-opener': function (event, tmpl) {
    event.preventDefault();

    var onAreaSelected = function () {
      var menuItemId = tmpl.getMenuItemId();
      var menuItem = MenuItems.findOne({_id: menuItemId});
      return function (areaId) {
        Meteor.call("duplicateMenuItem", menuItem, areaId, HospoHero.handleMethodResult(function () {
          HospoHero.success("Menu item has successfully copied!");
        }));
      };
    };
    ModalManager.open('areaChooser', {
      onAreaSelected: onAreaSelected()
    });
  },

  'click .delete-menu-item': function (event, tmpl) {
    event.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if (result) {
      var menuItem = MenuItems.findOne({_id: tmpl.getMenuItemId()});
      Meteor.call("deleteMenuItem", menuItem, HospoHero.handleMethodResult(function () {
        Router.go("menuItemsMaster", {category: 'all', status: 'all'});
      }));
    }
  },

  'click .print-menu-item': function (event) {
    event.preventDefault();
    print();
  },

  'click .archive-menu-item': function (event, tmpl) {
    event.preventDefault();
    var menuItem = MenuItems.findOne({_id: tmpl.getMenuItemId()});
    menuItem.status = menuItem.status === 'archived' ? 'active' : 'archived';
    Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult(function () {
      HospoHero.info("Menu item " + menuItem.status);
    }));
  }
});