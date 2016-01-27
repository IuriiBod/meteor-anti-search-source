Template.menuListRankReport.onCreated(function () {
  this.customRange = new ReactiveVar();
  this.data.rangeType === 'custom-range' ? this.customRange.set(true) : this.customRange.set(false);

  this.getDaysOfWeek = function (daysOfWeek) {
    return  {
      startDate: HospoHero.dateUtils.shortDateFormat(daysOfWeek[0]),
      endDate: HospoHero.dateUtils.shortDateFormat(daysOfWeek[daysOfWeek.length - 1])
    }
  }
});

Template.menuListRankReport.onRendered(function () {
  this.$('.date').val(this.data.rangeType);
});

Template.menuListRankReport.helpers({
  menuItems: function() {
    var rankedMenuItems = [];
    var category = this.selectedCategoryId;
    var index = 0;
    MenuItems.find({stats: {$exists: true}}, {sort: {'stats.totalContribution': -1}}).forEach(function (item) {
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
    ]
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
    if (this.selectedCategoryId != 'all') {
      return Categories.findOne({_id: this.selectedCategoryId});
    } else {
      return {name: 'All', _id: 'all'};
    }
  }
});

Template.menuListRankReport.events({
  'change .date': function (event, tmpl) {
    event.preventDefault();

    var rangeType = tmpl.$(event.target).val();
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
      return false;
    }

    Router.go('menuItemsRankReport', params);
  }
});