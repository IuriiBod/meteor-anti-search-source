Template.menuListRankReport.onCreated(function () {
  this.customRange = new ReactiveVar(false);
});

Template.menuListRankReport.helpers({
  menuItems: function() {
    return MenuItems.find({}, {sort: {'menuItemStats.totalContribution': -1}}).map(function (item, index) {
      item.index = ++index;
      return item;
    });
  },

  theadItems: function () {
    return [
        'Item name', 'Sparkline of ranking', 'Ranking', 'Item Sales', 'Item Price',
        'Total Sales', 'Prep item', 'Prep total', 'Cost of goods item', 'Cost of goods total',
        'Tax', 'Profit item', 'Profit total'
    ]
  },

  customRangeSelected: function () {
    return Template.instance().customRange.get();
  }
});

Template.menuListRankReport.events({
  'change .date': function (event, tmpl) {
    event.preventDefault();

    var selectedValue = tmpl.$(event.target).val();
    var date = new Date();
    var params = {};

    if (selectedValue === 'yesterday') {
      params.date = HospoHero.dateUtils.shortDateFormat(moment(date).subtract(1, 'days'));
    } else if (selectedValue === 'this week') {
      var weekDays = HospoHero.dateUtils.getWeekDays(date);
      params.startDate = HospoHero.dateUtils.shortDateFormat(weekDays[0]);
      params.endDate = HospoHero.dateUtils.shortDateFormat(weekDays[weekDays.length - 1]);
    } else if (selectedValue === 'last week') {
      var lastWeekDays = HospoHero.dateUtils.getWeekDays(moment(date).subtract(8, 'days'));
      params.startDate = HospoHero.dateUtils.shortDateFormat(lastWeekDays[0]);
      params.endDate = HospoHero.dateUtils.shortDateFormat(lastWeekDays[lastWeekDays.length - 1]);
    } else {
      tmpl.customRange.set(true);
      return false;
    }

    if (params.startDate && params.endDate) {
      Router.go('menuItemsReportByDateRange', params);
    } else {
      Router.go('menuItemsReportByDate', params);
    }
  }
});