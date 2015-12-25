Template.stockCountingList.onCreated(function() {
  this.set('editStockTake', false);
  this.set('activeSpecialArea', null);
  this.set('activeGeneralArea', null);
});

Template.stockCountingList.helpers({
  stockTakeCountingContext: function() {
    var instance = Template.instance();
    return {
      editableStockTake: instance.get('editStockTake'),
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

  stocktakeList: function() {
    var gareaId = Template.instance().get('activeGeneralArea');
    var sareaId = Template.instance().get('activeSpecialArea');
    if (gareaId && sareaId) {
      var main = StocktakeMain.findOne({_id: this.stocktakeId});
      if (main && main.orderReceipts && main.orderReceipts.length > 0) {
        var stocktakes = Stocktakes.find({
          "version": this.stocktakeId,
          "generalArea": gareaId,
          "specialArea": sareaId
        }, {sort: {"place": 1}});
        if (stocktakes) {
          return stocktakes;
        }
      }
    }
  },

  ingredientsList: function() {
    var gareaId = Template.instance().get('activeGeneralArea');
    var sareaId = Template.instance().get('activeSpecialArea');
    if (gareaId && sareaId) {
      var sarea = SpecialAreas.findOne({_id: sareaId});
      var ings = [];
      if (sarea && sarea.stocks.length > 0) {
        var ids = sarea.stocks;
        ids.forEach(function (id) {
          var item = Ingredients.findOne({"_id": id, "status": "active"});
          if (item) {
            ings.push(item);
          }
        });
        return ings;
      }
    }
  },

  stockTakeMain: function() {
    return StocktakeMain.findOne({_id: this.stocktakeId});
  },

  notTemplate: function() {
    var main = StocktakeMain.findOne({_id: this.stocktakeId});
    return main && main.orderReceipts && main.orderReceipts.length > 0;
  },

  modalStockListParams: function() {
    var currentSpecialAreaId = Template.instance().get('activeSpecialArea');
    if(currentSpecialAreaId) {
      var specialArea = SpecialAreas.findOne({_id: currentSpecialAreaId});
      if (specialArea) {
        return {
          activeSpecialArea: currentSpecialAreaId,
          stockItemsInListIds: specialArea.stocks
        }
      }
    }
  }
});

Template.stockCountingList.events({
  'click .saveStockTake': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('editStockTake', false);
    $(event.target).hide();
    $(".editStockTake").show();
  },

  'click .editStockTake': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('editStockTake', true);
    $(event.target).hide();
  },

  'click .generateOrders': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('editStockTake', false);
    var version = tmpl.data.stocktakeId;
    if (version) {
      Meteor.call("generateOrders", version, HospoHero.handleMethodResult(function () {
        Router.go("stocktakeOrdering", {"_id": version})
      }));
    }
  },

  'click .addStock': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#stocksListModal").modal("show");
  }
});