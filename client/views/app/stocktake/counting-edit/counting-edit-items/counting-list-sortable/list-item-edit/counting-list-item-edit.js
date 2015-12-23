Template.stockCountingListItemEdit.onRendered(function() {
  var tmplData = this.data;
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
      var element = this;
      var elemId = tmplData.item.stockRef || tmplData.item._id;
      var stockId = tmplData.item.stockId || tmplData.item._id;
      if (newValue) {
        var count = isNaN(newValue) ? 0 : parseFloat(newValue);
        var info = {
          "version": tmplData.stockTakeData.stockTakeId,
          "generalArea": tmplData.stockTakeData.activeGeneralArea,
          "specialArea": tmplData.stockTakeData.activeSpecialArea,
          "stockId": stockId,
          "counting": count
        };
        var main = StocktakeMain.findOne({_id: tmplData.stockTakeData.stockTakeId});
        if (main) {
          Meteor.call("updateStocktake", elemId, info, newValue, HospoHero.handleMethodResult(function () {
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