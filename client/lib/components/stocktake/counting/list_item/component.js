var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.stocktakeId = props.stocktakeId;
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
      stock['counting'] = null;
    }
    return stock;
  }
}

component.state.supplier = function() {
  var stock = Ingredients.findOne(this.id);
  if(stock && stock.suppliers) {
    var supplier = Suppliers.findOne(stock.suppliers);
    if(supplier) {
      return supplier.name;
    } else {
      return stock.suppliers;
    }
  } else {
    return "Not assigned";
  }
}

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.state.deletable = function(id) {
  if(id) {
    var stocktake = Stocktakes.findOne(id);
    if(stocktake) {
      if(!stocktake.status && !stocktake.orderRef) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}

component.prototype.onItemRendered = function() {
  $('[data-toggle="tooltip"]').tooltip();

  $(".counting").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: true,
    mode: 'inline',
    success: function(response, newValue) {
      var elem = $(this).closest("li");
      var stockId = $(elem).closest("li").attr("data-id");
      var id = $(elem).closest("li").attr("data-stockRef");
      if(newValue) {
        var count = parseFloat(newValue);
        if(count == count) {
          count = count;
        } else {
          count = 0;
        }
        var info = {
          "version": Session.get("thisVersion"),
          "generalArea": Session.get("activeGArea"),
          "specialArea": Session.get("activeSArea"),
          "stockId": stockId,
          "counting": count
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
    },
    display: function(a, b) {
    }
  });
}

component.state.countEditable = function(id) {
  var permitted = true;
  var stocktake = Stocktakes.findOne(id);
  if(stocktake) {
    if(stocktake.hasOwnProperty("orderRef")) {
      if(stocktake.orderRef) {
        var order = StockOrders.findOne(stocktake.orderRef);
        if(order) {
          if(order.hasOwnProperty("orderReceipt") && order.orderReceipt) {
            permitted = false;
          }
        }
      }
    }
  }
  return permitted;
}