var component = FlowComponents.define("stockCounting", function(props) {
  this.date = Session.get("thisDate");
});

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.state.list = function() {
  var thisDate = Session.get("thisDate");
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
        "date": thisDate
      }, {
        sort: {"order": 1}
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

component.state.date = function() {
  return this.date;
}

component.state.filtered = function() {
  return Session.get("activeSArea");
}