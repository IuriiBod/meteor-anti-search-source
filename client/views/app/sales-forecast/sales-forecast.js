Template.salesPredictionPage.onCreated(function () {
  //currentWeekDate -> this.data.date
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

  this.newParamsToSearchData = function (dataHistory, text) {
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

  this.loadMoreBtnClick = function (text) {
    var search = this.MenuItemsSearch;
    this.clicks++;
    if (search.history && search.history[text]) {
      var dataHistory = search.history[text].data;
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
});


Template.salesPredictionPage.helpers({
  formatDate: function (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  getDayOfWeek: function (date) {
    return moment(date).format('dddd');
  },
  week: function () {
    var currentWeekDate = this.get('currentWeekDate');
    return HospoHero.dateUtils.getWeekDays(currentWeekDate);
  },
  getSearchSource: function () {
    return Template.instance().MenuItemsSearch;
  },
  menuItems: function () {
    var foundMenuItems = Template.instance().MenuItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
    return foundMenuItems;
  },
  dailyWeatherForecast: function (date) {
    return WeatherForecast.findOne({date: TimeRangeQueryBuilder.forDay(date)});
  }
});


Template.salesPredictionPage.events({
  'click #loadMoreBtn': function (event, tmpl) {
    event.preventDefault();
    var text = $("#searchMenuItems").val().trim();
    tmpl.loadMoreBtnClick(text);
  }
});
