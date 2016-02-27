Template.totalValueDetails.onCreated(function () {
  this.stocks = new ReactiveVar();
  Meteor.call('getStocktakeTotalValueDetails', this.data.stocktakeMainId, HospoHero.handleMethodResult((result) => {
    if (result) {
      this.stocks.set(result);
    }
  }));
});

Template.totalValueDetails.helpers({
  stocks() {
    return Template.instance().stocks.get();
  }
});