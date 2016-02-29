Template.stockCountingListItem.onCreated(function() {
  this.getIngredientFromStock = function() {
    return Stocktakes.findOne({stockId: this.data.ingredient._id});
  };
});

Template.stockCountingListItem.onRendered(function() {
  this.$('[data-toggle="tooltip"]').tooltip();

  var tmpl = this;
  var onCountChanged = function (response, newValue) {
    var element = this;
    var stockRefId = tmpl.data.stocktakeItem ? tmpl.data.stocktakeItem._id : tmpl.getIngredientFromStock() && tmpl.getIngredientFromStock()._id;
    var stockId = tmpl.data.stocktakeItem ? tmpl.data.stocktakeItem.stockId : tmpl.data.ingredient._id;
    if (newValue) {
      var count = isNaN(newValue) ? 0 : Math.round(parseFloat(newValue) * 100) / 100;
      var info = {
        version: tmpl.data.stockTakeData.stockTakeId,
        generalArea: tmpl.data.stockTakeData.activeGeneralArea,
        specialArea: tmpl.data.stockTakeData.activeSpecialArea,
        stockId: stockId,
        counting: count
      };
      var main = StocktakeMain.findOne({_id: tmpl.data.stockTakeData.stockTakeId});
      if (main) {
        Meteor.call("updateStocktake", stockRefId, info, newValue, HospoHero.handleMethodResult(function () {
          if ($(element).closest('li').next().length > 0) {
            $(element).closest('li').next().find('a').click();
          }
        }));
      }
    }
  };

  this.$(".counting").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function (value, response) {

    },
    success: onCountChanged
  });
});

Template.stockCountingListItem.helpers({
  ingredient: function() {
    if(this.ingredient) {
      return {
        inStock: Template.instance().getIngredientFromStock(),
        data: this.ingredient
      }
    }
    if(this.stocktakeItem) {
      return {
        inStock: this.stocktakeItem,
        data: Ingredients.findOne({_id: this.stocktakeItem.stockId})
      }
    }
  },

  canEditIngredientsItem: function(id) {
    var permitted = true;
    var stocktake = Stocktakes.findOne({_id: id});
    if (stocktake && stocktake.orderRef) {
      var order = StockOrders.findOne({_id: stocktake.orderRef});
      permitted = order && order.orderReceipt;
    }
    return permitted;
  }
});

Template.stockCountingListItem.events({
  'click .removeFromList': function (event, tmpl) {
    event.preventDefault();
    var confrimDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if (confrimDelete) {
      var id = this.ingredient._id;
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