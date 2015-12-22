Template.stockCounting.onCreated(function() {
  this.editStockTake = new ReactiveVar(false);
  this.activeSpecialArea = new ReactiveVar(null);
  this.activeGeneralArea = new ReactiveVar(null);
});

Template.stockCounting.helpers({
  stockTakeCountingContext: function() {
    var instance = Template.instance();
    return {
      editableStockTake: instance.editStockTake.get(),
      stockTakeId: instance.data.stocktakeId,
      activeSpecialArea: instance.activeSpecialArea.get(),
      activeGeneralArea: instance.activeGeneralArea.get(),
      makeGeneralAreaActive: function(areaId) {
        return instance.activeGeneralArea.set(areaId);
      },
      makeSpecialAreaActive: function(areaId) {
        return instance.activeSpecialArea.set(areaId);
      }
    };
  },

  stocktakeList: function() {
    var gareaId = Template.instance().activeGeneralArea.get();
    var sareaId = Template.instance().activeSpecialArea.get();
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
    var gareaId = Template.instance().activeGeneralArea.get();
    var sareaId = Template.instance().activeSpecialArea.get();
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
            "generalArea": Template.instance().activeGeneralArea.get(),
            "specialArea": Template.instance().activeSpecialArea.get()
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

  stocktakeMain: function() {
    return StocktakeMain.findOne({_id: this.stocktakeId});
  },

  notTemplate: function() {
    var main = StocktakeMain.findOne({_id: this.stocktakeId});
    return main && main.orderReceipts && main.orderReceipts.length > 0;
  },

  modalStockListParams: function() {
    var currentSpecialArea = Template.instance().activeSpecialArea.get();
    if(currentSpecialArea) {
      var stocks = SpecialAreas.findOne({_id: currentSpecialArea}).stocks;
      return {
        activeSpecialArea: currentSpecialArea,
        stockItemsInListIds: stocks
      }
    }
  }
});

Template.stockCounting.events({
  'click .saveStockTake': function (event, tmpl) {
    event.preventDefault();
    tmpl.editStockTake.set(false);
    $(event.target).hide();
    $(".editStockTake").show();
  },

  'click .addStock': function (event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  },

  'click .editStockTake': function (event, tmpl) {
    event.preventDefault();
    tmpl.editStockTake.set(true);
    $(event.target).hide();
    //setTimeout(function () {
    console.log($('.sarea'));
      $(".sarea").editable({
        type: "text",
        title: 'Edit Special area name',
        showbuttons: false,
        display: false,
        mode: 'inline',
        success: function (response, newValue) {
          var id = tmpl.activeSpecialArea.get();
          if (newValue) {
            Meteor.call("editSpecialArea", id, newValue, HospoHero.handleMethodResult());
          }
        }
      });

      $(".garea").editable({
        type: "text",
        title: 'Edit General area name',
        showbuttons: false,
        display: false,
        mode: 'inline',
        success: function (response, newValue) {
          var id = tmpl.activeGeneralArea.get();
          if (newValue) {
            Meteor.call("editGeneralArea", id, newValue, HospoHero.handleMethodResult());
          }
        }
      });

      $(".sortableStockItems").sortable({
        stop: function (event, ui) {
          var sortedStockItems = new SortableItemsHelper(ui).getSortedItems();
          if(sortedStockItems) {
            Meteor.call("stocktakePositionUpdate", sortedStockItems, HospoHero.handleMethodResult());
          }
        }
      });
    //}, 10);

  },

  'click .generateOrders': function (event, tmpl) {
    event.preventDefault();
    tmpl.editStockTake.set(false);
    var version = tmpl.data.stocktakeId;
    if (version) {
      Meteor.call("generateOrders", version, HospoHero.handleMethodResult(function () {
        Router.go("stocktakeOrdering", {"_id": version})
      }));
    }
  }
});

var SortableItemsHelper = function (ui) {
  this._draggedItem = this._getDataByItem(ui.item);
  this._previousItem = this._getDataByItem(ui.item.prev());
  this._nextItem = this._getDataByItem(ui.item.next());
};


SortableItemsHelper.prototype._getDataByItem = function (item) {
  var element = item[0];
  return element ? Blaze.getData(element) : null;
};

SortableItemsHelper.prototype._getOrder = function () {
  var place = 0;
  if (!this._nextItem && this._previousItem) {
    place = this._previousItem.item.place + 1;
  } else if (!this._previousItem && this._nextItem) {
    place = this._nextItem.item.place - 1;
  } else if (this._nextItem && this._previousItem) {
    place = (this._nextItem.item.place + this._previousItem.item.place) / 2;
  }

  return place;
};

SortableItemsHelper.prototype.getSortedItems = function() {
  var draggedItem = this._draggedItem.item._id;
  var nextItem = this._nextItem ? this._nextItem.item._id : null;
  var previousItem = this._previousItem ? this._previousItem.item._id : null;

  var specialArea = SpecialAreas.findOne({_id: this._draggedItem.stockTakeData.activeSpecialArea});
  if(specialArea) {
    var stocks = specialArea.stocks;
    var stockOldPosition = stocks.indexOf(draggedItem);
    var newPosition = 0;
    if (!previousItem && nextItem && stocks.indexOf(nextItem) > 0) {
      newPosition = (stocks.indexOf(nextItem) - 1);
    }
    if (!nextItem && previousItem) {
      newPosition = (stocks.indexOf(previousItem) + 1);
    }
    if (nextItem && previousItem) {
      if (stocks.indexOf(draggedItem) > stocks.indexOf(previousItem)) {
        newPosition = stocks.indexOf(previousItem) + 1;
      } else {
        newPosition = stocks.indexOf(previousItem);
      }
    }
  }

  stocks.splice(newPosition, 0, stocks.splice(stockOldPosition, 1)[0]);

  if (this._draggedItem.item.place) {
    draggedItem = {
      id: this._draggedItem.item._id,
      place: this._draggedItem.item.place
    }
  }
  return {
    activeSpecialArea: this._draggedItem.stockTakeData.activeSpecialArea,
    stocks: stocks,
    draggedItem: draggedItem
  };
};
