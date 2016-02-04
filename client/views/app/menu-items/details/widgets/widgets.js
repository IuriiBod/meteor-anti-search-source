Template.menuDetailPerformance.onRendered(function () {
  var self = this;
  var onPriceEditSuccess = function (response, newValue) {
    var menuItem = MenuItems.findOne({_id: self.data._id});
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
    let menu = this;
    let analyzedItem = HospoHero.analyze.menuItem(menu);
    return {
      ingCost: `- $ ${analyzedItem.ingCost}`,
      prepCost: `- $ ${analyzedItem.prepCost}`,
      tax: `- $ ${analyzedItem.tax}`,
      contribution: `= $ ${analyzedItem.contribution}`
    }
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
      }
    }
  },

  startDate() {
    return HospoHero.dateUtils.shortDateFormat(moment().subtract(1, 'days'));
  }
});