var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);

  this.defaultMenuItemsQuantityLimit = 10;
  this.set('menuItemsQuantityLimit', this.defaultMenuItemsQuantityLimit);
  this.set('areAllItemsLoaded', false);

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];
  this.MenuItemsSearch = new SearchSource('menuItemsSearch', fields, options);

});

component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return HospoHero.dateUtils.getWeekDays(currentWeekDate);
};

component.action.getData = function () {
  return this.MenuItemsSearch.getData({
    transform: function (matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
};

component.state.getSearchSource = function () {
  return this.MenuItemsSearch;
};

component.action.loadMoreBtnClick = function (text) {
  var maxHistoryLength = 9;
  var limitAdd = 10;
  var search = this.MenuItemsSearch;
  if (search.history && search.history[text]) {
    var dataHistory = search.history[text].data;
    if (dataHistory.length >= maxHistoryLength) {
      search.cleanHistory();
      var count = dataHistory.length;
      var lastItem = dataHistory[count - 1]['name'];
      var category = Router.current().params.category;
      var filter = [];
      var selector = {
        "limit": count + limitAdd,
        "endingAt": lastItem
      };
      filter.push({
        "status": "active",
        "relations.areaId": HospoHero.getCurrentAreaId()
      });
      if (category && category.toLowerCase() != "all") {
        filter.push({"category": category});
      }
      selector.filter = filter;
      search.search(text, selector);
      if ((count + limitAdd) >= MenuItems.find().count()) {
        $("#loadMoreBtn").addClass("hide");
      }
    }
  }
};