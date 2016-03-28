Template.stocktakeCounting.onCreated(function () {
  this.activeGeneralAreaId = new ReactiveVar(false);
  this.activeSpecialAreaId = new ReactiveVar(false);
  this.stocktakeEditMode = new ReactiveVar(false);
});

Template.stocktakeCounting.helpers({
  isEditMode: function () {
    return Template.instance().stocktakeEditMode.get();
  },

  activeAreas: function () {
    var tmpl = Template.instance();
    return {
      general: tmpl.activeGeneralAreaId.get(),
      special: tmpl.activeSpecialAreaId.get()
    };
  },

  onStockAreaSelect: function () {
    let tmpl = Template.instance();
    return function (stockArea) {
      if (stockArea) {
        let isSpecialArea = !!stockArea.generalAreaId;
        if (isSpecialArea) {
          tmpl.activeSpecialAreaId.set(stockArea._id);
        } else {
          tmpl.activeGeneralAreaId.set(stockArea._id);
        }
      }
    };
  },

  hasOrders: function () {
    return !!Orders.findOne({stocktakeId: this._id});
  },

  totalStocktakeCost: function () {
    let totalStocktakeCost = 0;
    StockItems.find({stocktakeId: this._id}).forEach((stockItem) => {
      totalStocktakeCost += stockItem.count * stockItem.ingredient.cost
    });
    return totalStocktakeCost;
  }
});

Template.stocktakeCounting.events({
  'click .finish-template-editing-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.stocktakeEditMode.set(false);
  },

  'click .edit-template-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.stocktakeEditMode.set(true);
  },

  'click .generate-orders-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.stocktakeEditMode.set(false);
    let stocktakeId = tmpl.data._id;

    Meteor.call('generateOrders', stocktakeId, HospoHero.handleMethodResult(function () {
      Router.go('stocktakeOrdering', {_id: stocktakeId});
    }));
  },

  'click .add-ingredient-button': function (event, tmpl) {
    event.preventDefault();

    let currentSpecialAreaId = tmpl.activeSpecialAreaId.get();
    let currentSpecialArea = StockAreas.findOne({_id: currentSpecialAreaId});

    let onAddStockItem = function (ingredientId) {
      Meteor.call("assignIngredientToStockArea", ingredientId, currentSpecialAreaId, HospoHero.handleMethodResult());
    };

    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientsModalList',
      title: 'Select Stocks',
      data: {
        inFlyout: true,
        onAddStockItem: onAddStockItem,
        idsToExclude: currentSpecialArea.ingredientsIds
      }
    });
  }
});