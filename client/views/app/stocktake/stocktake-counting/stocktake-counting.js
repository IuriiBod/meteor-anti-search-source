Template.stocktakeCounting.onCreated(function () {
  this.set('editStockTake', false);
  this.set('activeSpecialArea', null);
  this.set('activeGeneralArea', null);
});

Template.stocktakeCounting.helpers({
  stockTakeCountingContext: function () {
    var tmpl = Template.instance();
    return {
      editableStockTake: tmpl.get('editStockTake'),
      stockTakeId: tmpl.data.stocktakeId,
      activeSpecialArea: tmpl.get('activeSpecialArea'),
      activeGeneralArea: tmpl.get('activeGeneralArea'),
      makeGeneralAreaActive: function (areaId) {
        tmpl.set('activeGeneralArea', areaId);
      },
      makeSpecialAreaActive: function (areaId) {
        tmpl.set('activeSpecialArea', areaId);
      }
    };
  },

  stockItemsList: function () {
    let specialAreaId = Template.instance().get('activeSpecialArea');
    return StockItems.find({
      stocktakeId: this._id,
      specialAreaId: specialAreaId
    }, {sort: {place: 1}});
  },

  ingredientsList: function () {
    let specialAreaId = Template.instance().get('activeSpecialArea');
    let specialArea = StockAreas.findOne({_id: specialAreaId});
    return Ingredients.findOne({_id: {$in: specialArea.ingredients}, status: "active"});
  },

  hasOrders: function () {
    return !!Orders.findOne({stocktakeId: this._id});
  }
});

Template.stocktakeCounting.events({
  'click .saveStockTake': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('editStockTake', false);
    tmpl.$(event.target).hide();
    tmpl.$(".editStockTake").show();
  },

  'click .editStockTake': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('editStockTake', true);
    tmpl.$(event.target).hide();
  },

  'click .generateOrders': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('editStockTake', false);
    var version = tmpl.data.stocktakeId;
    if (version) {
      Meteor.call("generateOrders", version, HospoHero.handleMethodResult(function () {
        Router.go("stocktakeOrdering", {"_id": version});
      }));
    }
  },

  'click .addStock': function (event, tmpl) {
    event.preventDefault();
    var currentSpecialAreaId = tmpl.get('activeSpecialArea');
    var currentSpecialArea = StockAreas.findOne({_id: currentSpecialAreaId});
    var idsOfItemsInList = currentSpecialArea.stocks;
    var onAddStockItem = function (stockId) {
      Meteor.call("assignStocksToAreas", stockId, currentSpecialAreaId, HospoHero.handleMethodResult());
    };

    FlyoutManager.open('wrapperFlyout', {
      template: 'stocksList',
      title: "Select Stocks",
      data: {
        inFlyout: true,
        onAddStockItem: onAddStockItem,
        idsToExclude: idsOfItemsInList
      }
    });
  }
});