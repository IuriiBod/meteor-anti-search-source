Template.newStocktakeModal.events({
  'click .createNewStocktake': function (event) {
    event.preventDefault();
    $("#newStocktakeModal").modal("hide");
    var date = moment().format("YYYY-MM-DD");
    Meteor.call("createMainStocktake", date, HospoHero.handleMethodResult(function (id) {
      Router.go("stocktakeCounting", {"_id": id});
    }));
  },

  'click .gotoExistingStocktake': function (event) {
    event.preventDefault();
    $("#newStocktakeModal").modal("hide");
    var date = moment().format("YYYY-MM-DD");
    date = new Date(date).getTime();
    var stocktakeLatest = StocktakeMain.findOne({"stocktakeDate": date}, {sort: {"date": -1}});
    if (stocktakeLatest) {
      Router.go("stocktakeCounting", {"_id": stocktakeLatest._id});
    }
  }
});