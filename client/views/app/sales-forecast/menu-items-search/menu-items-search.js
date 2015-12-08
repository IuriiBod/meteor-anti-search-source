Template.menuItemsSearch.onCreated(function () {
  this.searchAndCleanHistory = function (text) {
    this.data.MenuItemsSearch.cleanHistory();
    this.data.MenuItemsSearch.search(text, getSelector());
  };
});


Template.menuItemsSearch.events({
  'keyup #searchMenuItems': function (event, tmpl) {
    var text = $("#searchMenuItems").val().trim();
    tmpl.searchAndCleanHistory(text);
  }
});


Template.menuItemsSearch.onRendered(function () {
  this.searchAndCleanHistory("");
});


var getSelector = function () {
  var category = Router.current().params.category;
  var selector = {
    limit: 10
  };
  var filter = [];
  if (category && category.toLowerCase() != "all") {
    filter.push({"category": category});
  }
  filter.push({
    "status": "active",
    "relations.areaId": HospoHero.getCurrentAreaId()
  });
  if (filter.length > 0) {
    selector.filter = filter;
  }
  return selector;
};

