Template.salesForecastMainView.onCreated(function () {
  //currentWeekDate -> this.data.date
  this.set("allMenuItemsLoaded", false);

  this.menuItemsSearchSource = this.AntiSearchSource({
    collection: 'menuItems',
    fields: ['name'],
    searchMode: 'local',
    limit: 10
  });

  var self = this;
  this.autorun(function () {
    var query = {
      status: 'active',
      'relations.areaId': HospoHero.getCurrentAreaId()
    };
    self.menuItemsSearchSource.setMongoQuery(query);
  });
  this.menuItemsSearchSource.search('');
});


Template.salesForecastMainView.helpers({
  formatDate: function (date) {
    return HospoHero.dateUtils.shortDateFormat(moment(date));
  },

  getDayOfWeek: function (date) {
    return moment(date).format('dddd');
  },

  week: function () {
    var data = Template.instance().data;
    return HospoHero.dateUtils.getWeekDays(data.date);
  },

  getSearchSource: function () {
    return Template.instance().menuItemsSearchSource;
  },

  menuItems: function () {
    return Template.instance().menuItemsSearchSource.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      },
      sort: {name: 1}
    });
  },

  dailyWeatherForecast: function () {
    return WeatherForecast.findOne({date: TimeRangeQueryBuilder.forDay(this)});
  }
});


Template.salesForecastMainView.events({
  'click #loadMoreBtn': function (event, tmpl) {
    event.preventDefault();
    tmpl.menuItemsSearchSource.incrementLimit();
  }
});
