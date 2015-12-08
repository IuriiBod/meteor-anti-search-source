Template.breadcrumbs.onCreated(function () {
});

Template.breadcrumbs.helpers({
  isMenuDetailed: function () {
    return this.type == 'menudetailed';
  }
});

// TODO: Change this code
Template.breadcrumbs.events({
  'click .breadcrumbCategory': function (event) {
    event.preventDefault();
    var category = $(event.target).attr("data-category");
    if (category == "Jobs") {
      Router.go("jobItemsMaster");
    } else if (category == "Menus") {
      Router.go("menuItemsMaster", {"category": Session.get("category"), "status": Session.get("status")});
    } else if (category == "Settings") {
      Router.go("home");
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