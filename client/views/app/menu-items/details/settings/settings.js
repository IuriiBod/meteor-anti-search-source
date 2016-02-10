Template.menuItemSettings.helpers({
  currentCategory() {
    return Categories.findOne({_id: this.category});
  },

  categoryOptions() {
    return Categories.find().map(function (category) {
      return {
        value: category._id,
        text: category.name
      };
    });
  },

  statusOptions() {
    return HospoHero.misc.getMenuItemsStatuses(false).map(function (status) {
      return {
        value: status,
        text: status
      };
    });
  },

  getOnCategoryChanged() {
    var tmpl = Template.instance();
    return function (newCategory) {
      var menuItem = MenuItems.findOne({_id: tmpl.data.item._id});
      menuItem.category = newCategory;
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
    };
  },

  getOnStatusChanged() {
    var tmpl = Template.instance();
    return function (newStatus) {
      var menuItem = MenuItems.findOne({_id: tmpl.data.item._id});
      menuItem.status = newStatus;
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
    }
  },

  isArchived() {
    return this.item.status == "archived";
  },

  settingsOptions() {
    return {
      type: 'settings',
      name: 'Settings',
      contentPadding: 'no-padding'
    }
  }
});

Template.menuItemSettings.events({
  'click .remove-image': function (event, tmpl) {
    var menuItem = MenuItems.findOne({_id: tmpl.data.item._id});
    menuItem.image = '';
    Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
  }
});


