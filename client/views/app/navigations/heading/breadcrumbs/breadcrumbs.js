Template.breadcrumbs.onRendered(function () {
  if (this.data.type == 'menuDetails') {
    var menuId = HospoHero.getParamsFromRoute(Router.current(), '_id');
    this.$('.editMenuItemName').editable({
      type: "text",
      title: 'Edit menu name',
      showbuttons: true,
      display: false,
      mode: 'inline',
      success: function (response, newValue) {
        Meteor.call("editMenuItem", menuId, {name: newValue}, HospoHero.handleMethodResult());
      }
    });
  }
});

Template.breadcrumbs.helpers({
  isMenuDetailed: function () {
    return this.type == 'menuDetails';
  }
});

// TODO: Change this code
Template.breadcrumbs.events({
  'click .breadcrumbCategory': function (event) {
    event.preventDefault();
    var category = this.heading.category;
    if (category == "Jobs") {
      Router.go("jobItemsMaster");
    } else if (category == "Menus") {
      Router.go("menuItemsMaster", {category: 'all', status: 'all'});
    } else if (category == "Settings") {
      Router.go("dashboard");
    } else if (category == "Stocktake List") {
      Router.go("stocktakeList");
    } else if (category == "Stocktake") {
      Router.go("orderReceiptsList");
    } else if (category == "Stocks") {
      Router.go("suppliersList");
    }
  },

  'click .breadcrumbSubCategory': function (event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    var id = $(event.target).attr("data-id");
    if (category == "Jobs") {
      Router.go("jobItemDetailed", {"_id": id});
    } else if (category == "Menus") {
      Router.go("menuItemDetail", {"_id": id});
    }
  }
});