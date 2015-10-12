var component = FlowComponents.define("stockCounting", function(props) {
  this.version = Session.get("thisVersion");
});

component.state.editable = function() {
  return Session.get("editStockTake");
};

component.state.ordersExist = function() {
  var ordersExist = Stocktakes.findOne({
    "version": Session.get("thisVersion"),
    "status": true
  });
  return !!ordersExist;
};

component.state.version = function() {
  return this.version;
};

component.state.specialArea = function() {
  return Session.get("activeSArea");
};

component.state.generalArea = function() {
  return Session.get("activeGArea");
};

component.state.stocktakeList = function() {
  var thisVersion = Session.get("thisVersion");
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");

  if(gareaId && sareaId) {
    var main = StocktakeMain.findOne(thisVersion);
    if(main && main.hasOwnProperty("orderReceipts") && main.orderReceipts.length > 0) {
      Meteor.subscribe("areaSpecificStockTakes", gareaId);
      var stocktakes = Stocktakes.find({"version": thisVersion, "generalArea": gareaId, "specialArea": sareaId}, {sort: {"place": 1}});
      if(stocktakes) {
        return stocktakes;
      }
    }
  }
};

component.state.ingredientsList = function() {
  var thisVersion = Session.get("thisVersion");
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");
  if(gareaId && sareaId) {
    Meteor.subscribe("areaSpecificStocks", gareaId);
    var sarea = SpecialAreas.findOne(sareaId);
    var ings = [];
    if(sarea && sarea.stocks.length > 0) {
      var ids = sarea.stocks;
      ids.forEach(function(id) {
        if(id) {
          var item = Ingredients.findOne({"_id": id, "status": "active"});
          if(item) {
            ings.push(item);
          }
        }
      });
      return ings;
    }
  }
};

component.state.stocktakeMain = function() {
  return StocktakeMain.findOne(this.version);
};

component.state.filtered = function() {
  return Session.get("activeSArea");
};

component.state.notTemplate = function() {
  var main = StocktakeMain.findOne(this.version);
  var permitted = false;
  if(main) {
    if(main.hasOwnProperty("orderReceipts") && main.orderReceipts.length > 0) {
      permitted = true;
    }
  }
  return permitted;
};