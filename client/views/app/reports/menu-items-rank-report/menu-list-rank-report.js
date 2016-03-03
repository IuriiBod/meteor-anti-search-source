const ranges = [
  {
    value: 'yesterday',
    text: 'Yesterday'
  },
  {
    value: 'current-week',
    text: 'Current Week'
  },
  {
    value: 'last-week',
    text: 'Last Week'
  },
  {
    value: 'custom-range',
    text: 'Custom Date Range'
  }
];

Template.menuListRankReport.onCreated(function () {
  this.customRange = new ReactiveVar();
  this.customRange.set(this.data.rangeType === 'custom-range');

  const current = _.find(ranges, obj => {
    return this.data.rangeType === obj.value;
  });

  this.selectedRange = new ReactiveVar(current);

  this.getDaysOfWeek = function (daysOfWeek) {
    return {
      startDate: HospoHero.dateUtils.shortDateFormat(daysOfWeek[0]),
      endDate: HospoHero.dateUtils.shortDateFormat(daysOfWeek[daysOfWeek.length - 1])
    };
  };
});

Template.menuListRankReport.helpers({
  menuItems: function () {
    var rankedMenuItems = [];
    var category = this.selectedCategoryId;
    var index = 0;
    this.menuItems.forEach(function (item) {
      if (category === 'all' || item.category === category) {
        item.index = ++index;
        rankedMenuItems.push(item);
      }
    });
    return rankedMenuItems.length && rankedMenuItems;
  },

  theadItems: function () {
    return [
      'Item Name', 'Sparkline of Ranking', 'Ranking', '<b>Item Sales</b>', '<b>Item Price</b>',
      '<b>Total Sales</b>', '<b>Prep (Item)</b>', '<b>Total Prep</b>', '<b>Cost of Goods (Item)</b>', '<b>Total Cost of Goods</b>',
      '<b>Tax</b>', '<b>Profit (Item)</b>', '<b>Total Profit</b>'
    ];
  },

  customRangeSelected: function () {
    return Template.instance().customRange.get();
  },

  categories: function () {
    var categories = Categories.find({
      _id: {$ne: this.selectedCategoryId}
    }).fetch();

    if (this.selectedCategoryId !== 'all') {
      categories.push({name: 'All', _id: 'all'});
    }

    return categories;
  },

  selectedCategory: function () {
    if (this.selectedCategoryId !== 'all') {
      return Categories.findOne({_id: this.selectedCategoryId});
    } else {
      return {name: 'All', _id: 'all'};
    }
  },

  ranges: function () {
    return ranges;
  },

  selectedRange: function () {
    return Template.instance().selectedRange.get();
  }
});

Template.menuListRankReport.events({
  'click .date': function (event, tmpl) {
    event.preventDefault();

    tmpl.selectedRange.set(this);

    var rangeType = this.value;
    var date = moment();

    var params = {
      category: tmpl.data.selectedCategoryId,
      rangeType: rangeType
    };

    if (rangeType === 'yesterday') {
      _.extend(params, {
        startDate: HospoHero.dateUtils.shortDateFormat(date.subtract(1, 'days'))
      });
    } else if (rangeType === 'current-week') {
      var daysOfCurrentWeek = HospoHero.dateUtils.getWeekDays(date);

      _.extend(params, tmpl.getDaysOfWeek(daysOfCurrentWeek));
    } else if (rangeType === 'last-week') {
      var daysOfLastWeek = HospoHero.dateUtils.getWeekDays(date.subtract(7, 'days'));

      _.extend(params, tmpl.getDaysOfWeek(daysOfLastWeek));
    } else {
      tmpl.customRange.set(true);
    }

    Router.go('menuItemsRankReport', params);
  }
});