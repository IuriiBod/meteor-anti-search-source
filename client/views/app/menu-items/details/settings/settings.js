Template.menuItemSettings.helpers({
  currentCategory: function () {
    return Categories.findOne({_id: this.category});
  },

  categoryOptions: function () {
    return Categories.find().map(function (category) {
      return {
        value: category._id,
        text: category.name
      };
    });
  },

  statusOptions: function () {
    return HospoHero.misc.getMenuItemsStatuses(false).map(function (status) {
      return {
        value: status,
        text: status
      };
    });
  },

  getOnCategoryChanged: function () {
    var tmpl = Template.instance();
    return function (newCategory) {
      var menuItem = MenuItems.findOne({_id: tmpl.data._id});
      menuItem.category = newCategory;
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
    };
  },

  getOnStatusChanged: function () {
    var tmpl = Template.instance();
    return function (newStatus) {
      var menuItem = MenuItems.findOne({_id: tmpl.data._id});
      menuItem.status = newStatus;
      Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
    }
  },

  isArchived: function () {
    return this.status == "archived";
  }
});

Template.menuItemSettings.events({
  'click .remove-image': function (event, tmpl) {
    var menuItem = MenuItems.findOne({_id: tmpl.data._id});
    menuItem.image = '';
    Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
  }
});


