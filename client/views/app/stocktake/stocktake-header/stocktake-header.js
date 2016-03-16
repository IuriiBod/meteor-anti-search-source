Template.stocktakeHeader.events({
  'click #startNewStocktake': function (event, tmpl) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    var stocktake = Stocktakes.findOne({
      date: new Date(date).getTime()
    });

    if (stocktake) {
      tmpl.newStocktakeModal = ModalManager.open("newStocktakeModal");
    } else {
      Meteor.call("createMainStocktake", date, HospoHero.handleMethodResult(function (id) {
        Router.go("stocktakeCounting", {"_id": id});
      }));
    }
  }
});