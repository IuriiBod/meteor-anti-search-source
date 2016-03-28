Template.stocktakeHeader.events({
  'click .create-stocktake-button': function (event) {
    event.preventDefault();
    let localDateMoment = HospoHero.dateUtils.getDateMomentForLocation(new Date(), HospoHero.getCurrentArea().locationId);

    let existingStocktake = Stocktakes.findOne({
      date: localDateMoment.startOf('day')
    });

    if (existingStocktake) {
      HospoHero.error('Stocktake for today is already exists');
    } else {
      Meteor.call("createStocktake", HospoHero.handleMethodResult(function (newStocktakeId) {
        Router.go("stocktakeCounting", {_id: newStocktakeId});
      }));
    }
  }
});