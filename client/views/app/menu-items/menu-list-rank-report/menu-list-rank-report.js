Template.menuListRankReport.onCreated(function () {
  this.customRange = new ReactiveVar();
  this.data.dateRange === 'custom-range' ? this.customRange.set(true) : this.customRange.set(false);
});

Template.menuListRankReport.onRendered(function () {
  this.$('.date').val(this.data.dateRange);
});

Template.menuListRankReport.helpers({
  menuItems: function() {
    return this.menuItems.map(function (item, index) {
      item.index = ++index;
      return item;
    });
  },

  theadItems: function () {
    return [
        'Item Name', 'Sparkline of Ranking', 'Ranking', '<b>Item Sales</b>', '<b>Item Price</b>',
        '<b>Total Sales</b>', '<b>Prep (Item)</b>', '<b>Total Prep</b>', '<b>Cost of Goods (Item)</b>', '<b>Total Cost of Goods</b>',
        '<b>Tax</b>', '<b>Profit (Item)</b>', '<b>Total Profit</b>'
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

    var params = {
      dateRange: selectedValue
    };

    if (selectedValue === 'yesterday') {
      _.extend(params, {
          startDate: HospoHero.dateUtils.shortDateFormat(moment(date).subtract(1, 'days'))
      });
    } else if (selectedValue === 'this-week') {
      var weekDays = HospoHero.dateUtils.getWeekDays(date);

      _.extend(params, {
        startDate: HospoHero.dateUtils.shortDateFormat(weekDays[0]),
        endDate: HospoHero.dateUtils.shortDateFormat(weekDays[weekDays.length - 1])
      });
    } else if (selectedValue === 'last-week') {
      var lastWeekDays = HospoHero.dateUtils.getWeekDays(moment(date).subtract(7, 'days'));

      _.extend(params, {
        startDate: HospoHero.dateUtils.shortDateFormat(lastWeekDays[0]),
        endDate: HospoHero.dateUtils.shortDateFormat(lastWeekDays[lastWeekDays.length - 1])
      });
    } else {
      tmpl.customRange.set(true);
      return false;
    }

    Router.go('menuItemsRankReport', params);
  }
});