Template.totalValueDetails.onCreated(function () {
  Meteor.call('getStocktakeTotalValueDetails', this.data.stocktakeMainId);
});

Template.totalValueDetails.events({

});