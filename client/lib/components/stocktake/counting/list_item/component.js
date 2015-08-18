var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.version = props.version;
  this.garea = props.garea;
  this.sarea = props.sarea;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  var stock = Ingredients.findOne(this.id);
  var stocktake = Stocktakes.findOne({
    "version": this.version, 
    "stockId": this.id, 
    "generalArea": this.garea,
    "specialArea": this.sarea
  });
  if(stock) {
    if(stocktake) {
      stock['stockRef'] = stocktake._id;
      stock['counting'] = stocktake.counting;
      stock['status'] = stocktake.status;
      stock['place'] = stocktake.place;
    } else {
      stock['stockRef'] = null;
      stock['counting'] = 0;
    }
    return stock;
  }
}

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.state.deletable = function(id) {
  var stocktake = Stocktakes.findOne(id);
  if(stocktake && !stocktake.status && !stocktake.orderRef) {
    return true;
  } else {
    return false;
  }
}

component.prototype.onItemRendered = function() {
  $(".counting").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var elem = $(this).closest("li");
      var stockId = $(elem).closest("li").attr("data-id");
      var id = $(elem).closest("li").attr("data-stockRef");
      if(newValue) {
        var info = {
          "version": Session.get("thisVersion"),
          "generalArea": Session.get("activeGArea"),
          "specialArea": Session.get("activeSArea"),
          "stockId": stockId,
          "counting": parseFloat(newValue)
        }
        $(elem).next().find("a").click();
        var main = StocktakeMain.findOne(Session.get("thisVersion"));
        if(main) {
          Meteor.call("updateStocktake", id, info, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } else {
              Meteor.call("resetCurrentStock", stockId, "New stock count", newValue, main.stocktakeDate, function(err) {
                if(err) {
                  console.log(err);
                  return alert(err.reason);
                }
              });
            }
          });
        }
      }
    }
  });
}