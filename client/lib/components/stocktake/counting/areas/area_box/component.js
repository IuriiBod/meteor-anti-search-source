var component = FlowComponents.define("areaBox", function(props) {
  this.item = props.item;
  this.class = props.class;
  this.name = props.name;
});

component.state.item = function() {
  var area = this.item;
  area.class = this.class;
  area.type = this.name;
  return area;
};

component.state.editable = function() {
  return Session.get("editStockTake");
};

component.state.widthofBar = function() {
  var id = this.item._id;
  var stocktakes;
  if(this.class == "sarea-filter") {
    var sProgress = 0;
    var specialArea = SpecialAreas.findOne(id);
    stocktakes = Stocktakes.find({"version": Session.get("thisVersion"), "specialArea": id, 'generalArea': Session.get("activeGArea")}).fetch();
    if(specialArea && specialArea.stocks) {
      if(specialArea.stocks.length > 0 && stocktakes.length > 0) {
        sProgress = (stocktakes.length/specialArea.stocks.length) * 100;
      }
    }
    return (sProgress + "%");
  } else if(this.class == "garea-filter") {
    var gProgress = 0;
    var totalCount = 0;
    var generalArea = GeneralAreas.findOne(id);
    if(generalArea) {
      var specialAreas = SpecialAreas.find({"generalArea": id}).fetch();
      if(specialAreas && specialAreas.length > 0) {
        specialAreas.forEach(function(doc) {
          if(doc.stocks && doc.stocks.length > 0) {
            totalCount += doc.stocks.length;
          }
        });
      }
    }

    stocktakes = Stocktakes.find({"version": Session.get("thisVersion"), "generalArea": id}).fetch();
    if(stocktakes && stocktakes.length > 0) {
      gProgress = (stocktakes.length/totalCount) * 100;
    }
    return (gProgress + "%");
  }
};

component.state.editable = function() {
  return Session.get("editStockTake");
};