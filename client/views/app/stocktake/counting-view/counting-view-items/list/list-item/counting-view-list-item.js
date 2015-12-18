Template.stockCountingListItem.onRendered(function() {
  var instance = this;
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
      var elemId = instance.data.item.stockRef || instance.data.item._id;
      console.log(elemId);
      var stockId = instance.data.item.stockId || instance.data.item._id;
      console.log(stockId);
      if (newValue) {
        var count = isNaN(newValue) ? 0 : parseFloat(newValue);
        var info = {
          "version": instance.data.stockTakeData.stockTakeId,
          "generalArea": instance.data.stockTakeData.activeGeneralArea,
          "specialArea": instance.data.stockTakeData.activeSpecialArea,
          "stockId": stockId,
          "counting": count
        };
        var main = StocktakeMain.findOne({_id: instance.data.stockTakeData.stockTakeId});
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
    var item = this.item;
    if(item.stockId) {
      var ingredient = Ingredients.findOne({_id: item.stockId});
      if(ingredient) {
        item['description'] = ingredient.description;
        item['suppliers'] = ingredient.suppliers;
        item['portionOrdered'] = ingredient.portionOrdered;
      }
    }
    return item;

  },

  editable: function() {
    return this.stockTakeData.editableStockTake;
  },

  deletable: function(id) {
    if (id) {
      var stocktake = Stocktakes.findOne({_id: id});
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
    var stocktake = Stocktakes.findOne({_id: id});
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
      console.log(this);
      var id = this.item._id;
      var sareaId = tmpl.data.stockTakeData.activeSpecialArea;
      var stockRefId = this.item.stockRef;
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