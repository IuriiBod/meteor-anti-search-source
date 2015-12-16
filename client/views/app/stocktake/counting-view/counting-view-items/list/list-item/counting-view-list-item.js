Template.stockCountingListItem.onRendered(function() {
  var instance= this;
  this.$('[data-toggle="tooltip"]').tooltip();
  this.$(".counting").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function (value, response) {
    },
    success: function (response, newValue) {
      var self = this;
      var elemId = $(self).closest("li").attr("data-stockRef");
      var stockId = instance.data.id;
      if (newValue) {
        var count = isNaN(newValue) ? 0 : parseFloat(newValue);
        var info = {
          "version": instance.data.stocktakeId,
          "generalArea": instance.data.activeGeneralArea,
          "specialArea": instance.data.activeSpecialArea,
          "stockId": stockId,
          "counting": count
        };
        var main = StocktakeMain.findOne({_id: instance.data.stocktakeId});
        if (main) {
          Meteor.call("updateStocktake", elemId, info, HospoHero.handleMethodResult(function () {
            if ($(self).closest('li').next().length > 0) {
              $(self).closest('li').next().find('a').click();
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