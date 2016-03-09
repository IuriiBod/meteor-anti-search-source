Template.menuDetailPerformance.onCreated(function () {
  this.analyzedItem = () => HospoHero.analyze.menuItem(this.data);
  this.getTotalQuantityByDate = (date) => {
    let totalQuantitySales = 0;
    DailySales.find({date: date}).forEach((item) => {
      totalQuantitySales += item.actualQuantity;
    });
    return HospoHero.misc.rounding(this.analyzedItem().contribution * totalQuantitySales);
  };

  this.date = {
    yesterdayDate: moment().subtract(1, 'days'),
    weekAgoDate: moment(this.yesterdayDate).subtract(8, 'days'),
    beforeLastWeekDate: moment(this.yesterdayDate).subtract(15, 'days'),
    interval: (startDate, endDate) => TimeRangeQueryBuilder.forInterval(startDate, endDate)
  };
});

Template.menuDetailPerformance.onRendered(function () {
  var onPriceEditSuccess = (response, newValue) => {
    var menuItem = MenuItems.findOne({_id: this.data._id});
    menuItem.salesPrice = parseFloat(newValue);
    Meteor.call("editMenuItem", menuItem, HospoHero.handleMethodResult());
  };

  $('.edit-item-price').editable({
    type: "text",
    title: 'Edit sale price',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: onPriceEditSuccess
  });
});

Template.menuDetailPerformance.helpers({
  menuItemStats() {
    let instance = Template.instance();
    let analyzedItem = instance.analyzedItem();
    let dateInterval = instance.date.interval(instance.date.weekAgoDate, instance.date.yesterdayDate);

    return {
      ingCost: `- $ ${analyzedItem.ingCost}`,
      prepCost: `- $ ${analyzedItem.prepCost}`,
      tax: `- $ ${analyzedItem.tax}`,
      contribution: `= $ ${analyzedItem.contribution}`,
      lastSevenDaysContribution: `$ ${instance.getTotalQuantityByDate(dateInterval)}`
    };
  },

  itemRank() {
    let weeklyRanks = this.weeklyRanks;
    if (weeklyRanks) {
      let lastSevenDaysRank = weeklyRanks[weeklyRanks.length - 1];
      let beforeLastWeekRank = weeklyRanks[weeklyRanks.length - 2];
      let changedPoints;

      if (beforeLastWeekRank > lastSevenDaysRank) {
        changedPoints = beforeLastWeekRank - lastSevenDaysRank;
      } else {
        changedPoints = lastSevenDaysRank - beforeLastWeekRank;
      }

      return {
        lastSevenDays: lastSevenDaysRank,
        changedPoints: changedPoints,
        up: beforeLastWeekRank > lastSevenDaysRank,
        notChanged: beforeLastWeekRank === lastSevenDaysRank
      };
    }
  },

  contribution() {
    let instance = Template.instance();
    let date = instance.date;
    let totalContributionBeforeLastWeek = instance.getTotalQuantityByDate(date.interval(date.beforeLastWeekDate, date.weekAgoDate));
    let totalContributionLastSevenDays = instance.getTotalQuantityByDate(date.interval(date.weekAgoDate, date.yesterdayDate));

    if (!totalContributionBeforeLastWeek || !totalContributionLastSevenDays) {
      return false;
    } else {
      let difference = (((totalContributionLastSevenDays * 100) / totalContributionBeforeLastWeek) - 100);
      return {
        up: difference > 0,
        notChanged: difference === 0,
        difference: `${HospoHero.misc.rounding(difference < 0 ? difference * (-1) : difference)} % `
      };
    }
  },

  performanceSettings() {
    let buttons = [];
    let checker = new HospoHero.security.PermissionChecker();

    if (checker.hasPermissionInArea(null, `edit menus`)) {
      let params = {
        category: 'all',
        rangeType: 'yesterday',
        startDate: HospoHero.dateUtils.shortDateFormat(moment().subtract(1, 'days'))
      };
      let menuItemRankLink = {
        url: Router.url('menuItemsRankReport', params),
        className: 'btn btn-xs btn-link',
        text: 'View Menu Rank Report'
      };
      buttons.push(menuItemRankLink);
    }

    return {
      namespace: 'menus',
      uiStateId: 'performance',
      title: 'Performance Snapshot',
      buttons: buttons
    };
  }
});