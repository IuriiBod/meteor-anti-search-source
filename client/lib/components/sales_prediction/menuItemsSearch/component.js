var component = FlowComponents.define("menuItemsSearch", function (props) {
  this.MenuItemsSearch = props.searchSource;
});

component.action.SearchSourceCleanHistory = function () {
  this.MenuItemsSearch.cleanHistory();
};

component.action.SearchSourceSearch = function (text) {
  this.MenuItemsSearch.search(text, getSelector());
};

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