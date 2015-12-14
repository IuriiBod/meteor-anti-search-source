Template.stockCountingListItem.onRendered(function() {
  var self = this;
  $('[data-toggle="tooltip"]').tooltip();

  $(".counting").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function (value, response) {
    },
    success: function (response, newValue) {
      var elem = $(this).closest("li");
      var stockId = $(elem).closest("li").attr("data-id");
      var id = $(elem).closest("li").attr("data-stockRef");
      if (newValue) {
        var count = parseFloat(newValue);
        count = isNaN(count) ? 0 : count;
        var info = {
          "version": self.data.stocktakeId,
          "generalArea": self.data.activeGeneralArea,
          "specialArea": self.data.activeSpecialArea,
          "stockId": stockId,
          "counting": count
        };
        var main = StocktakeMain.findOne({_id: self.data.stocktakeId});
        if (main) {
          Meteor.call("updateStocktake", id, info, HospoHero.handleMethodResult(function () {
            if ($(elem).next().length > 0) {
              $(elem).next().find("a").click();
            }
            Meteor.call("resetCurrentStock", stockId, "New stock count", newValue, main.stocktakeDate, HospoHero.handleMethodResult());
          }));
        }
      }
    }
  });
});

Template.stockCountingListItem.helpers({
  item: function() {
    var stock = Ingredients.findOne({_id: this.id});
    var stocktake = Stocktakes.findOne({
      "version": this.stocktakeId,
      "stockId": this.id,
      "generalArea": this.activeGeneralArea,
      "specialArea": this.activeSpecialArea
    });
    if (stock) {
      if (stocktake) {
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
  },

  editable: function() {
    return this.editStockTake;
  },

  deletable: function(id) {
    if (id) {
      var stocktake = Stocktakes.findOne(id);
      if (stocktake) {
        return !!(!stocktake.status && !stocktake.orderRef);
      } else {
        return true;
      }
    } else {
      return true;
    }
  },

  countEditable: function(id) {
    var permitted = true;
    var stocktake = Stocktakes.findOne(id);
    if (stocktake) {
      if (stocktake.hasOwnProperty("orderRef")) {
        if (stocktake.orderRef) {
          var order = StockOrders.findOne(stocktake.orderRef);
          if (order) {
            if (order.hasOwnProperty("orderReceipt") && order.orderReceipt) {
              permitted = false;
            }
          }
        }
      }
    }
    return permitted;
  }
});

Template.stockCountingListItem.events({
  'click .removeFromList': function (event, tmpl) {
    event.preventDefault();
    var confrimDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if (confrimDelete) {
      var id = this.id;
      var sareaId = tmpl.data.activeSpecialArea;
      var stockRefId = $(event.target).closest("li").attr("data-stockRef");
      var stocktake = Stocktakes.findOne(stockRefId);
      if (stocktake) {
        if (stocktake.status || stocktake.orderRef) {
          return alert("Order has been created. You can't delete this stocktake item.")
        }
      }

      Meteor.call("removeStocksFromAreas", id, sareaId, stockRefId, HospoHero.handleMethodResult());
    }
  }
});