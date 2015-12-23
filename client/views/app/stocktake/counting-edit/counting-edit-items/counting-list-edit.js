Template.stockCountingEdit.onCreated(function() {
  this.set('activeSpecialArea', null);
  this.set('activeGeneralArea', null);
});

Template.stockCountingEdit.helpers({
  stockTakeCountingContext: function() {
    var instance = Template.instance();
    return {
      stockTakeId: instance.data.stocktakeId,
      activeSpecialArea: instance.get('activeSpecialArea'),
      activeGeneralArea: instance.get('activeGeneralArea'),
      makeGeneralAreaActive: function(areaId) {
        return instance.set('activeGeneralArea', areaId);
      },
      makeSpecialAreaActive: function(areaId) {
        return instance.set('activeSpecialArea', areaId);
      }
    };
  },

  ingredientsList: function() {
    var instance = Template.instance();
    var gareaId = instance.get('activeGeneralArea');
    var sareaId = instance.get('activeSpecialArea');
    if (gareaId && sareaId) {
      var sarea = SpecialAreas.findOne({_id: sareaId});
      var ings = [];
      if (sarea && sarea.stocks.length > 0) {
        var ids = sarea.stocks;
        var self = this;
        ids.forEach(function (id) {
          var item = Ingredients.findOne({"_id": id, "status": "active"});
          var stocktake = Stocktakes.findOne({
            "version": self.stocktakeId,
            "stockId": id,
            "generalArea": gareaId,
            "specialArea": sareaId
          });
          if (item) {
            if (stocktake) {
              _.extend(item, {
                stockRef: stocktake._id,
                counting: stocktake.counting,
                status: stocktake.status,
                place: stocktake.place
              });
            }
            ings.push(item);
          }
        });
        return ings;
      }
    }
  },

  stockTakeDate: function() {
    return StocktakeMain.findOne({_id: this.stocktakeId}).stocktakeDate;
  },

  modalStockListParams: function() {
    var currentSpecialArea = Template.instance().get('activeSpecialArea');
    if(currentSpecialArea) {
      var stocks = SpecialAreas.findOne({_id: currentSpecialArea}).stocks;
      return {
        activeSpecialArea: currentSpecialArea,
        stockItemsInListIds: stocks
      }
    }
  }
});

Template.stockCountingEdit.events({
  'click .addStock': function (event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  },

  'click .generateOrders': function (event, tmpl) {
    event.preventDefault();
    var version = tmpl.data.stocktakeId;
    if (version) {
      Meteor.call("generateOrders", version, HospoHero.handleMethodResult(function () {
        Router.go("stocktakeOrdering", {"_id": version})
      }));
    }
  }
});
