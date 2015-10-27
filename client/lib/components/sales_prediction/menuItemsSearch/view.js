Template.menuItemsSearch.events({
  'keyup #searchMenuItems': function (event) {
    MenuItemsSearch.cleanHistory();
    var text = $("#searchMenuItems").val().trim();
    MenuItemsSearch.search(text, getSelector());
  }
});

Template.menuItemsSearch.onRendered(function () {
  MenuItemsSearch.cleanHistory();
  MenuItemsSearch.search("", getSelector());
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