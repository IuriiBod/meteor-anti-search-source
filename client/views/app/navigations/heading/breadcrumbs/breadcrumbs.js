Template.breadcrumbs.onRendered(function () {
  if (this.data.type === 'menuDetails') {
    var menuId = HospoHero.getParamsFromRoute('_id');
    this.$('.editMenuItemName').editable({
      type: "text",
      title: 'Edit menu name',
      showbuttons: true,
      display: false,
      mode: 'inline',
      success: function (response, newValue) {
        var menuItem = MenuItems.findOne({_id: menuId});
        menuItem.name = newValue;
        Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
      }
    });
  }
});

Template.breadcrumbs.helpers({
  isMenuDetailed: function () {
    return this.type === 'menuDetails';
  }
});

Template.breadcrumbs.events({
  'click .breadcrumbCategory': function (event) {
    event.preventDefault();

    let category = this.heading.category;
    let categories = {
      Jobs: 'jobItemsMaster',
      Menus: {
        name: 'menuItemsMaster',
        params: {category: 'all', status: 'all'}
      },
      'Stocktake List': 'stocktakeList',
      Stocktake: 'orderReceiptsList',
      Stocks: 'suppliersList',
      Meetings: 'meetings',
      Projects: 'projectsList',
      Interviews: 'interviews'
    };

    let route = _.has(categories, category) && categories[category];

    if (route) {
      if (_.isString(route)) {
        Router.go(route);
      } else if (_.isObject(route)) {
        Router.go(route.name, route.params);
      } else {
        return false;
      }
    }
  },

  'click .breadcrumbSubCategory': function (event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    var id = $(event.target).attr("data-id");
    if (category === "Jobs") {
      Router.go("jobItemDetailed", {"_id": id});
    } else if (category === "Menus") {
      Router.go("menuItemDetail", {"_id": id});
    }
  }
});