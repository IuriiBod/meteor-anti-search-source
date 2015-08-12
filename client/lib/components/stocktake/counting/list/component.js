var component = FlowComponents.define("stockCounting", function(props) {
  this.version = Session.get("thisVersion");
});

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.state.ordersExist = function() {
  var ordersExist = Stocktakes.findOne({
    "version": Session.get("thisVersion"),
    "status": true
  });
  if(ordersExist) {
    return true;
  } else {
    return false;
  }
}

component.state.version = function() {
  return this.version;
}

component.state.specialArea = function() {
  return Session.get("activeSArea");
}


component.state.generalArea = function() {
  return Session.get("activeGArea");
}

component.state.list = function() {
  var thisVersion = Session.get("thisVersion");
  var editable = Session.get("editStockTake");
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");
  var resultData = {};

  if(editable) {
    var list = SpecialAreas.findOne({"_id": sareaId, "generalArea": gareaId});
    if(list) {
      resultData = list;
    }
  } else {
    var list = Stocktakes.find(
      {
        "generalArea": gareaId, 
        "specialArea": sareaId, 
        "version": thisVersion
      }, {
        sort: {"place": 1}
      });
    resultData['_id'] = sareaId;
    resultData['generalArea'] = gareaId;
    resultData['stocks'] = [];

    if(list.fetch().length > 0) {
      list.fetch().forEach(function(item) {
        if(resultData.stocks.indexOf(item.stockId) < 0) {
          resultData.stocks.push(item.stockId);
        }
      });
    }
  }
  if(resultData.stocks && resultData.stocks.length > 0) {
    subs.subscribe("ingredients", resultData.stocks);
  }
  return resultData;
}

component.state.stocktakeMain = function() {
  return StocktakeMain.findOne(this.version);
}

component.state.filtered = function() {
  return Session.get("activeSArea");
}