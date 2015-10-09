Template.newStocktakeModal.events({
  'click .createNewStocktake': function(event) {
    event.preventDefault();
    $("#newStocktakeModal").modal("hide")
    var date = moment().format("YYYY-MM-DD");
    Meteor.call("createMainStocktake", date, function(err, id) {
      if(err) {
        HospoHero.error(err);
      } else {
        Router.go("stocktakeCounting", {"_id": id});
      }
    });
  },

  'click .gotoExistingStocktake': function(event) {
    event.preventDefault();
    $("#newStocktakeModal").modal("hide");
    var date = moment().format("YYYY-MM-DD");
    date = new Date(date).getTime();
    var stocktakeLatest = StocktakeMain.findOne({"stocktakeDate": date}, {sort: {"date": -1}, limit: 1});
    if(stocktakeLatest) {
      Router.go("stocktakeCounting", {"_id": stocktakeLatest._id});
    }
  }
});