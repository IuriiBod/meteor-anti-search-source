var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
  this.set("allMenuItemsLoaded", false);
  this.maxHistoryLength = 10;
  this.limitAdd = 10;
  this.clicks = 0;

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];
  this.MenuItemsSearch = new SearchSource('menuItemsSearch', fields, options);

});

component.prototype.newParamsToSearchData = function(dataHistory, text) {
  var text = text ? text : "";
  var count = dataHistory.length;
  var lastItem = dataHistory[count - 1]['name'];
  var category = Router.current().params.category;
  var filter = [];
  var selector = {
    "limit": count + this.limitAdd,
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

  return {
    text: text,
    selector: selector
  }
};

component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return HospoHero.dateUtils.getWeekDays(currentWeekDate);
};

component.state.menuItems = function () {
  var foundMenuItems = this.MenuItemsSearch.getData({
    transform: function (matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
  return foundMenuItems;
};

component.state.getSearchSource = function () {
  return this.MenuItemsSearch;
};

component.state.allItemsLoaded = function () {
  return this.get("allMenuItemsLoaded");
};

component.action.loadMoreBtnClick = function (text) {
  var search = this.MenuItemsSearch;
  var params = _.keys(search.history);
  this.clicks++;
  if (search.history && search.history[params]) {
    var dataHistory = search.history[params].data;
    if (dataHistory.length >= this.maxHistoryLength) {
      search.cleanHistory();
      var searchParams = this.newParamsToSearchData(dataHistory, text);
      search.search(searchParams.text, searchParams.selector);
    }
  }

  if ((this.clicks * this.limitAdd) > dataHistory.length) {
    this.set("allMenuItemsLoaded", true);
  }
};