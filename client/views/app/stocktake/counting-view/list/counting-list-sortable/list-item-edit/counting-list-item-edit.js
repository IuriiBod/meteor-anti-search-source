Template.stockCountingListItemEdit.onCreated(function() {
  this.getIngredientFromStock = function() {
    return Stocktakes.findOne({stockId: this.data.item._id});
  };
});

Template.stockCountingListItemEdit.onRendered(function() {
  this.$('[data-toggle="tooltip"]').tooltip();
  var self = this;

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
      var element = this;
      var stockRefId = self.getIngredientFromStock() ? self.getIngredientFromStock()._id : null;
      var stockId = self.data.item._id;
      if (newValue) {
        var count = isNaN(newValue) ? 0 : parseFloat(newValue);
        var info = {
          "version": self.data.stockTakeData.stockTakeId,
          "generalArea": self.data.stockTakeData.activeGeneralArea,
          "specialArea": self.data.stockTakeData.activeSpecialArea,
          "stockId": stockId,
          "counting": count
        };
        var main = StocktakeMain.findOne({_id: self.data.stockTakeData.stockTakeId});
        if (main) {
          Meteor.call("updateStocktake", stockRefId, info, newValue, HospoHero.handleMethodResult(function () {
            if ($(element).closest('li').next().length > 0) {
              $(element).closest('li').next().find('a').click();
            }
          }));
        }
      }
    }
  });
});

Template.stockCountingListItemEdit.helpers({
  ingredient: function() {
    if (this.item) {
      return {
        inStock: Template.instance().getIngredientFromStock(),
        data: this.item
      }
    }
  },

  canEditIngredientsItem: function(id) {
    var permitted = true;
    var stocktake = Stocktakes.findOne({_id: id});
    if (stocktake && stocktake.orderRef) {
      var order = StockOrders.findOne(stocktake.orderRef);
      permitted = order && order.orderReceipt;
    }
    return permitted;
  }
});

Template.stockCountingListItemEdit.events({
  'click .removeFromList': function (event, tmpl) {
    event.preventDefault();
    var confrimDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if (confrimDelete) {
      var id = this.item._id;
      var sareaId = tmpl.data.stockTakeData.activeSpecialArea;
      var stockRefId = tmpl.getIngredientFromStock() ? tmpl.getIngredientFromStock()._id : null;
      var stocktake = Stocktakes.findOne({_id: stockRefId});
      if (stocktake) {
        if (stocktake.status || stocktake.orderRef) {
          return alert("Order has been created. You can't delete this stocktake item.")
        }
      }
      Meteor.call("removeStocksFromAreas", id, sareaId, stockRefId, HospoHero.handleMethodResult());
    }
  }
});