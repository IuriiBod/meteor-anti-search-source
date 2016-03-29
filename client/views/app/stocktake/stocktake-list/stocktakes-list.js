Template.stocktakesList.helpers({
  stocktakes: function () {
    return Stocktakes.find({}, {sort: {date: -1}});
  }
});
