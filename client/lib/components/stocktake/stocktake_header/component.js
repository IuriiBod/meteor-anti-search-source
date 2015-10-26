var component = FlowComponents.define('stocktakeHeader', function () {});

component.action.startStocktake = function () {
  var date = moment().format("YYYY-MM-DD");
  var stocktake = StocktakeMain.findOne({
    "stocktakeDate": new Date(date).getTime(),
    "relations.areaId": HospoHero.getCurrentAreaId()
  });

  if (stocktake) {
    $("#newStocktakeModal").modal();
  } else {
    Meteor.call("createMainStocktake", date, HospoHero.handleMethodResult(function (id) {
      Router.go("stocktakeCounting", {"_id": id});
    }));
  }
};