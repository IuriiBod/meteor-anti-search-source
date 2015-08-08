var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.date = props.date;
  this.garea = props.garea;
  this.sarea = props.sarea;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  var stock = Ingredients.findOne(this.id);
  var stocktake = Stocktakes.findOne({
    "date": this.date, 
    "stockId": this.id, 
    "generalArea": this.garea,
    "specialArea": this.sarea
  });
  if(stock) {
    if(stocktake) {
      stock['stockRef'] = stocktake._id;
      stock['counting'] = stocktake.counting;
      stock['status'] = stocktake.status;
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
    success: function(response, newValue, q) {
      var stockId = $(this).closest("li").attr("data-id");
      var id = $(this).closest("li").attr("data-stockRef");
      var date = Session.get("thisDate");
      if(newValue) {
        var info = {
          "date": date,
          "generalArea": Session.get("activeGArea"),
          "specialArea": Session.get("activeSArea"),
          "stockId": stockId,
          "counting": parseFloat(newValue)
        }
        Meteor.call("updateStocktake", id, info, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
}