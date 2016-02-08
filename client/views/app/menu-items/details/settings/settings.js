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

  collapsed() {
    return this.uiStates.getUIState('settings');
  }
});

Template.menuItemSettings.events({
  'click .remove-image': function (event, tmpl) {
    var menuItem = MenuItems.findOne({_id: tmpl.data.item._id});
    menuItem.image = '';
    Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
  },

  'shown.bs.collapse #Settings': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('settings', true);
  }, 1000),

  'hidden.bs.collapse #Settings': _.throttle(function (event, tmpl) {
    tmpl.data.uiStates.setUIState('settings', false);
  }, 1000)
});


